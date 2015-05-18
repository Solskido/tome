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
	"index": function(req, res)
	{
		req.session.theme = ["fantasy", "scifi"][Math.floor(Math.random() * 2)];

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

				var bgImage = "";
				switch(req.session.theme)
				{
					case "fantasy":
						bgImage = "/images/roomsbg-fantasy.jpg";
						break;
					case "scifi":
						bgImage = "/images/roomsbg-scifi.jpg";
						break;
				}

				return res.view("tome/index", {
					"layout": "layout",
					"viewid": "rooms",

					"bgImage": bgImage,
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
	"signup": function(req, res)
	{
		var invitationToken = req.param("t") || null;
		if(req.session.user
		|| !invitationToken)
		{
			return res.redirect("/");
		}

		Tokens.find().exec(function(err, tokens)
		{
			console.log(err, tokens);
		});

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
	"room": function(req, res)
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

		Rooms.findOne(options)
		.populate("posts")
		.exec(function(err, roomResult)
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

			var highestPage = Math.ceil(roomResult.posts.length / LOOKUP.ROOM_PAGE_SIZE);
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
				"room": roomResult.id,
				"skip": skip,
				"limit": LOOKUP.ROOM_PAGE_SIZE
			})
			.populate("player")
			.populate("character")
			.sort({ "createdAt": 1 })
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
	}
};