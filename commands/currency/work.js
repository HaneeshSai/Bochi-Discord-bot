const { EmbedBuilder } = require("discord.js");
const { User } = require("../../utils/schema.js");
const config = require("../../config.json");
const sqlite = require("sqlite3");
const functions = require("../../utils/functions.js");

module.exports = {
  name: "work",
  category: "Currency",
  cooldown: 15 * 60000,
  description: "work to gain some cash",

  run: async (client, message, args) => {
    let Amount = 300;
    let user = message.author;
    const userData =
      (await User.findOne({ id: user.id })) || new User({ id: user.id });

    let inv = new sqlite.Database("./database/shop.db", sqlite.OPEN_READWRITE);
    let q = `SELECT * FROM inventory WHERE userid = ${message.author.id}`;
    let row = await functions.dbdata(inv, q);

    if (row != undefined && Date.now() < row.cash_booster) {
      Amount *= 2;
    }

    let Embed = new EmbedBuilder()
      .setDescription(
        `<@${user.id}> ${
          config.tick
        } You have claimed **${Amount.toLocaleString()}** cash by working! There is a cooldown of **15** mins before you can work again! `
      )
      .setColor("Random");

    message.channel.send({ embeds: [Embed] });

    userData.wallet += Amount;
    userData.cooldown.work = new Date().getTime();
    userData.save().catch((err) => client.log(err));
  },
};
