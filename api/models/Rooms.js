/**
 * Rooms.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	"schema": true,
	"attributes": {
		"name": {
			"type": "string"
		},
		"tag": {
			"type": "string",
			"unique": true
		},
		"image": {
			"type": "string"
		},
		"subheading": {
			"type": "string"
		},
		"description": {
			"type": "string"
		},
		"campaign": {
			"model": "Campaigns"
		},
		"posts": {
			"collection": "Posts",
			"via": "room"
		},
		"lastPost": {
			"type": "date"
		},
		"open": {
			"type": "boolean",
			"defaultsTo": true
		},
		"visible": {
			"type": "boolean",
			"defaultsTo": false
		}
	},

	/**
	 * Before creating a Rooms record
	 *
	 * @param attrs
	 * @param next
	 */
	"beforeCreate": function(attrs, next)
	{
		TagService.convertNameToTag({
			"model": "Rooms",
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
	},

	/**
	 * Before destroying a Rooms record
	 *
	 * @param options
	 * @param done
	 */
	"beforeDestroy": function(options, done)
	{
		if(options.where
		&& options.where.id)
		{
			Rooms.findOne({
				"id": options.where.id
			}).exec(function(err, roomResult)
			{
				if(err)
				{
					return done(err);
				}
				else if(!characterResult)
				{
					return done();
				}

				if(roomResult.image)
				{
					Images.destroy({
						"id": roomResult.image.substr(3)
					}).exec(function(err)
					{
						if(err)
						{
							return done(err);
						}

						return done();
					});
				}
				else
				{
					return done();
				}
			});
		}
	}
};
