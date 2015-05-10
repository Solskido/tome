/**
 * TomeController
 *
 * @description :: Server-side logic for managing tomes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	/**
	 * `TomeController.index()`
	 */
	index: function(req, res)
	{
		if(req.session.user)
		{
			Rooms.find({
				"visible": true
			}).sort({ "open": -1 }).exec(function(err, roomsResult)
			{
				if(err)
				{
					sails.log.error(err);
					return res.serverError(err);
				}

				return res.view("tome/index", {
					"layout": "layout",
					"viewid": "rooms",

					"bgImage": "/images/roomsbg.jpg",
					"rooms": roomsResult
				});
			});
		}
		else
		{
			return res.view("tome/login", {
				"layout": "tome/loginlayout"
			});
		}
	},

	/**
	 * `TomeController.signup()`
	 */
	signup: function(req, res)
	{
		var invitationToken = req.param("t") || null;
		if(req.session.user
		|| !invitationToken)
		{
			return res.redirect("/");
		}

		LOOKUP.validInvitationToken(invitationToken, function(err, valid)
		{
			if(err)
			{
				return res.serverError(err);
			}
			else if(!valid)
			{
				return res.redirect("/");
			}

			req.session.invitationToken = invitationToken;

			return res.view("tome/signup", {
				"layout": "tome/loginlayout"
			});
		});
	},

	/**
	 * `TomeController.room()`
	 */
	room: function(req, res)
	{
		var roomTag = req.param("tag") || null;
		var pageNumber = req.param("p") || null;
		if(pageNumber)
		{
			pageNumber = parseInt(pageNumber, 10);
			if(isNaN(pageNumber)
			|| (pageNumber < 1))
			{
				return res.notFound();
			}
		}

		if(!roomTag)
		{
			return res.badRequest();
		}

		var options = {
			"tag": roomTag
		};
		if(!req.session.user.dm)
		{
			options.visible = true;
		}

		Rooms.findOne(options).exec(function(err, roomResult)
		{
			if(err)
			{
				sails.log.error(err);
				return res.serverError(err);
			}
			else if(!roomResult)
			{
				return res.notFound();
			}

			Posts.count({ "id": roomResult.posts }).exec(function(err, postCount)
			{
				if(err)
				{
					sails.log.error(err);
					return res.serverError(err);
				}

				var highestPage = Math.ceil(postCount / LOOKUP.ROOM_PAGE_SIZE);
				if(pageNumber)
				{
					if(pageNumber > highestPage)
					{
						return res.notFound();
					}
				}
				else
				{
					pageNumber = highestPage;
				}

				var skip = ((pageNumber - 1) * LOOKUP.ROOM_PAGE_SIZE);
				Posts.find({
					"id": roomResult.posts
				}).skip(skip)
				.limit(LOOKUP.ROOM_PAGE_SIZE)
				.populate("character")
				.populate("player")
				.exec(function(err, postResults)
				{
					if(err)
					{
						sails.log.error(err);
						return res.serverError(err);
					}

					roomResult.posts = _.map(postResults, function(post)
					{
						post.number = ++skip;
						return post;
					});
					return res.view("tome/room", {
						"layout": "layout",
						"viewid": "room",

						"bgImage": roomResult.image,
						"room": roomResult,

						"pages": highestPage,
						"page": pageNumber
					});
				});
			});
		});
	},

	/**
	 * `TomeController.dmscreen()`
	 */
	dmscreen: function(req, res)
	{
		return res.view("dm/screen", {
			"layout": "layout",
			"viewid": "dmscreen",

			"bgImage": "/images/dmscreen.png"
		});
	},

	/**
	 * `TomeController.roommanager()`
	 */
	roommanager: function(req, res)
	{
		Rooms.find().sort({ "visible": -1, "open": -1 }).exec(function(err, roomsResult)
		{
			if(err)
			{
				sails.log.error(err);
				return res.serverError(err);
			}

			return res.view("dm/rooms", {
				"layout": "layout",
				"viewid": "roommanager",

				"rooms": roomsResult,
				"bgImage": "/images/roomsbg.jpg"
			});
		});
	},

	/**
	 * `TomeController.newroom()`
	 */
	newroom: function(req, res)
	{
		return res.view("dm/newroom", {
			"layout": "layout",
			"viewid": "roommanager",

			"bgImage": "/images/roomsbg.jpg"
		});
	},

	/**
	 * `TomeController.players()`
	 */
	players: function(req, res)
	{
		Users.find().exec(function(err, userResults)
		{
			if(err)
			{
				sails.log.error(err);
				return res.serverError(err);
			}

			var characters = [];
			userResults = _.map(userResults, function(user)
			{
				characters = _.union(characters, user.characters);
				return user.toJSON();
			});

			Characters.find({
				"id": characters
			}).exec(function(err, characterResults)
			{
				if(err)
				{
					sails.log.error(err);
					return res.serverError(err);
				}

				userResults = _.map(userResults, function(user)
				{
					user.characters = _.map(user.characters, function(char)
					{
						return _.find(characterResults, { "id": char });
					});
					return user;
				});

				return res.view("dm/players", {
					"layout": "layout",
					"viewid": "players",

					"players": userResults,
					"bgImage": "/images/playersbg.jpg"
				});
			});
		});
	}
};