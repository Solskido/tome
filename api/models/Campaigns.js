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
		"rooms": {
			"collection": "Rooms",
			"via": "campaign"
		},
		"theme": {
			"type": "string"
		},
		"dm": {
			"model": "Users"
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
		attrs.tag = attrs.name.trim().replace(/[^A-Za-z ]/g, '').replace(/ /g, '-').toLowerCase();
		next();
	}
};