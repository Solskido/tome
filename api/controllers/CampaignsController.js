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
		Campaigns.find({
			"or": [
				{
					"dm": req.session.user.id
				},
				{
					"characters": _.pluck(req.session.user.characters, "id")
				}
			]
		})
		.populate("rooms")
		.exec(function(err, campaignResults)
		{
			if(err)
			{
				sails.log.error(err);
				return res.serverError(err);
			}

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