const { EmbedBuilder } = require("discord.js");
const Assets = require("../../assets/roleplays.json");
const config = require('../../config.json');

module.exports = {
    name: 'greet',
    aliases: [],
    category: 'fun',
    description: 'greets a user',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {

        const target = message.mentions.users.first()

        const user = message.author.id;

        greet = [
            `<@${user}> greets ${target}`,
            `<@${user}> waves at ${target}. Konnichiwa!`,
            `<@${user}> welcomes ${target}`
        ]

        if(!target) {
            let embed = new EmbedBuilder()
            .setDescription(`<@${user}> ${config.wrong} please mention a valid user you want to greet!`)
            .setColor("Red");

            message.channel.send({embeds: [embed]})
            return;
        }

        let embed = new EmbedBuilder()
        .setDescription(greet[Math.floor(Math.random() * greet.length)])
        .setImage(Assets.greet[Math.floor(Math.random() * Assets.greet.length)])
        .setColor("Random");

        message.channel.send({embeds: [embed]})
    }
}