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
		if(!req.session.theme)
		{
			req.session.theme = "fantasy";
		}

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
			return res.view("splash/login", {
				"layout": "splash/loginlayout"
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
	},

	/**
	 * `TomeController.campaign()`
	 */
	"campaign": function(req, res)
	{
		var tag = req.param("tag") || null;
		if(!tag)
		{
			return res.notFound();
		}

		Campaigns.findOne({
			"tag": tag
		})
		.populate("rooms")
		.exec(function(err, campaignResult)
		{
			if(err)
			{
				sails.log.error(err);
				return res.serverError(err);
			}
			else if(!campaignResult)
			{
				return res.notFound();
			}

			req.session.theme = campaignResult.theme;

			// Players can't see invisible rooms, silly
			if(!req.session.user.dm)
			{
				campaignResult.rooms = _.filter(campaignResult.rooms, { "visible": true });
			}

			campaignResult.rooms = _.sortBy(campaignResult.rooms, function(room)
			{
				return _.max(_.pluck(room, "lastPost"));
			});
			campaignResult.rooms = _.sortBy(campaignResult.rooms, "open");
			campaignResult.rooms = _.sortBy(campaignResult.rooms, "visible").reverse();

			return res.view("tome/campaign", {
				"layout": "layout",
				"viewid": "room",

				"bgImage": "/images/roomsbg-" + campaignResult.theme +  ".jpg",
				"campaign": campaignResult
			});
		});
	}
};