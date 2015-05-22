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
	"$rootScope",
	"Say",
	"Sync",
	function($rootScope, Say, Sync)
	{
		Say = new Say("IOService");

		/**
		 * Handle the socket response
		 *
		 * @param JWR {object}
		 * @param cb {function}
		 */
		function handleResponse(JWR, cb)
		{
			Sync.stop("_IO");

			if(JWR.statusCode !== 200)
			{
				$rootScope.$apply(cb(JWR.error || JWR.body));
			}
			else
			{
				$rootScope.$apply(cb(null, JWR.body));
			}
		}

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
				Sync.start("_IO");

				if(_.isFunction(data))
				{
					cb = data;
					data = {};
				}

				io.socket.get(url, data, function serverResponded(body, JWR)
				{
					handleResponse(JWR, cb);
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
				Sync.start("_IO");

				if(_.isFunction(data))
				{
					cb = data;
					data = {};
				}

				io.socket.post(url, data, function serverResponded(body, JWR)
				{
					handleResponse(JWR, cb);
				});
			}
		};
	}
]);