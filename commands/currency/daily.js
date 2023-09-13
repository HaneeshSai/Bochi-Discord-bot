const { EmbedBuilder } = require('discord.js');
const { User } = require('../../utils/schema.js');
const sqlite = require('sqlite3');
const functions = require('../../utils/functions.js')
const config = require('../../config.json');

module.exports = {
    name: 'daily',
    category: 'Currency',
    cooldown: 1440 * 60000,
    description: 'daily reward to gain some cash',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {
        let Amount = 2000
        let user = message.author;
        const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

        let inv = new sqlite.Database('./database/shop.db', sqlite.OPEN_READWRITE);
        let q = `SELECT * FROM inventory WHERE userid = ${message.author.id}`;
        let row = await functions.dbdata(inv, q);
        
        if(row != undefined && Date.now() < row.cash_booster){
            Amount *= 2;
        }

        let time = new Date().getTime()

        let workEmbed = new EmbedBuilder()
        .setDescription(`<@${user.id}> ${config.tick} you have claimed **${Amount.toLocaleString()}** cash as your daily reward! you can use this command again after **24** hours from now`)
        .setColor("Random");

        message.channel.send({embeds: [workEmbed]});

        userData.wallet += Amount
        userData.cooldown.daily = time
        userData.save().catch(err => console.log(err))
        
    }

}
