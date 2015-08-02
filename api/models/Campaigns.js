/**
 * Campaigns.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

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
		TagService.convertNameToTag({
			"model": "Campaigns",
			"name": attrs.name
		},
		function(err, tag)
		{
			if(err)
			{
				sails.log.error(err);
			}
			else
			{
				attrs.tag = tag;
				next();
			}
		});
	}
};
