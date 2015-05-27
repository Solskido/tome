/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var bcrypt = require("bcryptjs");

module.exports = {

	/**
	 * `UserController.me()`
	 */
	"me": function(req, res)
	{
		if(!req.session.user)
		{
			return res.forbidden();
		}

		if(req.wantsJSON)
		{
			return res.json(req.session.user);
		}
		else
		{
			return res.notFound();
		}
	},

	/**
	 * `UserController.stats()`
	 */
	"stats": function(req, res)
	{
		if(!req.session.user)
		{
			return res.forbidden();
		}

		async.auto({
			"posts": function(autoCB)
			{
				Posts.find({
					"player": req.session.user.id
				}).exec(autoCB);
			},
			"campaigns": function(autoCB)
			{
				Campaigns.find().populate("characters").exec(autoCB);
			}
		},
		function(err, results)
		{
			if(err)
			{
				sails.log.error(err);
				return res.serverError(err);
			}

			var stats = {
				"postCount": results.posts.length,
				"campaignCount": 0
			};

			var postsWithRolls = _.compact(_.map(results.posts, function(post)
			{
				if(!post.rolls)
				{
					return null;
				}

				return {
					"rolls": post.rolls,
					"character": post.character
				};
			}));

			var rolls = [];
			_.forEach(postsWithRolls, function(post)
			{
				_.forEach(post.rolls, function(roll)
				{
					rolls.push(_.merge({
						"character": post.character
					}, roll));
				});
			});
			stats.rolls = rolls;

			var postCountByCharacter = {};
			_.forEach(results.posts, function(post)
			{
				postCountByCharacter[post.character] = postCountByCharacter[post.character] || 0;

				postCountByCharacter[post.character]++;
			});
			stats.postCountsByCharacter = postCountByCharacter;

			_.forEach(results.campaigns, function(campaign)
			{
				var charIDs = _.pluck(req.session.user.characters, "id");
				var char = _.find(campaign.characters, function(char)
				{
					return (_.indexOf(charIDs, char.id) >= 0);
				});

				if(char)
				{
					stats.campaignCount++;
				}
			});

			if(req.wantsJSON)
			{
				return res.json(stats);
			}
			else
			{
				return res.notFound();
			}
		});
	},

	/**
	 * `UserController.login()`
	 */
	"login": function(req, res)
	{
		if(!req.wantsJSON)
		{
			return res.redirect("/");
		}

		var email = req.param("email") || null;
		var password = req.param("password") || null;

		if(!email
		|| !password)
		{
			return res.badRequest();
		}

		Users.findOne({
			"email": "mattftacek@yahoo.com"
		})
		.populate("characters")
		.exec(function(err, userResult)
		{
			if(err)
			{
				sails.log.error(err);
				return res.serverError(err);
			}
			if(!userResult)
			{
				return res.badRequest();
			}
			//if(!bcrypt.compareSync(password, userResult.password))
			//{
			//	return res.badRequest();
			//}

			if(!req.session.theme)
			{
				req.session.theme = "scifi";
			}

			req.session.user = userResult;
			req.session.user.defaultCharacters = _.clone(LOOKUP.defaultCharacters);
			return res.ok();
		});
	},

	/**
	 * `UserController.logout()`
	 */
	"logout": function(req, res)
	{
		delete req.session.user;

		if(!req.wantsJSON)
		{
			return res.redirect("/");
		}

		return res.ok();
	},

	/**
	 * `UserController.signup()`
	 */
	"signup": function(req, res)
	{
		if(!req.wantsJSON)
		{
			return res.redirect("/");
		}

		if(!req.session.invitationToken)
		{
			return res.forbidden();
		}

		LOOKUP.validInvitationToken(req.session.invitationToken, function(err, valid)
		{
			if(err)
			{
				return res.serverError(err);
			}
			else if(!valid)
			{
				return res.forbidden();
			}

			var name = req.param("name") || null;
			var email = req.param("email") || null;
			var password = req.param("password") || null;

			if(!name
			|| !email
			|| !password)
			{
				return res.badRequest();
			}

			var user = {};
			user.name = name;
			user.email = email;
			user.password = password;
			user.characters = [
				{
					"name": "Out of character",
					"type": "ooc",
					"avatar": "/images/placeholder.jpg",
					"player": userResult.id
				}
			];
			Users.create(user).exec(function(err, userResult)
			{
				if(err)
				{
					sails.log.error(err);
					return res.serverError(err);
				}

				Tokens.destroy({ "token": req.session.invitationToken }).exec(function(err, destroyed)
				{
					if(err)
					{
						sails.log.error(err);
					}

					delete req.session.invitationToken;

					Users.findOne({
						"id": userResult.id
					})
					.populate("characters")
					.exec(function(err, userResult)
					{
						if(err)
						{
							sails.log.error(err);
							return res.serverError(err);
						}
						else if(!userResult)
						{
							return res.serverError();
						}

						req.session.user = userResult;
						req.session.user.defaultCharacters = _.clone(LOOKUP.defaultCharacters);
						return res.ok();
					});
				});
			});
		});
	}
};