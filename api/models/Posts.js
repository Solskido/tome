/**
 * Posts.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	schema: true,
	attributes: {
		player: {
			model: "Users"
		},
		character: {
			model: "Characters"
		},
		room: {
			model: "Rooms"
		},
		message: {
			type: "string"
		},
		rolls: {
			type: "array"
		}
	}
};