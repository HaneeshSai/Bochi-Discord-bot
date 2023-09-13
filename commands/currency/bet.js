const { EmbedBuilder, UserFlagsBitField } = require('discord.js');
const { User } = require('../../utils/schema.js');
const formatdays = require('../../utils/functions')
const config = require('../../config.json');

module.exports = {
    name: 'bet',
    aliases: [''],
    category: 'Currency',
    description: 'bet some amount of cash',

    params: [
        {
            name: "amount",
        }
    ],
    run: async (client, message, {amount}) => {

        let user = message.author;

        const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });
        if (amount?.toLowerCase() == "all") amount = userData.wallet;

        if (!amount || isNaN(amount) && amount.toLowerCase() !== "all") {
            let embed = new EmbedBuilder()
            .setDescription(`<@${user.id}> ${config.wrong} please specify a valid amount to deposit`)
            .setColor("Red");

            message.channel.send({embeds: [embed]});
            return;
        } else amount = Number(amount);
        

        if (amount > userData.wallet) {
            let embed = new EmbedBuilder()
            .setDescription(`<@${user.id}> ${config.wrong} you do have that amount of cash in your waller to store in your bank`)
            .setColor("Red");

            message.channel.send({embeds: [embed]});
            return;
        }

        

        let winamount = Math.floor(Math.random() * (amount)) + amount;
        let loseamount = amount;
        let chance = Math.floor(Math.random() * 100) + 1;


        if (chance > 70) {
            let embed = new EmbedBuilder()
                .setDescription(`<@${user.id}> ${config.tick} you have bet **${amount}** won the bet and won **${winamount.toLocaleString()}** cash`)
                .setColor("Random")

            userData.wallet += Number(winamount);
            userData.save();

            message.channel.send({ embeds: [embed] });
            return;
        }

        if (chance < 70) {
            let embed = new EmbedBuilder()
                .setDescription(`<@${user.id}> ${config.wrong} you have lost the bet and lost **${Number(loseamount).toLocaleString()}** cash.`)
                .setColor("Random")

            userData.wallet -= Number(loseamount);
            userData.save();
            message.channel.send({ embeds: [embed] });
        }
    }

}
