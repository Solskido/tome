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

	if(req.isSocket)
	{
		console.log("This is a socket");
		return res.ok();
	}

	return res.redirect("/");
};