/**
 * FileController
 *
 * @description :: Server-side logic for managing file uploads
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fs = require("fs");
var mime = require("mime");

module.exports = {

	/**
	 * `FileController.image()`
	 */
	"image": function(req, res)
	{
		console.log(req.params.all());
		console.log(req.file);
		console.log(req.files);
//		var image = req.file("image") || null;
//		console.log(image);
		return res.ok();

		if(!image)
		{
			return res.badRequest();
		}

		image.upload(function(err, file)
		{
			if(err)
			{
				sails.log.error(err);
				return res.serverError(err);
			}

			if(_.isArray(file))
			{
				file = file[0];
			}

			if(!file
			|| (file.type.split("/")[0] !== "image"))
			{
				try
				{
					fs.unlink(file.fd, function(err)
					{
						if(err)
						{
							sails.log.error(err);
						}
						return res.badRequest();
					});
				}
				catch(e)
				{
					sails.log.error(err);
					return res.serverError(e);
				}
			}
			else
			{
				fs.readFile(file.fd, function(err, data)
				{
					if(err)
					{
						sails.log.error(err);
						return res.serverError(err);
					}
					else
					{
						var image = {
							"mimeType": mime.lookup(file.fd),
							"data": data.toString("base64")
						};

						req.session.user.uploadedImage = image;
						return res.json({
							"uri": "data:" + image.mimeType + ";base64," + image.data
						});
					}
				});
			}
		});
	},

	/**
	 * `FileController.serve()`
	 */
	"serve": function(req, res)
	{
		var imageID = req.param("id") || null;
		if(!imageID)
		{
			return res.notFound();
		}

		Images.findOne({
			"id": imageID
		}).exec(function(err, imageResult)
		{
			if(err)
			{
				sails.log.error(err);
				return res.notFound();
			}
			else if(!imageResult)
			{
				return res.notFound();
			}

			var modified = new Date(imageResult.updatedAt);
			if((req.headers
			&& req.headers["if-modified-since"])
			&& (new Date(req.headers["if-modified-since"] < modified)))
			{
				return res.send(304);
			}

			res.status(200);
			res.set("Content-Type", imageResult.mimeType);
			res.set("Cache-Control", "public");
			res.set("Last-Modified", modified);
			return res.end(imageResult.data, "base64");
		});
	}
};