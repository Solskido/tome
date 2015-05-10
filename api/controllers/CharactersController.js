/**
 * CharactersController
 *
 * @description :: Server-side logic for managing characters
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fs = require("fs");

module.exports = {

	/**
	 * `CharactersController.chars()`
	 */
	chars: function(req, res)
	{
		return res.view("player/chars", {
			"layout": "layout",
			"viewid": "chars",

			"bgImage": "/images/charactersbg.jpg"
		});
	},

	/**
	 * `CharactersController.char()`
	 */
	char: function(req, res)
	{
		var characterID = req.param("charid") || null;
		if(!characterID)
		{
			return res.redirect("/chars");
		}

		Characters.findOne({
			"id": characterID
		}).exec(function(err, character)
		{
			if(err)
			{
				sails.log.error(err);
				return res.serverError(err);
			}
			else if(!character
			|| (character.type === "ooc")
			|| (character.type === "dm"))
			{
				return res.redirect("/chars");
			}

			return res.view("player/char", {
				"layout": "layout",
				"viewid": "char",

				"character": character,
				"bgImage": "/images/newcharbg.jpg"
			});
		});
	},

	/**
	 * `CharactersController.newchar()`
	 */
	newchar: function(req, res)
	{
		return res.view("player/newchar", {
			"layout": "layout",
			"viewid": "newchar",

			"bgImage": "/images/newcharbg.jpg"
		});
	},

	/**
	 * `CharactersController.createorupdate()`
	 */
	createorupdate: function(req, res)
	{
		var id = req.param("id") || null;
		var name = req.param("name") || null;
		var alignment = req.param("alignment") || null;
		var gender = req.param("gender") || null;
		var level = req.param("level") || null;
		var deity = req.param("deity") || null;
		var homeland = req.param("homeland") || null;
		var race = req.param("race") || null;
		var size = req.param("size") || null;
		var age = req.param("age") || null;
		var height = req.param("height") || null;
		var weight = req.param("weight") || null;
		var eyes = req.param("eyes") || null;
		var bio = req.param("bio") || null;
		var notes = req.param("notes") || null;

		if(!name)
		{
			return res.badRequest();
		}

		var as_str = req.param("as_str") || null;
		var as_dex = req.param("as_dex") || null;
		var as_con = req.param("as_con") || null;
		var as_int = req.param("as_int") || null;
		var as_wis = req.param("as_wis") || null;
		var as_cha = req.param("as_cha") || null;
		var ta_str = req.param("ta_str") || null;
		var ta_dex = req.param("ta_dex") || null;
		var ta_con = req.param("ta_con") || null;
		var ta_int = req.param("ta_int") || null;
		var ta_wis = req.param("ta_wis") || null;
		var ta_cha = req.param("ta_cha") || null;
		var maxhp = req.param("maxhp") || null;
		var dr = req.param("dr") || null;
		var currhp = req.param("currhp") || null;
		var nlhp = req.param("nlhp") || null;
		var speed_base_ft = req.param("speed_base_ft") || null;
		var speed_armor_ft = req.param("speed_armor_ft") || null;
		var speed_fly = req.param("speed_fly") || null;
		var speed_fly_manuv = req.param("speed_fly_manuv") || null;
		var speed_swim = req.param("speed_swim") || null;
		var speed_climb = req.param("speed_climb") || null;
		var speed_burrow = req.param("speed_burrow") || null;
		var temp_mod = req.param("temp_mod") || null;
		var miscini = req.param("miscini") || null;
		var fort_base = req.param("fort_base") || null;
		var ref_base = req.param("ref_base") || null;
		var will_base = req.param("will_base") || null;
		var will_magic = req.param("will_magic") || null;
		var fort_magic = req.param("fort_magic") || null;
		var ref_magic = req.param("ref_magic") || null;
		var will_misc = req.param("will_misc") || null;
		var fort_misc = req.param("fort_misc") || null;
		var ref_misc = req.param("ref_misc") || null;
		var will_temp = req.param("will_temp") || null;
		var fort_temp = req.param("fort_temp") || null;
		var ref_temp = req.param("ref_temp") || null;
		var ac_natural = req.param("ac_natural") || null;
		var ac_deflection = req.param("ac_deflection") || null;
		var ac_misc = req.param("ac_misc") || null;
		var touch_ac_misc = req.param("touch_ac_misc") || null;
		var ff_ac_misc = req.param("ff_ac_misc") || null;
		var bab = req.param("bab") || null;
		var sr = req.param("sr") || null;
		var special = req.param("special") || null;
		var special_ab = req.param("special_ab") || null;
		var special_crit = req.param("special_crit") || null;
		var climb_ca = req.param("climb_ca") === "true";
		var climb_ranks = req.param("climb_ranks") || null;
		var climb_misc = req.param("climb_misc") || null;
		var swim_ca = req.param("swim_ca") === "true";
		var swim_ranks = req.param("swim_ranks") || null;
		var swim_misc = req.param("swim_misc") || null;
		var acrobatics_ca = req.param("acrobatics_ca") === "true";
		var acrobatics_ranks = req.param("acrobatics_ranks") || null;
		var acrobatics_misc = req.param("acrobatics_misc") || null;
		var disable_device_ca = req.param("disable_device_ca") === "true";
		var disable_device_ranks = req.param("disable_device_ranks") || null;
		var disable_device_misc = req.param("disable_device_misc") || null;
		var escape_artist_ca = req.param("escape_artist_ca") === "true";
		var escape_artist_ranks = req.param("escape_artist_ranks") || null;
		var escape_artist_misc = req.param("escape_artist_misc") || null;
		var ride_ca = req.param("ride_ca") === "true";
		var ride_ranks = req.param("ride_ranks") || null;
		var ride_misc = req.param("ride_misc") || null;
		var sleight_of_hand_ca = req.param("sleight_of_hand_ca") === "true";
		var sleight_of_hand_ranks = req.param("sleight_of_hand_ranks") || null;
		var sleight_of_hand_misc = req.param("sleight_of_hand_misc") || null;
		var stealth_ca = req.param("stealth_ca") === "true";
		var stealth_ranks = req.param("stealth_ranks") || null;
		var stealth_misc = req.param("stealth_misc") || null;
		var fly_ca = req.param("fly_ca") === "true";
		var fly_ranks = req.param("fly_ranks") || null;
		var fly_misc = req.param("fly_misc") || null;
		var appraise_ca = req.param("appraise_ca") === "true";
		var appraise_ranks = req.param("appraise_ranks") || null;
		var appraise_misc = req.param("appraise_misc") || null;
		var craft_ca = req.param("craft_ca") === "true";
		var craft_ranks = req.param("craft_ranks") || null;
		var craft_misc = req.param("craft_misc") || null;
		var knowledge_arcana_ca = req.param("knowledge_arcana_ca") === "true";
		var knowledge_arcana_ranks = req.param("knowledge_arcana_ranks") || null;
		var knowledge_arcana_misc = req.param("knowledge_arcana_misc") || null;
		var knowledge_dungeoneering_ca = req.param("knowledge_dungeoneering_ca") === "true";
		var knowledge_dungeoneering_ranks = req.param("knowledge_dungeoneering_ranks") || null;
		var knowledge_dungeoneering_misc = req.param("knowledge_dungeoneering_misc") || null;
		var knowledge_engineering_ca = req.param("knowledge_engineering_ca") === "true";
		var knowledge_engineering_ranks = req.param("knowledge_engineering_ranks") || null;
		var knowledge_engineering_misc = req.param("knowledge_engineering_misc") || null;
		var knowledge_geography_ca = req.param("knowledge_geography_ca") === "true";
		var knowledge_geography_ranks = req.param("knowledge_geography_ranks") || null;
		var knowledge_geography_misc = req.param("knowledge_geography_misc") || null;
		var knowledge_history_ca = req.param("knowledge_history_ca") === "true";
		var knowledge_history_ranks = req.param("knowledge_history_ranks") || null;
		var knowledge_history_misc = req.param("knowledge_history_misc") || null;
		var knowledge_local_ca = req.param("knowledge_local_ca") === "true";
		var knowledge_local_ranks = req.param("knowledge_local_ranks") || null;
		var knowledge_local_misc = req.param("knowledge_local_misc") || null;
		var knowledge_nature_ca = req.param("knowledge_nature_ca") === "true";
		var knowledge_nature_ranks = req.param("knowledge_nature_ranks") || null;
		var knowledge_nature_misc = req.param("knowledge_nature_misc") || null;
		var knowledge_nobility_ca = req.param("knowledge_nobility_ca") === "true";
		var knowledge_nobility_ranks = req.param("knowledge_nobility_ranks") || null;
		var knowledge_nobility_misc = req.param("knowledge_nobility_misc") || null;
		var knowledge_planes_ca = req.param("knowledge_planes_ca") === "true";
		var knowledge_planes_ranks = req.param("knowledge_planes_ranks") || null;
		var knowledge_planes_misc = req.param("knowledge_planes_misc") || null;
		var knowledge_religion_ca = req.param("knowledge_religion_ca") === "true";
		var knowledge_religion_ranks = req.param("knowledge_religion_ranks") || null;
		var knowledge_religion_misc = req.param("knowledge_religion_misc") || null;
		var linguistics_ca = req.param("linguistics_ca") === "true";
		var linguistics_ranks = req.param("linguistics_ranks") || null;
		var linguistics_misc = req.param("linguistics_misc") || null;
		var spellcraft_ca = req.param("spellcraft_ca") === "true";
		var spellcraft_ranks = req.param("spellcraft_ranks") || null;
		var spellcraft_misc = req.param("spellcraft_misc") || null;
		var heal_ca = req.param("heal_ca") === "true";
		var heal_ranks = req.param("heal_ranks") || null;
		var heal_misc = req.param("heal_misc") || null;
		var perception_ca = req.param("perception_ca") === "true";
		var perception_ranks = req.param("perception_ranks") || null;
		var perception_misc = req.param("perception_misc") || null;
		var profession_ca = req.param("profession_ca") === "true";
		var profession_ranks = req.param("profession_ranks") || null;
		var profession_misc = req.param("profession_misc") || null;
		var sense_motive_ca = req.param("sense_motive_ca") === "true";
		var sense_motive_ranks = req.param("sense_motive_ranks") || null;
		var sense_motive_misc = req.param("sense_motive_misc") || null;
		var survival_ca = req.param("survival_ca") === "true";
		var survival_ranks = req.param("survival_ranks") || null;
		var survival_misc = req.param("survival_misc") || null;
		var bluff_ca = req.param("bluff_ca") === "true";
		var bluff_ranks = req.param("bluff_ranks") || null;
		var bluff_misc = req.param("bluff_misc") || null;
		var diplomacy_ca = req.param("diplomacy_ca") === "true";
		var diplomacy_ranks = req.param("diplomacy_ranks") || null;
		var diplomacy_misc = req.param("diplomacy_misc") || null;
		var disguise_ca = req.param("disguise_ca") === "true";
		var disguise_ranks = req.param("disguise_ranks") || null;
		var disguise_misc = req.param("disguise_misc") || null;
		var handle_animal_ca = req.param("handle_animal_ca") === "true";
		var handle_animal_ranks = req.param("handle_animal_ranks") || null;
		var handle_animal_misc = req.param("handle_animal_misc") || null;
		var intimidate_ca = req.param("intimidate_ca") === "true";
		var intimidate_ranks = req.param("intimidate_ranks") || null;
		var intimidate_misc = req.param("intimidate_misc") || null;
		var perform_ca = req.param("perform_ca") === "true";
		var perform_ranks = req.param("perform_ranks") || null;
		var perform_misc = req.param("perform_misc") || null;
		var use_magic_device_ca = req.param("use_magic_device_ca") === "true";
		var use_magic_device_ranks = req.param("use_magic_device_ranks") || null;
		var use_magic_device_misc = req.param("use_magic_device_misc") || null;

		var weapon1 = req.param("weapon1") || null;
		var weapon1_ab = req.param("weapon1_ab") || null;
		var weapon1_crit = req.param("weapon1_crit") || null;
		var weapon1_type = req.param("weapon1_type") || null;
		var weapon1_range = req.param("weapon1_range") || null;
		var weapon1_ammo = req.param("weapon1_ammo") || null;
		var weapon1_dmg = req.param("weapon1_dmg") || null;

		var weapon2 = req.param("weapon2") || null;
		var weapon2_ab = req.param("weapon2_ab") || null;
		var weapon2_crit = req.param("weapon2_crit") || null;
		var weapon2_type = req.param("weapon2_type") || null;
		var weapon2_range = req.param("weapon2_range") || null;
		var weapon2_ammo = req.param("weapon2_ammo") || null;
		var weapon2_dmg = req.param("weapon2_dmg") || null;

		var weapon3 = req.param("weapon3") || null;
		var weapon3_ab = req.param("weapon3_ab") || null;
		var weapon3_crit = req.param("weapon3_crit") || null;
		var weapon3_type = req.param("weapon3_type") || null;
		var weapon3_range = req.param("weapon3_range") || null;
		var weapon3_ammo = req.param("weapon3_ammo") || null;
		var weapon3_dmg = req.param("weapon3_dmg") || null;

		var weapon4 = req.param("weapon4") || null;
		var weapon4_ab = req.param("weapon4_ab") || null;
		var weapon4_crit = req.param("weapon4_crit") || null;
		var weapon4_type = req.param("weapon4_type") || null;
		var weapon4_range = req.param("weapon4_range") || null;
		var weapon4_ammo = req.param("weapon4_ammo") || null;
		var weapon4_dmg = req.param("weapon4_dmg") || null;

		var secret_name = req.param("secret_name") === "true";
		var secret_alignment = req.param("secret_alignment") === "true";
		var secret_gender = req.param("secret_gender") === "true";
		var secret_level = req.param("secret_level") === "true";
		var secret_deity = req.param("secret_deity") === "true";
		var secret_homeland = req.param("secret_homeland") === "true";
		var secret_race = req.param("secret_race") === "true";
		var secret_size = req.param("secret_size") === "true";
		var secret_age = req.param("secret_age") === "true";
		var secret_height = req.param("secret_height") === "true";
		var secret_weight = req.param("secret_weight") === "true";
		var secret_eyes = req.param("secret_eyes") === "true";
		var secret_bio = req.param("secret_bio") === "true";

		Users.findOne({
			"id": req.session.user.id
		}).exec(function(err, userResult)
		{
			if(err)
			{
				sails.log.error(err);
				return res.serverError(err);
			}
			else if(!userResult)
			{
				sails.log.info("Wut");
				delete req.session.user;
				return res.redirect("/");
			}

			var character = {};
			character.name = name;
			character.alignment = alignment;
			character.gender = gender;
			character.level = level;
			character.deity = deity;
			character.homeland = homeland;
			character.race = race;
			character.size = size;
			character.age = age;
			character.height = height;
			character.weight = weight;
			character.eyes = eyes;
			character.bio = bio;
			character.notes = notes;

			var secrets = {};

			secrets.name = secret_name;
			secrets.alignment = secret_alignment;
			secrets.gender = secret_gender;
			secrets.level = secret_level;
			secrets.deity = secret_deity;
			secrets.homeland = secret_homeland;
			secrets.race = secret_race;
			secrets.size = secret_size;
			secrets.age = secret_age;
			secrets.height = secret_height;
			secrets.weight = secret_weight;
			secrets.eyes = secret_eyes;
			secrets.bio = secret_bio;

			character.secrets = secrets;

			character.charsheet = {
				"as_str": as_str,
				"as_dex": as_dex,
				"as_con": as_con,
				"as_int": as_int,
				"as_wis": as_wis,
				"as_cha": as_cha,
				"ta_str": ta_str,
				"ta_dex": ta_dex,
				"ta_con": ta_con,
				"ta_int": ta_int,
				"ta_wis": ta_wis,
				"ta_cha": ta_cha,
				"maxhp": maxhp,
				"dr": dr,
				"currhp": currhp,
				"nlhp": nlhp,
				"speed_base_ft": speed_base_ft,
				"speed_armor_ft": speed_armor_ft,
				"speed_fly": speed_fly,
				"speed_fly_manuv": speed_fly_manuv,
				"speed_swim": speed_swim,
				"speed_climb": speed_climb,
				"speed_burrow": speed_burrow,
				"temp_mod": temp_mod,
				"miscini": miscini,
				"fort_base": fort_base,
				"ref_base": ref_base,
				"will_base": will_base,
				"will_magic": will_magic,
				"fort_magic": fort_magic,
				"ref_magic": ref_magic,
				"will_misc": will_misc,
				"fort_misc": fort_misc,
				"ref_misc": ref_misc,
				"will_temp": will_temp,
				"fort_temp": fort_temp,
				"ref_temp": ref_temp,
				"ac_natural": ac_natural,
				"ac_deflection": ac_deflection,
				"ac_misc": ac_misc,
				"touch_ac_misc": touch_ac_misc,
				"ff_ac_misc": ff_ac_misc,
				"bab": bab,
				"sr": sr,
				"special": special,
				"special_ab": special_ab,
				"special_crit": special_crit,
				"climb_ca": climb_ca,
				"climb_ranks": climb_ranks,
				"climb_misc": climb_misc,
				"swim_ca": swim_ca,
				"swim_ranks": swim_ranks,
				"swim_misc": swim_misc,
				"acrobatics_ca": acrobatics_ca,
				"acrobatics_ranks": acrobatics_ranks,
				"acrobatics_misc": acrobatics_misc,
				"disable_device_ca": disable_device_ca,
				"disable_device_ranks": disable_device_ranks,
				"disable_device_misc": disable_device_misc,
				"escape_artist_ca": escape_artist_ca,
				"escape_artist_ranks": escape_artist_ranks,
				"escape_artist_misc": escape_artist_misc,
				"ride_ca": ride_ca,
				"ride_ranks": ride_ranks,
				"ride_misc": ride_misc,
				"sleight_of_hand_ca": sleight_of_hand_ca,
				"sleight_of_hand_ranks": sleight_of_hand_ranks,
				"sleight_of_hand_misc": sleight_of_hand_misc,
				"stealth_ca": stealth_ca,
				"stealth_ranks": stealth_ranks,
				"stealth_misc": stealth_misc,
				"fly_ca": fly_ca,
				"fly_ranks": fly_ranks,
				"fly_misc": fly_misc,
				"appraise_ca": appraise_ca,
				"appraise_ranks": appraise_ranks,
				"appraise_misc": appraise_misc,
				"craft_ca": craft_ca,
				"craft_ranks": craft_ranks,
				"craft_misc": craft_misc,
				"knowledge_arcana_ca": knowledge_arcana_ca,
				"knowledge_arcana_ranks": knowledge_arcana_ranks,
				"knowledge_arcana_misc": knowledge_arcana_misc,
				"knowledge_dungeoneering_ca": knowledge_dungeoneering_ca,
				"knowledge_dungeoneering_ranks": knowledge_dungeoneering_ranks,
				"knowledge_dungeoneering_misc": knowledge_dungeoneering_misc,
				"knowledge_engineering_ca": knowledge_engineering_ca,
				"knowledge_engineering_ranks": knowledge_engineering_ranks,
				"knowledge_engineering_misc": knowledge_engineering_misc,
				"knowledge_geography_ca": knowledge_geography_ca,
				"knowledge_geography_ranks": knowledge_geography_ranks,
				"knowledge_geography_misc": knowledge_geography_misc,
				"knowledge_history_ca": knowledge_history_ca,
				"knowledge_history_ranks": knowledge_history_ranks,
				"knowledge_history_misc": knowledge_history_misc,
				"knowledge_local_ca": knowledge_local_ca,
				"knowledge_local_ranks": knowledge_local_ranks,
				"knowledge_local_misc": knowledge_local_misc,
				"knowledge_nature_ca": knowledge_nature_ca,
				"knowledge_nature_ranks": knowledge_nature_ranks,
				"knowledge_nature_misc": knowledge_nature_misc,
				"knowledge_nobility_ca": knowledge_nobility_ca,
				"knowledge_nobility_ranks": knowledge_nobility_ranks,
				"knowledge_nobility_misc": knowledge_nobility_misc,
				"knowledge_planes_ca": knowledge_planes_ca,
				"knowledge_planes_ranks": knowledge_planes_ranks,
				"knowledge_planes_misc": knowledge_planes_misc,
				"knowledge_religion_ca": knowledge_religion_ca,
				"knowledge_religion_ranks": knowledge_religion_ranks,
				"knowledge_religion_misc": knowledge_religion_misc,
				"linguistics_ca": linguistics_ca,
				"linguistics_ranks": linguistics_ranks,
				"linguistics_misc": linguistics_misc,
				"spellcraft_ca": spellcraft_ca,
				"spellcraft_ranks": spellcraft_ranks,
				"spellcraft_misc": spellcraft_misc,
				"heal_ca": heal_ca,
				"heal_ranks": heal_ranks,
				"heal_misc": heal_misc,
				"perception_ca": perception_ca,
				"perception_ranks": perception_ranks,
				"perception_misc": perception_misc,
				"profession_ca": profession_ca,
				"profession_ranks": profession_ranks,
				"profession_misc": profession_misc,
				"sense_motive_ca": sense_motive_ca,
				"sense_motive_ranks": sense_motive_ranks,
				"sense_motive_misc": sense_motive_misc,
				"survival_ca": survival_ca,
				"survival_ranks": survival_ranks,
				"survival_misc": survival_misc,
				"bluff_ca": bluff_ca,
				"bluff_ranks": bluff_ranks,
				"bluff_misc": bluff_misc,
				"diplomacy_ca": diplomacy_ca,
				"diplomacy_ranks": diplomacy_ranks,
				"diplomacy_misc": diplomacy_misc,
				"disguise_ca": disguise_ca,
				"disguise_ranks": disguise_ranks,
				"disguise_misc": disguise_misc,
				"handle_animal_ca": handle_animal_ca,
				"handle_animal_ranks": handle_animal_ranks,
				"handle_animal_misc": handle_animal_misc,
				"intimidate_ca": intimidate_ca,
				"intimidate_ranks": intimidate_ranks,
				"intimidate_misc": intimidate_misc,
				"perform_ca": perform_ca,
				"perform_ranks": perform_ranks,
				"perform_misc": perform_misc,
				"use_magic_device_ca": use_magic_device_ca,
				"use_magic_device_ranks": use_magic_device_ranks,
				"use_magic_device_misc": use_magic_device_misc,
				"weapon1": weapon1,
				"weapon1_ab": weapon1_ab,
				"weapon1_crit": weapon1_crit,
				"weapon1_type": weapon1_type,
				"weapon1_range": weapon1_range,
				"weapon1_ammo": weapon1_ammo,
				"weapon1_dmg": weapon1_dmg,
				"weapon2": weapon2,
				"weapon2_ab": weapon2_ab,
				"weapon2_crit": weapon2_crit,
				"weapon2_type": weapon2_type,
				"weapon2_range": weapon2_range,
				"weapon2_ammo": weapon2_ammo,
				"weapon2_dmg": weapon2_dmg,
				"weapon3": weapon3,
				"weapon3_ab": weapon3_ab,
				"weapon3_crit": weapon3_crit,
				"weapon3_type": weapon3_type,
				"weapon3_range": weapon3_range,
				"weapon3_ammo": weapon3_ammo,
				"weapon3_dmg": weapon3_dmg,
				"weapon4": weapon4,
				"weapon4_ab": weapon4_ab,
				"weapon4_crit": weapon4_crit,
				"weapon4_type": weapon4_type,
				"weapon4_range": weapon4_range,
				"weapon4_ammo": weapon4_ammo,
				"weapon4_dmg": weapon4_dmg
			};

			if(!id)
			{
				character.type = "char";
				character.player = userResult.id;

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

						character.avatar = "/i/" + savedImage.id;
						finish();
					});
				}
				else
				{
					finish();
				}

				function finish()
				{
					Characters.create(character).exec(function(err, savedChar)
					{
						if(err)
						{
							sails.log.error(err);
							return res.serverError(err);
						}

						if(!userResult.characters)
						{
							userResult.characters = [savedChar.id];
						}
						else
						{
							userResult.characters.push(savedChar.id);
						}
						userResult.save(function(err, savedUser)
						{
							if(err)
							{
								sails.log.error(err);
								return res.serverError(err);
							}

							Characters.find({
								"id": savedUser.characters
							}).sort({ "createdAt": -1 }).exec(function(err, characterResults)
							{
								if(err)
								{
									sails.log.error(err);
									return res.serverError(err);
								}

								savedUser.characters = characterResults;
								savedUser.character = _.find(characterResults, { "type": "ooc" });
								req.session.user = savedUser;

								return res.json(savedChar);
							});
						});
					});
				}
			}
			else
			{
				Characters.findOne({
					"id": id
				}).exec(function(err, characterResult)
				{
					if(err)
					{
						sails.log.error(err);
						return res.serverError(err);
					}
					else if(!characterResult)
					{
						return res.badRequest();
					}
					else if(!LOOKUP.ownsCharacter(req.session.user, characterResult.id))
					{
						return res.forbidden();
					}

					characterResult.id = id;
					characterResult.name = name;
					characterResult.alignment = alignment;
					characterResult.gender = gender;
					characterResult.level = level;
					characterResult.deity = deity;
					characterResult.homeland = homeland;
					characterResult.race = race;
					characterResult.size = size;
					characterResult.age = age;
					characterResult.height = height;
					characterResult.weight = weight;
					characterResult.eyes = eyes;
					characterResult.bio = bio;
					characterResult.notes = notes;
					characterResult.charsheet = _.defaults(character.charsheet, characterResult.charsheet);
					characterResult.secrets = secrets;

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
								"id": characterResult.avatar.substr(3)
							}).exec(function(err)
							{
								if(err)
								{
									sails.log.error(err);
								}
							});

							characterResult.avatar = "/i/" + savedImage.id;
							finish();
						});
					}
					else
					{
						finish();
					}

					function finish()
					{
						characterResult.save(function(err, savedChar)
						{
							if(err)
							{
								sails.log.error(err);
								return res.serverError(err);
							}

							req.session.user.characters = _.map(req.session.user.characters, function(char)
							{
								if(savedChar.id === char.id)
								{
									char = savedChar;
								}
								return char;
							});
							return res.json(savedChar);
						});
					}
				});
			}
		});
	},

	/**
	 * `CharactersController.destroy()`
	 */
	destroy: function(req, res)
	{
		var characterID = req.param("charid") || null;

		if(!characterID)
		{
			return res.badRequest();
		}

		Users.findOne({
			"id": req.session.user.id
		}).exec(function(err, userResult)
		{
			if(err)
			{
				sails.log.error(err);
				return res.serverError(err);
			}

			if(!LOOKUP.ownsCharacter(userResult, characterID))
			{
				return res.forbidden();
			}

			Characters.findOne({
				"id": characterID
			}).exec(function(err, character)
			{
				if(err)
				{
					sails.log.error(err);
					return res.serverError(err);
				}

				character.player = null;
				character.save(function(err)
				{
					if(err)
					{
						sails.log.error(err);
						return res.serverError(err);
					}

					userResult.characters = _.without(userResult.characters, characterID);
					userResult.save(function(err, savedUser)
					{
						if(err)
						{
							sails.log.error(err);
							return res.serverError(err);
						}

						req.session.user.characters = _.reject(req.session.user.characters, { "id": characterID });
						return res.ok();
					});
				})
			});
		});
	},

	/**
	 * `CharactersController.select()`
	 */
	select: function(req, res)
	{
		var characterID = req.param("charid") || null;
		if(!characterID)
		{
			return res.badRequest();
		}
		if(!LOOKUP.ownsCharacter(req.session.user, characterID))
		{
			return res.forbidden();
		}
		req.session.user.character = _.find(req.session.user.characters, { "id": characterID });
		return res.ok();
	}
};