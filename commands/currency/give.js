const { EmbedBuilder } = require('discord.js');
const { User } = require('../../utils/schema.js');
const config = require('../../config.json');

module.exports = {
    name: 'give',
    aliases: ['giv'],
    category: 'Currency',
    description: 'give another user cash',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {

        let user = message.author;
        let mentioned = message.mentions.members.first()
        var amount = args[1]

        const userData = await User.findOne({ id: user.id }) || new User({ id: user.id }); 
        const mentionedData = await User.findOne({ id: mentioned.id}) || new User({ id: mentioned.id });

        if(!mentioned) {
            let embed = new EmbedBuilder()
            .setDescription(`<@${user.id}> ${config.wrong} please mention a user you wish to give your cash`)
            .setColor("Red");

            message.channel.send({embeds: [embed]});
            return;
        }

        if (!amount || isNaN(amount) && amount.toLowerCase() !== "all") {
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
        .setDescription(`<@${user.id}> ${config.tick} you have given ${mentioned} **${amount.toLocaleString()}** cash`)
        .setColor("Random")

        userData.wallet -= Number(amount);
        userData.save();
        mentionedData.wallet += Number(amount);
        mentionedData.save();
        
        message.channel.send({embeds: [embed]});
        
    }

}
