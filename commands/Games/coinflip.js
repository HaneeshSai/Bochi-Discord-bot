const { EmbedBuilder } = require("discord.js");
const config = require('../../config.json');
const { User } = require('../../utils/schema.js');

module.exports = {
    name: 'coinflip',
    aliases: ['cf'],
    category: 'Games',
    description: 'play coinflip',
    params : [
        {
            name: "choice",
            required: true,
            options: ['heads', 'tails']
        },
        {
            name: "amount",
            required : true
        }
    ],
   
    run: async (client, message, {choice, amount}) => {

        let user = message.author;
        const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });
       

        if(amount === 'all') amount = userData.wallet;

        if(isNaN(amount)) {
            let embed = new EmbedBuilder()
            .setDescription(`${config.wrong} <@${user.id}> please provide a valid amount of **cash**`)
            .setColor("Red")
            message.channel.send({embeds: [embed]})
            return;
        }  else amount = Number(amount);
        
        if(amount > userData.wallet) {
            let embed = new EmbedBuilder()
        .setDescription(`${config.wrong} <@${user.id}> You do not have that many cash in your **wallet**`)
        .setColor("Red")
        message.channel.send({embeds: [embed]})
        return;
        }

        choice = choice.toLowerCase();
        let bot_choice;
        let chance = Math.floor(Math.random() * 100);

        if(chance > 50) bot_choice = choice;
        else bot_choice = choice == "tails" ? "heads" : "tails"

        if(bot_choice === choice) {
            userData.wallet += Number(amount);
            userData.save()
            let embed = new EmbedBuilder()
            .setTitle(`:coin: CoinFlip Machine`)
            .setDescription(`You chose \`${choice}\` and your bet was \`${amount.toLocaleString()}\` `)
            .addFields(
                {name: `coinflip result`, value: `its \`${bot_choice}\`, you have won and awarded with \`${amount}\` leafs`}
            )
            .setColor("Random")
            message.channel.send({embeds: [embed]})
            return;
        }
        else {
            userData.wallet -= Number(amount);
            userData.save()
            let embed = new EmbedBuilder()
            .setTitle(`:coin: CoinFlip Machine`)
            .setDescription(`You chose \`${choice}\` and your bet was \`${amount.toLocaleString()}\` `)
            .addFields(
                {name: `coinflip result`, value: `its \`${bot_choice}\`, you have lost \`${amount}\` leafs`}
            )
            .setColor("Random")
            message.channel.send({embeds: [embed]})
            return;
        }
        

    }
}