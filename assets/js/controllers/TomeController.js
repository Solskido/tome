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
		IO.get("/me", function(err, res)
		{
			$rootScope.user = res;
		});

		$scope.INTENT = angular.extend($scope.INTENT || {},
		{

			"Sync": Sync,

			"logout": function()
			{
				IO.post("/me/logout", function(err, res)
				{
					if(!err)
					{
						window.location.href = "/";
					}
				});
			}
		});
	}
]);