/**
 * Campaigns.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var internals = {};

module.exports = {

	"schema": true,
	"attributes": {
		"name": {
			type: "string"
		},
		"tagline": {
			"type": "string"
		},
		"tag": {
			"type": "string",
			"unique": true
		},
		"description": {
			"type": "string"
		},
		"rooms": {
			"collection": "Rooms",
			"via": "campaign"
		},
		"image": {
			"model": "Images"
		},
		"theme": {
			"type": "string"
		},
		"dm": {
			"model": "Users"
		},
		"characters": {
			"collection": "Characters",
			"via": "campaigns",
			"dominant": true
		}
	},

	/**
	 * Before creating a Campaigns record
	 *
	 * @param attrs
	 * @param next
	 */
	"beforeCreate": function(attrs, next)
	{
		attrs.tag = attrs.name.replace(/[^A-Za-z0-9 ]/g, '').trim().replace(/ /g, '-').toLowerCase();
		Campaigns.find({
			"tag": {
				"contains": attrs.tag
			}
		}).exec(function(err, existingCampaigns)
		{
			if(err)
			{
				sails.log.error(err);
			}
			else if(!existingCampaigns.length)
			{
				next();
			}
			else
			{
				while(_.find(existingCampaigns, { "tag": attrs.tag }))
				{
					attrs.tag = internals.incrementTagIndex(attrs.tag);
				}

				next();
			}
		});
	}
};

internals.incrementTagIndex = function(tag)
{
	var lastHyphen = _.lastIndexOf(tag, "-");
	if(lastHyphen >= 0)
	{
		var index = parseInt(tag.substr(lastHyphen + 1));
		if(_.isNaN(index))
		{
			tag += "-2";
		}
		else
		{
			tag = (tag.substr(0, lastHyphen) + "-" + (index + 1));
		}
	}
	else
	{
		tag += "-2";
	}

	return tag;
};
