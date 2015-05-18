/**
 * Session Configuration
 * (sails.config.session)
 *
 * Sails session integration leans heavily on the great work already done by
 * Express, but also unifies Socket.io with the Connect session store. It uses
 * Connect's cookie parser to normalize configuration differences between Express
 * and Socket.io and hooks into Sails' middleware interpreter to allow you to access
 * and auto-save to `req.session` with Socket.io the same way you would with Express.
 *
 * For more information on configuring the session, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.session.html
 */

module.exports.session = {

	"secret": process.env.SESSION_SECRET,

	"cookie": {
		// 1 year
		"maxAge": 31536000000
	},

	"adapter": "redis",
	"host": process.env.SESSION_HOST,
	"port": parseInt(process.env.SESSION_PORT),
	// 1 year
	"ttl": 31536000000,
	"db": 0,
	"pass": process.env.SESSION_PASSWORD,
	"prefix": "sess:"
};