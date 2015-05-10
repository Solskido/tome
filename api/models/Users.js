/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require("bcryptjs");
var _ = require("lodash");

module.exports = {

	schema: true,
	attributes: {
		name: {
			type: "string",
			required: true
		},
		email: {
			type: "email",
			unique: true,
			required: true
		},
		password: {
			type: "string",
			required: true
		},
		characters: {
			type: "array"
		},
		dm: {
			type: "boolean",
			defaultsTo: false
		},

		// Exclude secret information
		toJSON: function()
		{
			var obj = this.toObject();
			var secrets = [
				"password"
			];

			obj = _.omit(obj, secrets);
			return obj;
		}
	},

	/**
	 * Before creating a Users record
	 *
	 * @param attrs
	 * @param next
	 */
	beforeCreate: function(attrs, next)
	{
		bcrypt.hash(attrs.password, 10, function(err, hash)
		{
			if(err)
			{
				return next(err);
			}
			attrs.password = hash;
			next();
		});
	}
};