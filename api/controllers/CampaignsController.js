/**
 * CharactersController
 *
 * @description :: Server-side logic for managing characters
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fs = require("fs");

module.exports = {

	/**
	 * `CampaignController.campaigns()`
	 */
	"campaigns": function(req, res)
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

			var campaigns = [];
			_.forEach(characterResults, function(character)
			{
				if(character.campaigns
				&& character.campaigns.length)
				{
					campaigns = _.union(campaigns, _.pluck(character.campaigns, "id"));
				}
			});
			campaigns = _.uniq(campaigns);

			Campaigns.find({
				"or": [
					{
						"id": campaigns
					},
					{
						"dm": req.session.user.id
					}
				]
			})
			.populate("rooms")
			.exec(function(err, campaignResults)
			{
				_.map(campaignResults, function(campaign)
				{
					if(campaign.dm !== req.session.user.id)
					{
						campaign.rooms = _.reject(campaign.rooms, { "visible": false });
					}
				});

				if(req.wantsJSON)
				{
					return res.json(campaignResults);
				}
				else
				{
					return res.view("dm/campaigns", {
						"layout": "layout",
						"viewid": "campaigns",

						"campaigns": campaignResults,

						"bgImage": "/images/campaignbg.jpg"
					});
				}
			});
		});
	},

	/**
	 * `CampaignController.newcampaign()`
	 */
	"newcampaign": function(req, res)
	{
		return res.view("dm/newcampaign", {
			"layout": "layout",
			"viewid": "newcampaign",

			"bgImage": "/images/campaignbg.jpg"
		});
	},

	/**
	 * `CampaignController.createcampaign()`
	 */
	"createcampaign": function(req, res)
	{
		var campaign = {};
		campaign.name = req.param("name") || null;
		campaign.tagline = req.param("tagline") || null;
		campaign.description = req.param("description") || null;
		campaign.theme = req.param("theme") || null;
		campaign.image = req.param("image") || null;
		campaign.image = {
			"mimeType": campaign.image.split(";")[0].substr(5),
			"data": campaign.image.split(",")[1]
		};
		campaign.characters = req.param("characters") || null;
		campaign.dm = req.session.user.id;

		Campaigns.create(campaign)
		.exec(function(err, newCampaign) {
			if(err)
			{
				return res.serverError(err);
			}

			return res.json(newCampaign);
		});
	}
};