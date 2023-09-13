const { EmbedBuilder } = require("discord.js");
const sqlite = require("sqlite3");
const config = require("../../config.json");
const datb = require("./../../utils/functions.js");

const minerals = {
  65: ["Coal", "Nice", 5],
  35: ["Iron", "Great", 3],
  15: ["Silver", "Yay", 2],
  5: ["Gold", "Wow", 2],
  1: ["Diamond", "OMG :scream:", 1],
  80: "nothing",
};

module.exports = {
  name: "dig",
  aliases: [""],
  category: "Currency",
  description: "give another user cash",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    let db = new sqlite.Database("./database/shop.db", sqlite.OPEN_READWRITE);
    let query = `SELECT shovel FROM inventory WHERE userid = ${message.author.id}`;
    let row = await datb.dbdata(db, query);
    if (row === undefined || row.shovel < 1) {
      let embed = new EmbedBuilder()
        .setDescription(
          `${config.wrong} <@${message.author.id}> you do no possess a \`shovel\`!, You need a shovel to use this command`
        )
        .setColor("Red");
      return message.channel.send({ embeds: [embed] });
    } else {
      let chance = Math.floor(Math.random() * 100);

      let chances = Object.keys(minerals);
      let closest = chances.reduce((a, b) => {
        return Math.abs(b - chance) < Math.abs(a - chance) ? b : a;
      });

      closest = Number(closest);

      if (closest == 80) {
        let embed = new EmbedBuilder()
          .setDescription(
            `${config.wrong} <@${message.author.id}> You dug and dug but found nothing!, better luck next time`
          )
          .setColor("Red");
        db.run(
          `UPDATE inventory SET shovel = shovel - 1 WHERE userid = ${message.author.id}`
        );
        return message.channel.send({ embeds: [embed] });
      }

      let num = Math.floor(Math.random() * minerals[closest][2]) + 1;

      let embed = new EmbedBuilder()
        .setDescription(
          `${config.tick} <@${message.author.id}> ${minerals[closest][1]}!! you have found **${num}** blocks \`${minerals[closest][0]}\`! you can sell your ${minerals[closest][0]} whenever you want in the market or trade with others`
        )
        .setColor("Random");

      let col = minerals[closest][0];

      message.channel.send({ embeds: [embed] });
      db.run(
        `UPDATE collected SET ${col} = ${col} + ${num} WHERE userid = ${message.author.id}`
      );
      db.run(
        `UPDATE inventory SET shovel = shovel - 1 WHERE userid = ${message.author.id}`
      );
    }
  },
};
