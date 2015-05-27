/****************************************************/
/*	Sync - Angular Service							*/
/*													*/
/*	Use this service to track the app's AJAX state	*/
/*													*/
/*	Methods											*/
/*	+ Sync.start(id) - Begin an AJAX request		*/
/*	+ Sync.stop(id) - End an AJAX request			*/
/*	+ Sync.syncing(id) - Check on an AJAX request	*/
/*													*/
/****************************************************/

Tome.factory("Sync", [
	"Say",
	function(Say)
	{
		Say = new Say("SyncService");

		var _syncing = {};

		return {

			/**
			 * Begin an AJAX request
			 *
			 * @param id {string}
			 */
			"start": function(id)
			{
				if(!id)
				{
					return;
				}

				if(_.isUndefined(_syncing[id]))
				{
					_syncing[id] = 1;
				}
				else
				{
					_syncing[id]++;
				}
			},

			/**
			 * End an AJAX request
			 *
			 * @param id {string}
			 */
			"stop": function(id)
			{
				if(!id)
				{
					return;
				}

				if(_.isUndefined(_syncing[id]))
				{
					_syncing[id] = 0;
				}
				else
				{
					_syncing[id] -= 1;
				}

				_syncing[id] = Math.max(_syncing[id], 0);
			},

			/**
			 * Check on an AJAX request
			 *
			 * @param id {string}
			 * @returns {boolean}
			 */
			"syncing": function(id)
			{
				if(_.isUndefined(id))
				{
					var anything = false;
					_.forOwn(_syncing, function(value, key)
					{
						if(value > 0)
						{
							anything = true;
						}
					});

					return anything;
				}

				if(_.isUndefined(_syncing[id]))
				{
					return false;
				}
				else
				{
					return (_syncing[id] > 0);
				}
			}
		};
	}
]);