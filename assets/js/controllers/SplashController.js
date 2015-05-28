Tome.controller("SplashController", [
	"$rootScope",
	"$scope",
	"Say",
	"Validate",
	"Sync",
	"IO",
	function($rootScope, $scope, Say, Validate, Sync, IO)
	{
		$rootScope.pageTitle = "Tome";

		Say = new Say("SplashController");
		Say.hello("loaded.");

		$scope.login = {
			"errors": [],
			"email": "",
			"password": ""
		};

		$scope.INTENT = angular.extend($scope.INTENT || {},
		{

			"login": function()
			{
				Sync.start("me");

				$scope.login.errors = [];

				$scope.login.errors = Validate("login", {
					"email": $scope.login.email,
					"password": $scope.login.password
				});

				if($scope.login.errors.length)
				{
					Sync.stop("me");
				}
				else
				{
					IO.post("/me/login",
					{
						"email": $scope.login.email,
						"password": $scope.login.password
					},
					function(err, res)
					{
						Sync.stop("me");

						if(!err)
						{
							window.location.href = "/";
						}
						else
						{
							$scope.login.errors.push("error");
						}
					});
				}
			},

			"isInvalid": function(form, key)
			{
				return (_.indexOf(form, key) > -1);
			}
		});
	}
]);