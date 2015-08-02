var internals = {};

module.exports = {

	"convertNameToTag": function(options, cb)
	{
		var callback = function() {};
		if(_.isFunction(cb))
		{
			callback = cb;
		}

		options = options || {};
		if(!options.name)
		{
			callback(null, "");
		}

		var tag = options.name.replace(/[^A-Za-z0-9 ]/g, '').trim().replace(/ /g, '-').toLowerCase();
		if(!options.model)
		{
			return callback(null, tag);
		}

		var model = sails.models[options.model];
		if(!model)
		{
			return callback(null, tag);
		}

		model.find({
			"tag": {
				"contains": tag
			}
		})
		.then(function(existingDocuments)
		{
			if(!existingDocuments.length)
			{
				return callback(null, tag);
			}
			else
			{
				while(_.find(existingDocuments, { "tag": tag }))
				{
					tag = internals.incrementTagIndex(tag);
				}

				return callback(null, tag);
			}
		})
		.catch(callback);
	}
};

internals.incrementTagIndex = function(tag)
{
	var lastHyphen = _.lastIndexOf(tag, "-");
	if(lastHyphen >= 0)
	{
		var index = parseInt(tag.substr(lastHyphen + 1));
		if(_.isNaN(index))
		{
			tag += "-2";
		}
		else
		{
			tag = (tag.substr(0, lastHyphen) + "-" + (index + 1));
		}
	}
	else
	{
		tag += "-2";
	}

	return tag;
};
