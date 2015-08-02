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
		if(req.session.user)
		{
			Characters.find({
				"id": _.pluck(req.session.user.characters, "id")
			})
			.populate("campaigns")
			.exec(function(err, characterResults)
			{
				if(err)
				{
					sails.log.error(err);
					return res.serverError(err);
				}

				// For each character, retrieve their campaigns
				var campaigns = _.map(characterResults, function(character)
				{
					return character.campaigns;
				});

				// Combine the characters' campaigns into a single list
				campaigns = _.flatten(campaigns);

				// Ensure there are no duplicate entries
				campaigns = _.uniq(campaigns, "id");

				var bgImage = "";
				switch(req.session.theme)
				{
					case "fantasy":
						bgImage = "/images/dmscreen-fantasy.png";
						break;
					case "scifi":
						bgImage = "/images/dmscreen-scifi.jpg";
						break;
				}

				return res.view("tome/index", {
					"layout": "layout",
					"viewid": "rooms",

					"campaigns": campaigns,

					"bgImage": bgImage
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
		var tagOrID = req.param("tag") || null;
		if(!tagOrID)
		{
			return res.notFound();
		}

		Campaigns.findOne({
			"or": [
				{
					"tag": tagOrID
				},
				{
					"id": tagOrID
				}
			]
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

			if(!req.session.user.dm)
			{
				// Silly player, invisible rooms are for DMs
				campaignResult.rooms = _.filter(campaignResult.rooms, { "visible": true });
			}

			campaignResult.rooms = _.sortBy(campaignResult.rooms, function(room)
			{
				return _.max(_.pluck(room, "lastPost"));
			});
			campaignResult.rooms = _.sortBy(campaignResult.rooms, "open");
			campaignResult.rooms = _.sortBy(campaignResult.rooms, "visible").reverse();

			if(req.wantsJSON)
			{
				return res.ok(campaignResult);
			}

			req.session.theme = campaignResult.theme;

			return res.view("tome/campaign", {
				"layout": "layout",
				"viewid": "room",

				"bgImage": "/images/roomsbg-" + campaignResult.theme + ".jpg",

				"data": {
					"campaign": campaignResult.id
				}
			});
		});
	}
};
