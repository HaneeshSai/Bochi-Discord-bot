const { EmbedBuilder } = require('discord.js');
const { User } = require('../../utils/schema.js');
const config = require('../../config.json');

module.exports = {
    name: 'deposit',
    aliases: ['dep', 'store'],
    category: 'Currency',
    description: 'store cash to bank',
    params: [
        {
            name: "amount",
            required: true,
        }
    ],

    run: async (client, message, {amount}) => {

        let user = message.author;

        const userData = await User.findOne({ id: user.id }) || new User({ id: user.id }) 

        if (isNaN(amount) && amount.toLowerCase() !== "all") {
            let embed = new EmbedBuilder()
            .setDescription(`<@${user.id}> ${config.wrong} please specify a valid amount to deposit`)
            .setColor("Red");

            message.channel.send({embeds: [embed]});
            return;
        }

        if (amount > userData.wallet) {
            let embed = new EmbedBuilder()
            .setDescription(`<@${user.id}> ${config.wrong} you do have that amount of cash in your waller to store in your bank`)
            .setColor("Red");

            message.channel.send({embeds: [embed]});
            return;
        }

        if (amount === 'all') amount = Number(userData.wallet)

        let embed = new EmbedBuilder()
        .setDescription(`<@${user.id}> ${config.tick} you have deposited **${amount.toLocaleString()}** cash to your bank`)
        .setColor("Random")

        userData.wallet -= Number(amount);
        userData.bank += Number(amount);
        userData.save();
        
        message.channel.send({embeds: [embed]});
    }

}
