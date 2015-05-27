/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb)
{
	// It's very important to trigger this callback method when you are finished
	// with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
	Characters.find({
		"type": ["ooc", "dm"]
	}).exec(function(err, defaultCharacters)
	{
		if(err)
		{
			sails.log.error(err);
		}
		else if(!defaultCharacters.length)
		{
			Characters.create([
				{
					"name": "Out of character",
					"type": "ooc",
					"avatar": "/images/placeholder.jpg"
				},
				{
					"name": "Narrator",
					"type": "dm",
					"avatar": "/images/narrator/png"
				}
			]).exec(function(err, newCharacters)
			{
				if(err)
				{
					sails.log.error(err);
				}
				else if(!newCharacters.length)
				{
					sails.log.error("Unable to create the default characters!");
				}
				else
				{
					LOOKUP.defaultCharacters = newCharacters;

					cb();
				}
			});
		}
		else
		{
			LOOKUP.defaultCharacters = defaultCharacters;

			cb();
		}
	});
};