/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

	////////////////////////////////////////////////
	//	favicon.ico
	////////////////////////////////////////////////
	"GET /favicon.ico": "/images/favicon.ico",

	////////////////////////////////////////////////
	//	Index
	////////////////////////////////////////////////
	"GET /": "TomeController.index",

	////////////////////////////////////////////////
	//	User Management
	////////////////////////////////////////////////
	"POST /me/login": "UserController.login",
	"GET /me/logout": "UserController.logout",
	"POST /me/selectchar/:charid": "CharactersController.select",
	"GET /signup": "TomeController.signup",
	"POST /me/signup": "UserController.signup",

	////////////////////////////////////////////////
	//	Character Management
	////////////////////////////////////////////////
	"POST /me/character": "CharactersController.createorupdate",
	"GET /newchar": "CharactersController.newchar",
	"GET /chars": "CharactersController.chars",
	"GET /char/:charid": "CharactersController.char",
	"DELETE /char/:charid": "CharactersController.destroy",

	////////////////////////////////////////////////
	//	Rooms and Posting
	////////////////////////////////////////////////
	"GET /room/:tag": "TomeController.room",
	"GET /post/:id": "PostsController.getOne",
	"PUT /post/:id": "PostsController.edit",
	"POST /post": "PostsController.post",
	"POST /room": "RoomsController.createorupdate",
	"DELETE /room": "RoomsController.destroy",

	////////////////////////////////////////////////
	//	File Uploads
	////////////////////////////////////////////////
	"POST /file/image": "FileController.image",
	"GET /i/:id": "FileController.serve",

	////////////////////////////////////////////////
	//	Dungeon Master
	////////////////////////////////////////////////
	"GET /dm/screen": "DMController.dmscreen",
	"GET /dm/campaigns": "DMController.campaigns",
	"GET /dm/rooms": "DMController.roommanager",
	"GET /dm/players": "DMController.players",
	"GET /dm/newroom": "DMController.newroom",
	"POST /dm/roomusability": "RoomsController.roomusability",
	"POST /dm/roomvisability": "RoomsController.roomvisability"
};