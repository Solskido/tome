/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var bcrypt = require("bcryptjs");

module.exports = {

	/**
	 * `UserController.login()`
	 */
	"login": function(req, res)
	{
		if(!req.wantsJSON)
		{
			return res.redirect("/");
		}

		var email = req.param("email") || null;
		var password = req.param("password") || null;

		if(!email
		|| !password)
		{
			return res.badRequest();
		}

		Users.findOne({
			"email": email
		})
		.populate("characters")
		.exec(function(err, userResult)
		{
			if(err)
			{
				sails.log.error(err);
				return res.serverError(err);
			}
			if(!userResult)
			{
				return res.badRequest();
			}
			if(!bcrypt.compareSync(password, userResult.password))
			{
				return res.badRequest();
			}

			req.session.user = userResult;
			return res.ok();
		});
	},

	/**
	 * `UserController.logout()`
	 */
	"logout": function(req, res)
	{
		delete req.session.user;

		if(!req.wantsJSON)
		{
			return res.redirect("/");
		}

		return res.ok();
	},

	/**
	 * `UserController.signup()`
	 */
	"signup": function(req, res)
	{
		if(!req.wantsJSON)
		{
			return res.redirect("/");
		}

		if(!req.session.invitationToken)
		{
			return res.forbidden();
		}

		LOOKUP.validInvitationToken(req.session.invitationToken, function(err, valid)
		{
			if(err)
			{
				return res.serverError(err);
			}
			else if(!valid)
			{
				return res.forbidden();
			}

			var name = req.param("name") || null;
			var email = req.param("email") || null;
			var password = req.param("password") || null;

			if(!name
			|| !email
			|| !password)
			{
				return res.badRequest();
			}

			var user = {};
			user.name = name;
			user.email = email;
			user.password = password;
			user.characters = [
				{
					"name": "Out of character",
					"type": "ooc",
					"avatar": "/images/placeholder.jpg",
					"player": userResult.id
				}
			];
			Users.create(user).exec(function(err, userResult)
			{
				if(err)
				{
					sails.log.error(err);
					return res.serverError(err);
				}

				Tokens.destroy({ "token": req.session.invitationToken }).exec(function(err, destroyed)
				{
					if(err)
					{
						sails.log.error(err);
					}

					delete req.session.invitationToken;

					Users.findOne({
						"id": userResult.id
					})
					.populate("characters")
					.exec(function(err, userResult)
					{
						if(err)
						{
							sails.log.error(err);
							return res.serverError(err);
						}
						else if(!userResult)
						{
							return res.serverError();
						}

						req.session.user = userResult;
						return res.ok();
					});
				});
			});
		});
	}
};