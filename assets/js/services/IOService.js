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

Tome.factory("IO", [
	"Say",
	function(Say)
	{
		Say = new Say("IOService");

		io.sails.environment = "production";

		return {

			/**
			 * Make a GET request
			 *
			 * @param url {string}
			 * @param cb {function}
			 */
			"get": function(url, cb)
			{
				io.socket.get(url, function serverResponded(body, JWR)
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
				io.socket.post(url, data, function serverResponded(body, JWR)
				{
					cb();
				});
			}
		};
	}
]);