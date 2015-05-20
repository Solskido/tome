/**
 * Posts.js
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
		"character": {
			"model": "Characters"
		},
		"room": {
			"model": "Rooms"
		},
		"message": {
			"type": "string"
		},
		"rolls": {
			"type": "array"
		}
	},

	"afterCreate": function(newPost, cb)
	{
		// Update the parent room with knowledge of the most recent post date
		Rooms.findOne({
			"id": newPost.room
		}).exec(function(err, roomResult)
		{
			if(err)
			{
				sails.log.error(err);
				return cb(err);
			}
			else if(!roomResult)
			{
				sails.log.error("Broken association on Post." + newPost.id);
				return cb("Broken association");
			}

			roomResult.lastPost = newPost.createdAt;
			cb();
		});
	}
};