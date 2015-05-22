Tome.controller("TomeController", [
	"$rootScope",
	"$scope",
	"Say",
	"IO",
	function($rootScope, $scope, Say, IO)
	{
		Say = new Say("TomeController");
		Say.hello("loaded.");

		$rootScope.pageTitle = "Tome";
		IO.get("/me", function(err, res)
		{
			$rootScope.user = res;
			console.log(res);
		});

		$scope.INTENT = angular.extend($scope.INTENT || {},
		{

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