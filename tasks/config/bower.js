module.exports = function(grunt)
{
	grunt.config.set("bower", {
		"dev": {
			"dest": ".tmp/public",
			"js_dest": ".tmp/public/js",
			"css_dest": ".tmp/public/styles",
			"options": {
				"packageSpecific": {
					"ng-tags-input": {
						"files": [
							"ng-tags-input.js",
							"ng-tags-input.css"
						]
					},
					"angular": {
						"files": [
							"angular.js",
							"angular-csp.css"
						]
					}
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-bower");
};
