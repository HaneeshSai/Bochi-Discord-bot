const { Levels } = require("../../utils/schema.js");
const canvacord = require("canvacord");
const Discord = require("discord.js");

module.exports = {
  name: "rank",
  category: "info",
  description: "shows chat rank",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    let user = message.mentions.users.first() || message.author;
    let userData =
      (await Levels.findOne({ id: user.id })) || new Levels({ id: user.id });
    const users = await Levels.find();
    const rawLeaderboard = users.sort((a, b) => b.xp - a.xp);
    const pos = rawLeaderboard.findIndex((i) => i.id === user.id) + 1;

    const rank = new canvacord.Rank()
      .setAvatar(user.displayAvatarURL({ dynamic: false, format: "png" }))
      .setFontSize("200px")
      .setCurrentXP(userData.xp)
      .setRequiredXP(userData.reqXp)
      .setLevel(userData.level)
      .setRank(pos)
      .setBackground(
        "IMAGE",
        "https://wallpaperset.com/w/full/f/7/a/473216.jpg"
      )
      .setProgressBar("#FFA500", "COLOR")
      .setUsername(user.username);
    rank.build().then((data) => {
      const attachment = new Discord.AttachmentBuilder(data, "funny.png");
      message.channel.send({
        content: `**Chat Rankings** ${user.username}`,
        files: [attachment],
      });
    });
  },
};
