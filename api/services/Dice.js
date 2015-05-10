module.exports = Dice = {

	/********************/
	/*	Dice types		*/
	/********************/
	TYPES: {
		2: true,
		4: true,
		6: true,
		8: true,
		10: true,
		12: true,
		20: true,
		100: true
	},

	/********************/
	/*	Dice roller		*/
	/********************/
	roll: function(sides)
	{
		if(!Dice.TYPES[sides])
		{
			return false;
		}

		var mod = 1;
		if(sides === 100)
		{
			// Let the roll stay 0 - 99
			mod = 0;
		}
		return Math.floor((Math.random() * sides) + mod);
	}
};