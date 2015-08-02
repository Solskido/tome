Tome.factory("Mothership", function()
{
	function buildData()
	{
		var data = {};
		try
		{
			data = JSON.parse(document.getElementById("ejs").dataset.json);
		}
		catch(e)
		{
			data = {};
		}

		return data;
	}

	return buildData();
});
