const { EmbedBuilder } = require("discord.js");
const Assets = require("../../assets/roleplays.json");
const config = require('../../config.json');

module.exports = {
    name: 'kiss',
    aliases: [],
    category: 'fun',
    description: 'kisses a user',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {

        const target = message.mentions.members.first()

        const user = message.author.id;

        kiss = [
            `<@${user}> kissed ${target}`,
            `Oh my~ ${target} has been kissed by <@${user}>!`,
            `How cute!! <@${user}> kissed ${target}!`
        ]

        if(!target) {
            let embed = new EmbedBuilder()
            .setDescription(`<@${user}> ${config.wrong} please mention a valid user you want to kiss!`)
            .setColor("Red");

            message.channel.send({embeds: [embed]})
            return;
        }

        let embed = new EmbedBuilder()
        .setDescription(kiss[Math.floor(Math.random() * kiss.length)])
        .setImage(Assets.kiss[Math.floor(Math.random() * Assets.kiss.length)])
        .setColor("Random");

        message.channel.send({embeds: [embed]})
    }
}