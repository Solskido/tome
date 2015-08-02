/****************************************************/
/*	Say - Angular Service							*/
/*													*/
/*	Use this service to log things to the console.	*/
/*	Log statements will declare their origin.		*/
/*													*/
/*	Methods											*/
/*	+ new Say() - Constructor						*/
/*	+ Say.hello(words) - Log something good			*/
/*	+ Say.sup(words) - Log something fine			*/
/*	+ Say.whoops(words) - Log something bad			*/
/*													*/
/****************************************************/

Tome.factory("Say", function()
{
	var styles = {
		"good": "color: green",
		"meh": "color: black",
		"bad": "color: red",

		"trace": "color: #BBBBBB",

		"big": "font-size: 16px",
		"normal": "font-size: 12px"
	};

	/**
	 * Resolve and concatenate all requested styles
	 *
	 * @returns {string}
	 */
	function s()
	{
		return _.map(arguments, function(arg)
		{
			return styles[arg] || "";
		}).join("; ");
	}

	/**
	 * Log something good
	 *
	 * @param words {string}
	 */
	function hello(words)
	{
		console.log("%c✓%c " + this.identity + " → " + words + "%c:" + _getSource(), s("good", "big"), s("meh", "normal"), s("trace", "normal"));
	}

	/**
	 * Log something fine
	 *
	 * @param words {string}
	 */
	function sup(words)
	{
		console.log("%c→%c " + this.identity + " → " + words + "%c:" + _getSource(), s("meh", "big"), s("meh", "normal"), s("trace", "normal"));
	}

	/**
	 * Log something bad
	 *
	 * @param words {string|array}
	 */
	function whoops(words)
	{
		console.log("%c✗%c " + this.identity + " → broke. " + words + "%c:" + _getSource(), s("bad", "big"), s("bad", "normal"), s("meh", "normal"));
	}

	/**
	 * Log something without any style or icons,
	 * you boring person you.
	 *
	 * @param words
	 */
	function clean(words)
	{
		console.log(this.identity + " => " + words, ":" + _getSource());
	}

	function _getSource()
	{
		var source = _.takeRight((new Error).stack.split("\n")[3].split("/"))[0];
		return source.substr(0, source.length - 1);
	}

	return function(name)
	{
		return {
			"identity": name,

			"hello": hello,
			"sup": sup,
			"whoops": whoops,

			"clean": clean
		};
	};
});
