/****************************************************/
/*	IO - Angular Service							*/
/*													*/
/*	This service further abstracts sails.io.js		*/
/*													*/
/*	Methods											*/
/*	+ IO.get(url, [data,] cb) - Make a GET request	*/
/*	+ IO.post(url, data, cb) - Make a POST request	*/
/*													*/
/****************************************************/

io.sails.environment = "production";

Tome.factory("IO", [
	"Say",
	function(Say)
	{
		Say = new Say("IOService");

		return {

			/**
			 * Make a GET request
			 *
			 * @param url {string}
			 * @param data {object}
			 * @param cb {function}
			 */
			"get": function(url, data, cb)
			{
				if(_.isFunction(data))
				{
					cb = data;
					data = {};
				}

				io.socket.get(url, data, function serverResponded(body, JWR)
				{
					cb();
				});
			},

			/**
			 * Make a POST request
			 *
			 * @param url {string}
			 * @param data {object}
			 * @param cb {function}
			 */
			"post": function(url, data, cb)
			{
				if(_.isFunction(data))
				{
					cb = data;
					data = {};
				}

				io.socket.post(url, data, function serverResponded(body, JWR)
				{
					cb();
				});
			}
		};
	}
]);