/**
 * dm
 *
 * @module      :: Policy
 * @description :: Only allow DMs
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next)
{
	if(req.session.user && req.session.user.dm)
	{
		return next();
	}

	return res.forbidden();
};