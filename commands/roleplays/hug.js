const { EmbedBuilder } = require("discord.js");
const Assets = require("../../assets/roleplays.json");
const config = require('../../config.json');


module.exports = {
    name: 'hug',
    aliases: [],
    category: 'fun',
    description: 'hugs a user',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {

        const target = message.mentions.members.first()

        const user = message.author.id;

        hug = [
            `<@${user}> hugs ${target}`,
            `${target} was lonely so <@${user}> hugged them~`,
            `<@${user}> hugged ${target}! Kawaii~`
        ]

        if(!target) {
            let embed = new EmbedBuilder()
            .setDescription(`<@${user}> ${config.wrong} please mention a valid user you want to hug!`)
            .setColor("Red");

            message.channel.send({embeds: [embed]})
            return;
        }

        let embed = new EmbedBuilder()
        .setDescription(hug[Math.floor(Math.random() * hug.length)])
        .setImage(Assets.hug[Math.floor(Math.random() * Assets.hug.length)])
        .setColor("Random");

        message.channel.send({embeds: [embed]})
    }
}