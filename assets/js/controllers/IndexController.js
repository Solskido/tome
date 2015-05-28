Tome.controller("IndexController", [
	"$rootScope",
	"$scope",
	"Say",
	"IO",
	function($rootScope, $scope, Say, IO)
	{
		Say = new Say("IndexController");
		Say.hello("loaded.");

		IO.get("/me/stats", function(err, res)
		{
			$scope.stats = res;
		});

		IO.get("/campaigns", function(err, res)
		{
			$scope.campaigns = res;
		});

		$scope.INTENT = angular.extend($scope.INTENT || {},
		{

			"Math": Math,

			"sortCampaignsByActivity": function(campaign)
			{
				return _.max(_.pluck(campaign.rooms, "lastPost"));
			},

			"totalRolls": function(rollID)
			{
				var rollCount = 0;
				if(!$scope.stats)
				{
					return rollCount;
				}

				_.forOwn($scope.stats.rolls, function(value, key)
				{
					if(rollID
					&& (key === rollID))
					{
						rollCount = value.count;
					}
					else if(!rollID)
					{
						rollCount += value.count;
					}
				});

				return rollCount;
			},

			"averageRoll": function(rollID)
			{
				var rollCount = 0;
				if(!rollID)
				{
					return rollCount;
				}
				else if(!$scope.stats)
				{
					return rollCount;
				}

				var totalRolls = 0;
				_.forEach($scope.stats.rolls, function(roll)
				{
					var keyID = "d" + roll.die;

					if(rollID
					&& (keyID === rollID))
					{
						rollCount++;
						totalRolls += roll.roll;
					}
					else if(!rollID)
					{
						rollCount++;
						totalRolls += roll.roll;
					}
				});

				return Math.round(totalRolls / rollCount);
			},

			"numberOfRolls": function(rollID, rollAmount)
			{
				var rollCount = 0;
				if(!rollID)
				{
					return rollCount;
				}
				else if(!$scope.stats)
				{
					return rollCount;
				}

				_.forEach($scope.stats.rolls, function(roll)
				{
					var keyID = "d" + roll.die;

					if(rollID
					&& (keyID === rollID)
					&& (roll.roll === rollAmount))
					{
						rollCount++;
					}
				});

				return rollCount;
			},

			"luckiestCharacter": function(standard)
			{
				var luckiestCharacter;

				if($scope.stats)
				{
					var aggregate = {};
					_.forEach($scope.stats.rolls, function(roll)
					{
						aggregate[roll.character] = aggregate[roll.character] || {};
						aggregate[roll.character].rolls = aggregate[roll.character].rolls || 0;
						aggregate[roll.character].totalSuccessPercentage = aggregate[roll.character].totalSuccessPercentage || 0;

						aggregate[roll.character].rolls++;
						aggregate[roll.character].totalSuccessPercentage += (roll.roll / roll.die * 100);
					});

					var luckiestCharacterID = "";
					var luckiestCharactersSuccessPercentage = 0;
					_.forOwn(aggregate, function(stat, character)
					{
						var successPercentage = (stat.totalSuccessPercentage / stat.rolls);
						if(successPercentage > luckiestCharactersSuccessPercentage)
						{
							if(standard
							&& _.find($rootScope.user.defaultCharacters, { "id": character }))
							{
								return;
							}

							luckiestCharacterID = character;
							luckiestCharactersSuccessPercentage = successPercentage;
						}
					});

					if(luckiestCharacterID)
					{
						luckiestCharacter = _.find($rootScope.user.characters, { "id": luckiestCharacterID });
						if(!luckiestCharacter)
						{
							luckiestCharacter = _.find($rootScope.user.defaultCharacters, { "id": luckiestCharacterID });
						}
					}
				}

				if(luckiestCharacter)
				{
					luckiestCharacter.luck = Math.round(luckiestCharactersSuccessPercentage);
				}

				return luckiestCharacter || {
					"name": "Nobody",
					"id": 0,
					"luck": Math.round(luckiestCharactersSuccessPercentage)
				};
			},

			"quietestCharacter": function(standard)
			{
				var quietestCharacter;
				var lowestPostCount = Infinity;

				if($scope.stats)
				{
					var characterList = $rootScope.user.characters;
					if(!standard)
					{
						characterList = _.union(characterList, $rootScope.user.defaultCharacters);
					}
					_.forEach(characterList, function(character)
					{
						if($scope.stats.postCountsByCharacter[character.id] < lowestPostCount)
						{
							quietestCharacter = character;
							quietestCharacter.posts = $scope.stats.postCountsByCharacter[character.id];
							lowestPostCount = $scope.stats.postCountsByCharacter[character.id];
						}
					});
				}

				return quietestCharacter || {
					"name": "Nobody",
					"id": 0,
					"posts": 0
				};
			},

			"loudestCharacter": function(standard)
			{
				var loudestCharacter;
				var highestPostCount = 0;

				if($scope.stats)
				{
					var characterList = $rootScope.user.characters;
					if(!standard)
					{
						characterList = _.union(characterList, $rootScope.user.defaultCharacters);
					}
					_.forEach(characterList, function(character)
					{
						if($scope.stats.postCountsByCharacter[character.id] > highestPostCount)
						{
							loudestCharacter = character;
							loudestCharacter.posts = $scope.stats.postCountsByCharacter[character.id];
							highestPostCount = $scope.stats.postCountsByCharacter[character.id];
						}
					});
				}

				return loudestCharacter || {
					"name": "Nobody",
					"id": 0,
					"posts": 0
				};
			}
		});
	}
]);