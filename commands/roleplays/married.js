const { EmbedBuilder } = require("discord.js");
const { User } = require('../../utils/schema.js');
const config = require('../../config.json');

module.exports = {
    name: 'married',
    aliases: [],
    cooldown: 60000,
    category: 'fun',
    description: 'shows all the mareied users',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {
        user = message.mentions.members.first() || message.author;

        userdata = await User.findOne({ id: user.id }) || new User({ id: user.id });

        if(userdata.married.length < 1) {
            let embed = new EmbedBuilder()
            .setDescription(`<@${user.id}> You are not married to anyone yet! **.marry** to marry someone`)
            .setColor("Random");
            message.channel.send({embeds: [embed]});
            return;
        }

        let embed = new EmbedBuilder()
        .setDescription(`<@${user.id}>, You are happily married to
        ${userdata.married.map(e => `<@${e.id}> - <t:${Math.floor(e.time / 1000)}:R>`).join("\n")}`)
        .setColor("DarkVividPink");
        message.channel.send({embeds: [embed]})
    }
}
