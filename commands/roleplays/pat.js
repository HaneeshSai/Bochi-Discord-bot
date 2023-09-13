const { EmbedBuilder } = require("discord.js");
const Assets = require("../../assets/roleplays.json");
const config = require('../../config.json');

module.exports = {
    name: 'pat',
    aliases: [],
    category: 'fun',
    description: 'pat a user',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {

        const target = message.mentions.users.first()

        const user = message.author.id;

        pat = [
            `<@${user}> pats ${target}`,
            `${target} got pampered by <@${user}>!`,
            `<@${user}> pats ${target} as if they are a child :0`
        ]

        if(!target) {
            let embed = new EmbedBuilder()
            .setDescription(`<@${user}> ${config.wrong} please mention a valid user you want to poke!`)
            .setColor("Red");

            message.channel.send({embeds: [embed]})
            return;
        }

        let embed = new EmbedBuilder()
        .setDescription(pat[Math.floor(Math.random() * pat.length)])
        .setImage(Assets.pat[Math.floor(Math.random() * Assets.pat.length)])
        .setColor("Random");

        message.channel.send({embeds: [embed]})
    }
}