/**
 * loggedIn
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next)
{
	if(req.session.user)
	{
		return next();
	}

	return res.redirect("/");
};