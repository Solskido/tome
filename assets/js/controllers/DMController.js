Tome.controller("DMController", [
	"$rootScope",
	"$scope",
	"Say",
	"Validate",
	"Sync",
	"IO",
	"$http",
	function($rootScope, $scope, Say, Validate, Sync, IO, $http)
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
			"invitations": [],
			"imageSrc": "/images/painting.jpg"
		};

		$scope.INTENT = angular.extend($scope.INTENT || {},
		{

			"createCampaign": function()
			{
				Sync.start("dm");

				$scope.campaign.errors = [];

				$scope.campaign.errors = Validate("campaign", $scope.campaign);

				if($scope.campaign.errors.length)
				{
					Sync.stop("dm");
				}
				else
				{
					var data = {
						"name": $scope.campaign.name,
						"tagline": $scope.campaign.tagline,
						"description": $scope.campaign.description,
						"theme": $scope.campaign.theme,
						"characters": _.pluck($scope.campaign.invitations, "id"),
						"image": $scope.campaign.imageSrc
					};

					IO.post("/campaign", data)
					.then(function(data)
					{
						if(data.tag)
						{
							window.location.href = "/campaign/" + data.tag;
						}
					})
					.catch(function(err)
					{
						$scope.campaign.errors.push("error");
					})
					.finally(function()
					{
						Sync.stop("dm");
					});
				}
			},

			"characterPickerAutoComplete": function(query)
			{
				return IO.get("/playersAndCharacters", {
					"s": query
				});
			},

			"chooseImageUpload": function()
			{
				$("#image-upload").trigger("click");
			},

			"beginImageUpload": function(element)
			{
				if(!element.files[0])
				{
					return;
				}

				Sync.start("image");
				IO.post("/file/image", element.files[0])
				.then(function(data)
				{
					$scope.campaign.imageSrc = res.uri;
				})
				.catch(function(err)
				{
					Say.sup("Image upload error.");
				})
				.finally(function()
				{
					Sync.stop("image");
				});
			},

			"isInvalid": function(form, key)
			{
				return (_.indexOf(form, key) > -1);
			}
		});
	}
]);