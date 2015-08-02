Tome.controller("TomeController", [
	"$rootScope",
	"$scope",
	"Mothership",
	"Say",
	"Sync",
	"IO",
	function($rootScope, $scope, Mothership, Say, Sync, IO)
	{
		Say = new Say("TomeController");
		Say.hello("loaded.");

		$rootScope.pageTitle = "Tome";
		$rootScope.user = {};
		$rootScope.campaign = {};

		Sync.start("me");
		IO.get("/me")
		.then(function(data)
		{
			$rootScope.user = data;
		})
		.finally(function()
		{
			Sync.stop("me");
		});

		if(Mothership.campaign)
		{
			Sync.start("campaign");
			IO.get("/campaign/" + Mothership.campaign)
			.then(function(data)
			{
				$rootScope.campaign = data;
			})
			.catch(Say.whoops)
			.finally(function()
			{
				Sync.stop("campaign");
			});
		}

		$scope.INTENT = angular.extend($scope.INTENT || {},
		{

			"Sync": Sync,

			"dmsCampaign": function()
			{
				if(!$rootScope.campaign
				|| !$rootScope.user
				|| !$rootScope.campaign.dm)
				{
					return false;
				}

				return ($rootScope.campaign.dm.id === $rootScope.user.id);
			},

			"logout": function()
			{
				if(Sync.syncing("me"))
				{
					return;
				}

				Sync.start("me");
				IO.post("/me/logout")
				.then(function(data)
				{
					window.location.href = "/";
				})
				.finally(function()
				{
					Sync.stop("me");
				});
			},

			"isInvalid": function(form, key)
			{
				return (_.indexOf(form, key) > -1);
			}
		});
	}
]);
