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
	}
};