const { EmbedBuilder } = require("discord.js");
const { User } = require('../../utils/schema.js');
const config = require('../../config.json');
const emotes = require('../../assets/emotes.json');

module.exports = {
    name: 'leaderboard',
    aliases: ["rich"],
    category: 'fun',
    description: 'shows economy leaderboard',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {
        //getting all the users data
        const users = await User.find()

        //sorting the users
        const sortedUsers = users.sort((a,b) => {
            return (b.wallet + b.bank) - (a.wallet + a.bank)
        }).slice(0, 10)

        let firstpos = sortedUsers.shift()

        lbstr = sortedUsers.map((user, i) => {
            return `${emotes.numbers[i]} <@${user.id}> ${emotes.arrow} **${(user.wallet + user.bank).toLocaleString()}**`
        }).join("\n")

        let embed = new EmbedBuilder()
        .setTitle('Economy LeaderBoard')
        .setDescription(`${emotes.crown} Most Richest user <@${firstpos.id}> ${emotes.arrow} **${(firstpos.wallet + firstpos.bank).toLocaleString()}**\n\n${lbstr}\n\n${emotes.heart} gain more cash by \`.work\`\n${emotes.heart} gain more cash by \`.daily\`\n${emotes.heart} gain more cash by \`.beg\`\n${emotes.heart} gain more cash by \`.steal\``)
        .setImage(config.lbline)
        .setFooter({ text: `${config.guildName} | LeaderBoard` })
        .setColor("Random")

        message.channel.send({embeds: [embed]});


    }
}