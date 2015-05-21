/**
 * Characters.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	"schema": true,
	"attributes": {
		"player": {
			"model": "Users"
		},
		"campaigns": {
			"collection": "Campaigns",
			"via": "characters"
		},
		"avatar": {
			"type": "string"
		},
		"name": {
			"type": "string"
		},
		"alignment": {
			"type": "string"
		},
		"gender": {
			"type": "string"
		},
		"level": {
			"type": "string"
		},
		"deity": {
			"type": "string"
		},
		"homeland": {
			"type": "string"
		},
		"race": {
			"type": "string"
		},
		"size": {
			"type": "string"
		},
		"age": {
			"type": "string"
		},
		"height": {
			"type": "string"
		},
		"weight": {
			"type": "string"
		},
		"eyes": {
			"type": "string"
		},
		"bio": {
			"type": "string"
		},
		"type": {
			"type": "string"
		},
		"charsheet": {
			"type": "json"
		},
		"secrets": {
			"type": "json"
		},
		"notes": {
			"type": "string"
		}
	},

	/**
	 * Before destroying a Characters record
	 *
	 * @param options
	 * @param done
	 */
	"beforeDestroy": function(options, done)
	{
		if(options.where
		&& options.where.id)
		{
			Characters.findOne({
				"id": options.where.id
			}).exec(function(err, characterResult)
			{
				if(err)
				{
					return done(err);
				}
				else if(!characterResult)
				{
					return done();
				}

				if(characterResult.avatar)
				{
					Images.destroy({
						"id": characterResult.avatar.substr(3)
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