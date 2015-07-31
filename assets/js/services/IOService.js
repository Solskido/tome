/****************************************************/
/*	IO - Angular Service							*/
/*													*/
/*	This service further abstracts sails.io.js		*/
/*													*/
/*	Methods											*/
/*	+ IO.get(url, [data]) - Make a GET request		*/
/*	+ IO.post(url, data) - Make a POST request		*/
/*													*/
/****************************************************/

io.sails.environment = "production";

Tome.factory("IO", [
	"$rootScope",
	"$http",
	"$q",
	"Say",
	"Sync",
	function($rootScope, $http, $q, Say, Sync)
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
		 * @param resolve {function}
		 * @param reject {function}
		 */
		function _handleResponse(JWR, resolve, reject)
		{
			Sync.stop("_IO");

			if(JWR.statusCode !== 200)
			{
				$rootScope.$apply(reject(JWR.error || JWR.body));
			}
			else
			{
				Sync.stop("_IOReconnect");
				$rootScope.$apply(resolve(JWR.body));
			}
		}

		return {

			/**
			 * Make a GET request
			 *
			 * @param url {string}
			 * @param data {object}
			 */
			"get": function(url, data)
			{
				Sync.start("_IO");

				return $q(function(resolve, reject)
				{
					io.socket.get(url, data, function serverResponded(body, JWR)
					{
						_handleResponse(JWR, resolve, reject);
					});
				});
			},

			/**
			 * Make a POST request
			 *
			 * @param url {string}
			 * @param data {object}
			 */
			"post": function(url, data)
			{
				Sync.start("_IO");

				return $q(function(resolve, reject)
				{
					io.socket.post(url, data, function serverResponded(body, JWR)
					{
						_handleResponse(JWR, resolve, reject);
					});
				});
			},

			"file": function(url, file, cb)
			{
				Sync.start("_IO");

				var fd = new FormData();
				fd.append("file", file);

				return $q(function(resolve, reject)
				{
					$http.post(url, fd, {
						"withCredentials": true,
						"headers": { "Content-Type": undefined },
						"transformRequest": angular.identity
					})
					.success(function(data)
					{
						Sync.stop("_IO");

						resolve(data);
					})
					.error(function(data)
					{
						Sync.stop("_IO");

						reject(data);
					});
				});
			}
		};
	}
]);