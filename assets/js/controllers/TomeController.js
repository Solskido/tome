Tome.controller("TomeController", [
	"$rootScope",
	"$scope",
	"Say",
	"Sync",
	"IO",
	function($rootScope, $scope, Say, Sync, IO)
	{
		Say = new Say("TomeController");
		Say.hello("loaded.");

		$rootScope.pageTitle = "Tome";
		IO.get("/me")
		.then(function(data)
		{
			$rootScope.user = data;
		});

		$scope.INTENT = angular.extend($scope.INTENT || {},
		{

			"Sync": Sync,

			"logout": function()
			{
				IO.post("/me/logout")
				.then(function(data)
				{
					window.location.href = "/";
				});
			}
		});
	}
]);