const { EmbedBuilder } = require('discord.js')
const { User } = require('../../utils/schema.js');
module.exports = {
	name: 'setbal',
	category: 'General',
	aliases : [''],
	permission: "owner",
	description: 'deletes some messages sent by a bot',
    params : [
        {
            name: "type",
            required: true,
            options: ['wallet', 'bank']
        },
        {
            name: "user",
            required : true
        },
        {
            name: "amount",
            required: true
        }
    ],
	run: async(client, message, args) => {
        let amount = args.amount;
        let mentioned = message.mentions.users.first();
        let types = args.type;

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
        } else amount = Number(amount);

        console.log(types)
        mentionedData[types] = amount;
        mentionedData.save()

        let embed = new EmbedBuilder()
        .setDescription(`<@${message.author.id}> you have set the **${types}** of <@${mentioned.id}> to **${amount.toLocaleString()}**`)
        .setColor('Random')

        message.channel.send({embeds: [embed]})
    }
}