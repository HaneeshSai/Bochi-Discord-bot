const { EmbedBuilder } = require('discord.js');
const { User } = require('../../utils/schema.js');
const config = require('../../config.json');

module.exports = {
    name: 'beg',
    aliases: [],
    category: 'Currency',
    cooldown: 15 * 60000,
    description: 'withdraw cash from bank',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {

        let user = message.author;

        const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });
        let chance = Math.floor(Math.random() * 100) + 1;

        let amount = 300

        if (chance < 50) {
            let embed = new EmbedBuilder()
                .setDescription(`<@${user.id}> ${config.wrong} nobody wants to give you any cash this time! come back some other time`)
                .setColor("Random");

                userData.cooldown.beg = new Date().getTime();
            userData.save();

            message.channel.send({ embeds: [embed] });
            return;
        }

        if (chance > 50) {
            let embed = new EmbedBuilder()
                .setDescription(`<@${user.id}> ${config.tick} someone has donated you **${amount}** cash! Be grateful for them`)
                .setColor("Random")

            userData.wallet += Number(amount);
            userData.cooldown.beg = new Date().getTime();
            userData.save();

            message.channel.send({ embeds: [embed] });
        }
    }

}
