/**
 * CharactersController
 *
 * @description :: Server-side logic for managing characters
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fs = require("fs");

module.exports = {

	/**
	 * `DMController.dmscreen()`
	 */
	"dmscreen": function(req, res)
	{
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

		return res.view("dm/screen", {
			"layout": "layout",
			"viewid": "dmscreen",

			"bgImage": bgImage
		});
	},

	/**
	 * `DMController.roommanager()`
	 */
	"roommanager": function(req, res)
	{
		Rooms.find().sort({ "visible": -1, "open": -1 }).exec(function(err, roomsResult)
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

			return res.view("dm/rooms", {
				"layout": "layout",
				"viewid": "roommanager",

				"rooms": roomsResult,
				"bgImage": bgImage
			});
		});
	},

	/**
	 * `DMController.newroom()`
	 */
	"newroom": function(req, res)
	{
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

		return res.view("dm/newroom", {
			"layout": "layout",
			"viewid": "roommanager",

			"bgImage": bgImage
		});
	},

	/**
	 * `DMController.players()`
	 */
	"players": function(req, res)
	{
		Users.find()
		.populate("characters")
		.exec(function(err, userResults)
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
					bgImage = "/images/playersbg-fantasy.jpg";
					break;
				case "scifi":
					bgImage = "/images/playersbg-scifi.jpg";
					break;
			}

			return res.view("dm/players", {
				"layout": "layout",
				"viewid": "players",

				"players": userResults,
				"bgImage": bgImage
			});
		});
	},

	/**
	 * `DMController.campaigns()`
	 */
	"campaigns": function(req, res)
	{
		return res.view("dm/campaigns", {
			"layout": "layout",
			"viewid": "campaigns",

			"bgImage": "/images/campaignbg.jpg"
		});
	}
};