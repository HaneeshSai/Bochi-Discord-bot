const { EmbedBuilder } = require("discord.js");
const Assets = require("../../assets/roleplays.json");
const config = require('../../config.json');

module.exports = {
    name: 'cuddle',
    aliases: [],
    category: 'fun',
    description: 'cuddles a user',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {

        const target = message.mentions.users.first()

        const user = message.author.id;

        cuddle = [
            `<@${user}> cuddles ${target}`,
            `<@${user}> loves to cuddle ${target}! So cute!`,
            `<@${user}> and ${target} cuddles each other!!`
        ]

        if(!target) {
            let embed = new EmbedBuilder()
            .setDescription(`<@${user}> ${config.wrong} please mention a valid user you want to cuddle!`)
            .setColor("Red");

            message.channel.send({embeds: [embed]})
            return;
        }

        let embed = new EmbedBuilder()
        .setDescription(cuddle[Math.floor(Math.random() * cuddle.length)])
        .setImage(Assets.cuddle[Math.floor(Math.random() * Assets.cuddle.length)])
        .setColor("Random");

        message.channel.send({embeds: [embed]})
    }
}