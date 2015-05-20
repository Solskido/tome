Tome.controller("SplashController", [
	"$rootScope",
	"$scope",
	"Say",
	"Validate",
	function($rootScope, $scope, Say, Validate)
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
				Say.sup("login()");

				$scope.login.errors = [];

				$scope.login.errors = Validate("login", {
					"email": $scope.login.email,
					"password": $scope.login.password
				});

				if(!$scope.login.errors.length)
				{
					//io.socket.get("/testing");
				}
			},

			"isInvalid": function(form, key)
			{
				return (_.indexOf(form, key) > -1);
			}
		});
	}
]);