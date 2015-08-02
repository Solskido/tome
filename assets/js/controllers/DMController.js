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

		$scope.newCampaign = {
			"errors": [],
			"name": "",
			"tagline": "",
			"description": "",
			"theme": "fantasy",
			"invitations": [],
			"imageSrc": "/images/painting.jpg"
		};

		$scope.newRoom = {
			"errors": [],
			"name": "",
			"subheading": "",
			"description": "",
			"theme": "fantasy",
			"invitations": [],
			"imageSrc": "/images/painting.jpg"
		};

		function beginImageUpload(element, callback)
		{
			if(!element.files[0])
			{
				return;
			}

			Sync.start("image");
			IO.file("/file/image", element.files[0])
			.then(callback)
			.catch(function(err)
			{
				Say.sup("Image upload error.");
			})
			.finally(function()
			{
				Sync.stop("image");
			});
		}

		$scope.INTENT = angular.extend($scope.INTENT || {},
		{

			"createCampaign": function()
			{
				Sync.start("dm");

				$scope.newCampaign.errors = [];

				$scope.newCampaign.errors = Validate("campaign", $scope.newCampaign);

				if($scope.newCampaign.errors.length)
				{
					Sync.stop("dm");
				}
				else
				{
					var data = {
						"name": $scope.newCampaign.name,
						"tagline": $scope.newCampaign.tagline,
						"description": $scope.newCampaign.description,
						"theme": $scope.newCampaign.theme,
						"characters": _.pluck($scope.newCampaign.invitations, "id"),
						"image": $scope.newCampaign.imageSrc
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
						$scope.newCampaign.errors.push("error");
					})
					.finally(function()
					{
						Sync.stop("dm");
					});
				}
			},

			"createRoom": function()
			{
				Sync.start("dm");

				$scope.newRoom.errors = [];

				$scope.newRoom.errors = Validate("room", $scope.newRoom);

				if($scope.newRoom.errors.length)
				{
					Sync.stop("dm");
				}
				else
				{
					var data = {
						"name": $scope.newRoom.name,
						"subheading": $scope.newRoom.subheading,
						"description": $scope.newRoom.description,
						"image": $scope.newRoom.imageSrc
					};

					IO.post("/room", data)
					.then(function(data)
					{
						if(data.tag)
						{
							window.location.href = "/room/" + data.tag;
						}
					})
					.catch(function(err)
					{
						$scope.newRoom.errors.push("error");
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

			"beginCampaignImageUpload": function(element)
			{
				beginImageUpload(element, function(data)
				{
					$scope.newCampaign.imageSrc = data.uri;
				});
			},

			"beginRoomImageUpload": function(element)
			{
				beginImageUpload(element, function(data)
				{
					$scope.newRoom.imageSrc = data.uri;
				});
			}
		});
	}
]);
