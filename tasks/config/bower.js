module.exports = function(grunt)
{
	grunt.config.set("bower", {
		"dev": {
			"dest": ".tmp/public",
			"js_dest": ".tmp/public/js",
			"css_dest": ".tmp/public/styles",
			"options": {
				"packageSpecific": {
					"angucomplete": {
						"files": [
							"angucomplete.js",
							"angucomplete.css"
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