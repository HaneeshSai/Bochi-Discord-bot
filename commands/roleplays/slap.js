const { EmbedBuilder } = require("discord.js");
const Assets = require("../../assets/roleplays.json");
const config = require('../../config.json');

module.exports = {
    name: 'slap',
    aliases: [],
    category: 'fun',
    description: 'slaps a user',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {

        const target = message.mentions.users.first()

        const user = message.author.id;

        slap = [
            `<@${user}> slaps ${target}`,
            `${target} was slapped hard by <@${user}>. Ouch.`,
            `<@${user}> slapped ${target} with everything they got! Must have hurt so much. Ouch.`
        ]

        if(!target) {
            let embed = new EmbedBuilder()
            .setDescription(`<@${user}> ${config.wrong} please mention a valid user you want to poke!`)
            .setColor("Red");

            message.channel.send({embeds: [embed]})
            return;
        }

        let embed = new EmbedBuilder()
        .setDescription(slap[Math.floor(Math.random() * slap.length)])
        .setImage(Assets.slap[Math.floor(Math.random() * Assets.slap.length)])
        .setColor("Random");
        message.channel.send({embeds: [embed]})
    }
}