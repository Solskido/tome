Tome.controller("TomeController", [
	"$scope",
	"Say",
	function($scope, Say)
	{
		Say.hello("TomeController loaded.");

		$scope.pageTitle = "TESTING";

		$scope.INTENT = angular.extend($scope.INTENT || {},
		{
			//
		});
	}
]);