const { EmbedBuilder } = require('discord.js');
const { User } = require('../../utils/schema.js');
const config = require('../../config.json');

module.exports = {
    name: 'balance',
    aliases : ['bal'],
    category: 'Currency',
    description: 'shows balance of a user',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {

        let user = message.mentions.members.first() 
        if (!user) user = message.author;
        const userData = await User.findOne({ id: user.id }) || new User({ id: user.id }) 

        let balembed = new EmbedBuilder()
        .setDescription(`<@${user.id}>'s Balance:\n**Wallet**: ${userData.wallet.toLocaleString()}\n**Bank**: ${userData.bank.toLocaleString()}`)
        .setColor("Random");

       message.channel.send({embeds: [balembed]});
    
    }

}
