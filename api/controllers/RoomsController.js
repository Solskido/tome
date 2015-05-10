/**
 * RoomsController
 *
 * @description :: Server-side logic for managing rooms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fs = require("fs");

module.exports = {

	/**
	 * `RoomsController.createorupdate()`
	 */
	createorupdate: function(req, res)
	{
		var id = req.param("id") || null;
		var name = req.param("name") || null;
		var subheading = req.param("subheading") || null;
		var description = req.param("description") || null;

		if(!name
		|| !subheading
		|| !description)
		{
			return res.badRequest();
		}

		if(!id)
		{
			var room = {};
			room.name = name;
			room.subheading = subheading;
			room.description = description;
			room.open = true;
			room.visible = false;
			room.tag = room.name.toLowerCase().replace(/[^a-z ]/g, '').replace(/ /g, '-');

			if(req.session.user.uploadedImage)
			{
				Images.create(req.session.user.uploadedImage).exec(function(err, savedImage)
				{
					if(err)
					{
						sails.log.error(err);
						return res.serverError(err);
					}

					req.session.user.uploadedImage = false;

					room.image = "/i/" + savedImage.id;
					finish();
				});
			}
			else
			{
				finish();
			}

			function finish()
			{
				Rooms.create(room).exec(function(err, savedRoom)
				{
					if(err)
					{
						sails.log.error(err);
						return res.serverError(err);
					}

					return res.json(savedRoom);
				});
			}
		}
		else
		{
			Rooms.findOne({
				"id": id
			}).exec(function(err, roomResult)
			{
				if(err)
				{
					sails.log.error(err);
					return res.serverError(err);
				}
				else if(!roomResult)
				{
					return res.badRequest();
				}

				roomResult.name = name;
				roomResult.subheading = subheading;
				roomResult.description = description;

				if(req.session.user.uploadedImage)
				{
					Images.create(req.session.user.uploadedImage).exec(function(err, savedImage)
					{
						if(err)
						{
							sails.log.error(err);
							return res.serverError(err);
						}

						req.session.user.uploadedImage = false;

						Images.destroy({
							"id": room.image.substr(3)
						}).exec(function(err)
						{
							if(err)
							{
								sails.log.error(err);
							}
						});

						room.room = "/i/" + savedImage.id;
						finish();
					});
				}
				else
				{
					finish();
				}

				function finish()
				{
					if(req.session.user.uploadedImage)
					{
						roomResult.image = req.session.user.uploadedImage;
						req.session.user.uploadedImage = false;
					}

					roomResult.save(function(err, savedRoom)
					{
						if(err)
						{
							sails.log.error(err);
							return res.serverError(err);
						}

						return res.json(savedRoom);
					});
				}
			});
		}
	},

	/**
	 * `RoomsController.destroy()`
	 */
	destroy: function(req, res)
	{
		var roomID = req.param("id") || null;
		if(!roomID)
		{
			return res.badRequest();
		}

		Rooms.destroy({
			"id": roomID
		}).exec(function(err, destroyed)
		{
			if(err)
			{
				sails.log.error(err);
				return res.serverError();
			}

			Posts.destroy({
				"room": roomID
			}).exec(function(err, destroyed)
			{
				if(err)
				{
					sails.log.error(err);
					return res.serverError();
				}

				return res.ok();
			});
		});
	},

	/**
	 * `RoomsController.roomusability()`
	 */
	roomusability: function(req, res)
	{
		var open = req.param("open") || null;
		var roomID = req.param("id") || null;
		if(!roomID
		|| !open
		|| ((open !== "true")
			&& (open !== "false")))
		{
			return res.badRequest();
		}
		open = (open === "true");

		Rooms.findOne({
			"id": roomID
		}).exec(function(err, roomResult)
		{
			if(err)
			{
				sails.log.error(err);
				return res.serverError(err);
			}
			else if(!roomResult)
			{
				return res.badRequest();
			}

			roomResult.open = open;
			roomResult.save(function(err, savedRoom)
			{
				if(err)
				{
					sails.log.error(err);
					return res.serverError();
				}

				return res.json(savedRoom);
			});
		});
	},

	/**
	 * `RoomsController.roomvisability()`
	 */
	roomvisability: function(req, res)
	{
		var visible = req.param("visible") || null;
		var roomID = req.param("id") || null;
		if(!roomID
		|| !visible
		|| ((visible !== "true")
			&& (visible !== "false")))
		{
			return res.badRequest();
		}
		visible = (visible === "true");

		Rooms.findOne({
			"id": roomID
		}).exec(function(err, roomResult)
		{
			if(err)
			{
				sails.log.error(err);
				return res.serverError(err);
			}
			else if(!roomResult)
			{
				return res.badRequest();
			}

			roomResult.visible = visible;
			roomResult.save(function(err, savedRoom)
			{
				if(err)
				{
					sails.log.error(err);
					return res.serverError();
				}

				return res.json(savedRoom);
			});
		});
	}
};