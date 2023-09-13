const { EmbedBuilder } = require("discord.js");
const Assets = require("../../assets/roleplays.json");
const config = require('../../config.json');

module.exports = {
    name: 'poke',
    aliases: [],
    category: 'fun',
    description: 'pokes a user',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {

        const target = message.mentions.users.first()

        const user = message.author.id;

        poke = [
            `<@${user}> pokes ${target}`,
            `<@${user}> boops ${target}`,
            `<@${user}> is poking ${target}. boop boop!`
        ]

        if(!target) {
            let embed = new EmbedBuilder()
            .setDescription(`<@${user}> ${config.wrong} please mention a valid user you want to poke!`)
            .setColor("Red");

            message.channel.send({embeds: [embed]})
            return;
        }

        let embed = new EmbedBuilder()
        .setDescription(poke[Math.floor(Math.random() * poke.length)])
        .setImage(Assets.poke[Math.floor(Math.random() * Assets.poke.length)])
        .setColor("Random");

        message.channel.send({embeds: [embed]})
    }
}