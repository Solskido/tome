var humanize = require("humanize");

module.exports = LOOKUP = {

	ROOM_PAGE_SIZE: 20,

	"fsdelimiter": function()
	{
		if(process.env.NODE_ENV === "production")
		{
			return "/";
		}
		else
		{
			return "\\";
		}
	},

	"ownsCharacter": function(player, characterID)
	{
		if(!player
		|| !characterID
		|| !player.characters
		|| !player.characters.length)
		{
			return false;
		}

		if(_.contains(player.characters, characterID)
		|| !!_.find(player.characters, { "id": characterID }))
		{
			return true;
		}
		else
		{
			return false;
		}
	},

	"validInvitationToken": function(token, done)
	{
		Tokens.findOne({ "token": token }).exec(function(err, tokenResult)
		{
			if(err)
			{
				sails.log.error(err);
				done(err);
			}
			else if(!tokenResult)
			{
				done(null, false);
			}
			else
			{
				done(null, true);
			}
		});
	},

	"formatDate": function(date)
	{
		var string = humanize.relativeTime(new Date(date).getTime() / 1000);
		return string.substr(0, 1).toUpperCase() + string.substr(1);
	},

	"defaultCharacters": []
};