/**
 * SearchController
 *
 * @description :: Server-side logic for searching
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	/**
	 * `SearchController.playersandcharacters()`
	 */
	"playersandcharacters": function(req, res)
	{
		var search = req.param("s") || null;
		if(!search)
		{
			return res.json([]);
		}

		async.parallel([
			function(parallelCB)
			{
				Users.find({
					"or": [
						{
							"name": {
								"contains": search
							}
						},
						{
							"email": {
								"contains": search
							}
						}
					]
				})
				.populate("characters")
				.exec(function(err, userResults)
				{
					if(err)
					{
						sails.log.error(err);
					}
					parallelCB(err, userResults);
				});
			},
			function(parallelCB)
			{
				Characters.find({
					"name": {
						"contains": search
					}
				})
				.populate("player")
				.exec(function(err, characterResults)
				{
					if(err)
					{
						sails.log.error(err);
					}
					parallelCB(err, characterResults);
				});
			}
		],
		function(err, results)
		{
			if(err)
			{
				return res.json([]);
			}

			var players = _.reject(results[0], { "id": req.session.user.id });
			var characters = _.flatten(_.pluck(players, "characters"));
			characters = _.union(characters, _.reject(results[1], { "player": req.session.user.id }));
			characters = _.map(_.uniq(characters, "id"), function(char)
			{
				return {
					"id": char.id,
					"name": char.name,
					"avatar": char.avatar
				};
			});

			return res.json(characters);
		});
	}
};