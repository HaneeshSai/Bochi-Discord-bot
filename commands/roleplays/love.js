const { EmbedBuilder } = require("discord.js");
const Assets = require("../../assets/roleplays.json");
const config = require('../../config.json');

module.exports = {
    name: 'love',
    aliases: [],
    category: 'fun',
    description: 'loves a user',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {

        const target = message.mentions.users.first()

        const user = message.author.id;
        if(!target) {
            let embed = new EmbedBuilder()
            .setDescription(`<@${user}> ${config.wrong} please mention a valid user you want to love!`)
            .setColor("Red");

            message.channel.send({embeds: [embed]})
            return;
        }

        let embed = new EmbedBuilder()
        .setDescription(`<@${user}> loves ${target}`)
        .setColor("Random");

        message.channel.send({embeds: [embed]})
    }
}