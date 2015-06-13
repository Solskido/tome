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
	"$http",
	"Say",
	"Sync",
	function($rootScope, $http, Say, Sync)
	{
		Say = new Say("IOService");
		Sync.start("_IOReconnect");

		io.socket.on("disconnect", function()
		{
			Say.whoops("Connection to Tome lost.");
			Sync.start("_IOReconnect");
			$rootScope.$apply();
		});

		io.socket.on("connect", function()
		{
			Say.hello("Connection to Tome established.");
			Sync.stop("_IOReconnect");
			$rootScope.$apply();
		});

		io.socket.on("reconnect", function()
		{
			Say.hello("Connection to Tome established.");
			Sync.stop("_IOReconnect");
			$rootScope.$apply();
		});

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
				Sync.stop("_IOReconnect");
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
			},

			"file": function(url, file, cb)
			{
				Sync.start("_IO");

				var fd = new FormData();
				fd.append("file", file);

				$http.post(url, fd, {
					"withCredentials": true,
					"headers": { "Content-Type": undefined },
					"transformRequest": angular.identity
				}).success(function(data)
				{
					Sync.stop("_IO");

					cb(null, data);
				}).error(function(data)
				{
					Sync.stop("_IO");

					cb(data);
				});
			}
		};
	}
]);