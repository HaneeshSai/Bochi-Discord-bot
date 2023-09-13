const { EmbedBuilder } = require('discord.js');
const sqlite = require('sqlite3');
const config = require('../../config.json');
const datb = require('./../../utils/functions.js')


const minerals = {
    45: ['Squirrel', 'Nice', 5],
    15: ['Rabbit', 'Yay', 4],
    5: ['Boar', 'Wow', 1],
    1: ['Deer', 'OMG :scream:', 1],
    80: 'nothing'
}

module.exports = {
    name: 'hunt',
    aliases: [''],
    category: 'Currency',
    description: 'give another user cash',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {
        let db = new sqlite.Database('./database/shop.db', sqlite.OPEN_READWRITE);
        let query = `SELECT cross_bow FROM inventory WHERE userid = ${message.author.id}`;
        let row = await datb.dbdata(db, query)
       if(row === undefined || row.cross_bow < 1) {
            let embed = new EmbedBuilder()
            .setDescription(`${config.wrong} <@${message.author.id}> you do no possess a \`Cross Bow\`!, You need a Cross Bow to use this command`)
            .setColor("Red")
            return message.channel.send({embeds: [embed]})
        }
        else {
            let chance = Math.floor(Math.random() * 100)
            
            let chances = Object.keys(minerals)
            let closest = chances.reduce((a, b) => {
                return Math.abs(b - chance) < Math.abs(a - chance) ? b : a;
            });

            closest = Number(closest)
            
            if(closest == 80) {
                let embed = new EmbedBuilder()
                .setDescription(`${config.wrong} <@${message.author.id}> You couldnt find anything to hunt!, better luck next time`)
                .setColor("Red")
                db.run(`UPDATE inventory SET cross_bow = cross_bow - 1 WHERE userid = ${message.author.id}`);
                return message.channel.send({embeds: [embed]})
            }

            let num = Math.floor(Math.random() * minerals[closest][2]) + 1
            
            let embed = new EmbedBuilder()
            .setDescription(`${config.tick} <@${message.author.id}> ${minerals[closest][1]}!! you have found **${num}** \`${minerals[closest][0]}\`! you can sell your ${minerals[closest][0]} whenever you want in the market or trade with others`)
            .setColor("Random")

            let col = minerals[closest][0]

            message.channel.send({embeds: [embed]})
            db.run(`UPDATE collected SET ${col} = ${col} + ${num} WHERE userid = ${message.author.id}`);
            db.run(`UPDATE inventory SET cross_bow = cross_bow - 1 WHERE userid = ${message.author.id}`);
        }
    }
}