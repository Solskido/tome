/****************************************************/
/*	Validate - Angular Service						*/
/*													*/
/*	Use this service to validate user input.		*/
/*													*/
/*	Methods											*/
/*	+ Validate(ruleSet, inputs) - Validate inputs	*/
/*													*/
/****************************************************/

Tome.factory("Validate", [
	"Say",
	function(Say)
	{
		Say = new Say("ValidateService");

		var ruleSets = {
			"login": {
				"email": {
					"required": true
				},
				"password": {
					"required": true
				}
			},
			"campaign": {
				"name": {
					"required": true
				},
				"tagline": {
					"required": false
				},
				"description": {
					"required": false
				},
				"theme": {
					"required": true
				}
			},
			"room": {
				"name": {
					"required": true
				},
				"subheading": {
					"required": false
				},
				"description": {
					"required": false
				}
			}
		};

		var rules = {
			"theme": {
				"choice": [
					"fantasy",
					"scifi"
				]
			}
		};

		var evaluate = {

			"required": function(required, value)
			{
				return (required ? (required && !!value) : true);
			},

			"choice": function(choices, choice)
			{
				return (_.indexOf(choices, choice) > -1);
			}
		};

		return function(ruleSet, inputs)
		{
			ruleSet = ruleSet || "";
			inputs = inputs || {};

			var ruleSetToUse = ruleSets[ruleSet];
			if(!ruleSetToUse)
			{
				Say.whoops("Couldn't find rule set \"" + ruleSet + "\"");
				return ["error"];
			}

			var invalid = [];
			_.forOwn(inputs, function(value, key)
			{
				var relevantRules = _.defaults(ruleSetToUse[key] || {}, rules[key] || {});
				_.forOwn(relevantRules, function(ruleData, rule)
				{
					if(!evaluate[rule](ruleData, value))
					{
						invalid.push(key);
					}
				});
			});

			return invalid;
		};
	}
]);