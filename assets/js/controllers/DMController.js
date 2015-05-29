Tome.controller("DMController", [
	"$rootScope",
	"$scope",
	"Say",
	"Validate",
	"Sync",
	"IO",
	function($rootScope, $scope, Say, Validate, Sync, IO)
	{
		$rootScope.pageTitle = "Tome";

		Say = new Say("DMController");
		Say.hello("loaded.");

		$scope.campaign = {
			"errors": [],
			"name": "",
			"tagline": "",
			"description": "",
			"theme": "fantasy",
			"invitations": [0],
			"invitationChars": [""],
			"imageFile": "",
			"imageData": ""
		};

		$scope.INTENT = angular.extend($scope.INTENT || {},
		{

			"createCampaign": function()
			{
				Sync.start("dm");

				$scope.campaign.errors = [];

				$scope.campaign.errors = Validate("campaign", $scope.campaign);
				console.log($scope.campaign.errors);

				if($scope.campaign.errors.length)
				{
					Sync.stop("dm");
				}
				else
				{
					IO.post("/campaign",
					$scope.campaign,
					function(err, res)
					{
						Sync.stop("dm");

						if(!err)
						{
							Say.sup("Okay");
						}
						else
						{
							Say.sup("Nope");
							$scope.login.errors.push("error");
						}
					});
				}
			},

			"removeInvitation": function()
			{
				if($scope.campaign.invitations.length < 2)
				{
					return;
				}

				$scope.campaign.invitations = $scope.campaign.invitations.slice(0, ($scope.campaign.invitations.length - 1));
				$scope.campaign.invitationChars = $scope.campaign.invitationChars.slice(0, ($scope.campaign.invitationChars.length - 1));
			},

			"addInvitation": function()
			{
				$scope.campaign.invitations.push(_.max($scope.campaign.invitations) + 1);
				$scope.campaign.invitationChars.push({});
			},

			"chooseImageUpload": function()
			{
				$("#image-upload").trigger("click");
			},

			"beginImageUpload": function(element)
			{
				$scope.campaign.imageFile = element.files[0];
				var data = $("#image-form").serialize();
				console.log(data);

				Sync.start("image");
				IO.post("/file/image",
				data,
				function(err, res)
				{
					Sync.stop("image");
					console.log(err, res);

					if(err)
					{
						$scope.campaign.errors.push("images");
					}
				});
			},

			"isInvalid": function(form, key)
			{
				return (_.indexOf(form, key) > -1);
			}
		});
	}
]);