/**
 * PostsController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	/**
	 * `PostsController.post()`
	 */
	post: function(req, res)
	{
		var roomID = req.param("room") || null;
		var characterID = req.param("character") || null;
		var message = req.param("message") || null;

		if(!roomID
		|| !characterID
		|| !message
		|| (message.trim() === ""))
		{
			return req.badRequest();
		}

		Users.findOne({
			"id": req.session.user.id
		}).exec(function(err, userResult)
		{
			if(err)
			{
				sails.log.error(err);
				return res.serverError(err);
			}
			else if(!userResult)
			{
				sails.log.info("Wut");
				delete req.session.user;
				return res.redirect("/");
			}

			Characters.find({
				"id": userResult.characters
			}).sort({ "createdAt": "-1" }).exec(function(err, characterResults)
			{
				if(err)
				{
					sails.log.error(err);
					return res.serverError(err);
				}

				userResult.characters = characterResults;
				req.session.user = userResult;

				if(!LOOKUP.ownsCharacter(req.session.user, characterID))
				{
					return res.forbidden();
				}

				Rooms.findOne({
					"id": roomID
				}).exec(function(err, roomResult)
				{
					if(err)
					{
						sails.log.error(err);
						return res.serverError(err);
					}
					else if(!roomResult)
					{
						return res.badRequest();
					}
					else if((!roomResult.open
						|| !roomResult.visible)
					&& (!req.session.user.dm))
					{
						return res.forbidden();
					}

					var post = {};
					post.player = userResult.id;
					post.character = _.find(req.session.user.characters, { "id": characterID }).id;
					post.room = roomResult.id;
					post.message = message.trim();

					var rolls = [];

					var lines = post.message.split("\n");
					var outputLines = [];
					_.forEach(lines, function(line)
					{
						var trimmed = line.trim();
						if(line.substr(0, 1) === "/")
						{
							var commandParts = line.substr(1).toLowerCase().split(" ");
							switch(commandParts[0])
							{
								case "flip":
									/****************/
									/*	Coin flip	*/
									/****************/
									var roll = Dice.roll(2);
									rolls.push({
										"die": 2,
										"roll": roll,
										"add": 0,
										"subtract": 0,
										"total": roll
									});
									return;
								case "roll":
									/****************/
									/*	Dice roll	*/
									/****************/
									if(commandParts.length < 2)
									{
										return;
									}
									var result = {
										"roll": 0,
										"add": 0,
										"subtract": 0,
										"total": 0
									};
									switch(commandParts[1])
									{
										case "d2":
											result.die = 2;
											break;
										case "d4":
											result.die = 4;
											break;
										case "d6":
											result.die = 6;
											break;
										case "d8":
											result.die = 8;
											break;
										case "d10":
											result.die = 10;
											break;
										case "d12":
											result.die = 12;
											break;
										case "d20":
											result.die = 20;
											break;
										case "d%":
										case "d100":
											result.die = 100;
											break;
										default:
											break;
									}
									if(result.die)
									{
										result.total = result.roll = Dice.roll(result.die);
									}
									else
									{
										return;
									}
									if(commandParts.length > 2)
									{
										switch(commandParts[2])
										{
											case "plus":
											case "add":
											case "+":
												if(commandParts.length > 3)
												{
													var addition = parseInt(commandParts[3], 10);
													if(!isNaN(addition))
													{
														result.add = addition;
														result.total = result.roll + addition;
													}
												}
												break;
											case "minus":
											case "subtract":
											case "-":
												if(commandParts.length > 3)
												{
													var subtraction = parseInt(commandParts[3], 10);
													if(!isNaN(subtraction))
													{
														result.subtract = subtraction;
														result.total = result.roll - subtraction;
													}
												}
												break;
											default:
												break;
										}
									}
									rolls.push(result);
									return;
								default:
									outputLines.push(line);
									return;
							}
						}
						else
						{
							outputLines.push(line);
						}
					});
					post.message = outputLines.join("\n");
					if(rolls.length)
					{
						post.rolls = rolls;
					}

					Posts.count({
						"id": roomResult.posts
					}).exec(function(err, postCount)
					{
						if(err)
						{
							sails.log.error(err);
							return res.serverError(err);
						}

						Posts.create(post).exec(function(err, savedPost)
						{
							if(err)
							{
								sails.log.error(err);
								return res.serverError(err);
							}

							if(!roomResult.posts)
							{
								roomResult.posts = [savedPost.id];
							}
							else
							{
								roomResult.posts.push(savedPost.id);
							}
							roomResult.save(function(err, savedRoom)
							{
								if(err)
								{
									sails.log.error(err);
									return res.serverError(err);
								}

								Posts.findOne({
									"id": savedPost.id
								}).populate("player").populate("character").exec(function(err, populatedPost)
								{
									if(err)
									{
										sails.log.error(err);
										return res.serverError(err);
									}

									populatedPost.number = (postCount + 1);
									return res.json(populatedPost);
								});
							});
						});
					});
				});
			});
		});
	},

	/**
	 * `PostsController.getOne()`
	 */
	getOne: function(req, res)
	{
		var postID = req.param("id") || null;

		if(!postID)
		{
			return res.badRequest();
		}

		Posts.findOne({
			"id": postID
		}).populate("character")
		.exec(function(err, postResult)
		{
			if(err)
			{
				sails.log.error(err);
				return res.serverError(err);
			}
			else if(!postResult)
			{
				return res.badRequest();
			}
			else if(!LOOKUP.ownsCharacter(req.session.user, postResult.character.id))
			{
				return res.forbidden();
			}
			else
			{
				return res.json({ "message": postResult.message });
			}
		});
	},

	/**
	 * `PostsController.edit()`
	 */
	edit: function(req, res)
	{
		var postID = req.param("id") || null;
		var message = req.param("message") || null;

		if(!postID
		|| !message)
		{
			return res.badRequest();
		}

		Posts.findOne({
			"id": postID
		}).populate("character")
		.exec(function(err, postResult)
		{
			if(err)
			{
				sails.log.error(err);
				return res.serverError(err);
			}
			else if(!postResult)
			{
				return res.badRequest();
			}
			else if(!LOOKUP.ownsCharacter(req.session.user, postResult.character.id))
			{
				return res.forbidden();
			}
			else
			{
				postResult.message = message;
				postResult.save(function(err, savedPost)
				{
					return res.json({ "message": savedPost.message });
				});
			}
		});
	}
};