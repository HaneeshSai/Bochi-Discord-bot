const { EmbedBuilder } = require('discord.js');
const { User } = require('../../utils/schema.js');
const sqlite = require('sqlite3');
const functions = require('../../utils/functions.js')
const config = require('../../config.json');

module.exports = {
    name: 'steal',
    aliases: ['rob'],
    category: 'Currency',
    cooldown: 15 * 6000,
    description: 'rob cash from another user',

    run: async (client, message, args) => {

        let user = message.author;
        let mentioned = message.mentions.members.first();
        let inv = new sqlite.Database('./database/shop.db', sqlite.OPEN_READWRITE);
        let q = `SELECT * FROM inventory WHERE userid = ${mentioned.id}`;
        let row = await functions.dbdata(inv, q);
        
        if(row != undefined && Date.now() < row.cash_booster){
            let embed = new EmbedBuilder()
            .setDescription(`${config.wrong} <@${user.id}> You cannot steal <@${mentioned.id}> since they got \`Anti Steal\`!`)
            .setColor("Red")

            return message.channel.send({embeds: [embed]});
        }
        
        const userData = await User.findOne({ id: user.id }) || new User({ id: user.id }); 
        const mentionedData = await User.findOne({ id: mentioned.id}) || new User({ id: mentioned.id });
        let winamount = Math.floor(Math.random() * mentionedData.wallet / 2) + 50;
        let loseamount = Math.floor(Math.random() * userData.wallet / 2);
        let chance = Math.floor(Math.random() * 100) + 1;

        let time = new Date().getTime()

        if(!mentioned) {
            let embed = new EmbedBuilder()
            .setDescription(`<@${user.id}> ${config.wrong} please mention a user you wish to give your cash`)
            .setColor("Red");

            message.channel.send({embeds: [embed]});
            return;
        }

        if(mentionedData.wallet < 50) {
            let embed = new EmbedBuilder()
            .setDescription(`<@${mentioned.id}> must have atleast **50** cash in their wallet`)
            .setColor("Red")
            message.channel.send({embeds: [embed]});
            return;
        }

        if(chance > 50) {
            let embed = new EmbedBuilder()
        .setDescription(`<@${user.id}> ${config.tick} you have stolen **${winamount.toLocaleString()}** cash from <@${mentioned.id}>`)
        .setColor("Random")

        userData.wallet += Number(winamount);
        userData.cooldown.steal = time;
        userData.save();
        mentionedData.wallet -= Number(winamount);
        mentionedData.save();
        
        message.channel.send({embeds: [embed]});
        }

        if(chance <= 50) {
            let embed = new EmbedBuilder()
        .setDescription(`<@${user.id}> ${config.wrong} you were caught for stealing and had to pay **${loseamount.toLocaleString()}** cash to <@${mentioned.id}>`)
        .setColor("Random")

        userData.bank -= Number(loseamount);
        userData.cooldown.steal = time;
        userData.save();
        mentionedData.wallet += Number(loseamount);
        mentionedData.save();
        
        message.channel.send({embeds: [embed]});
        }
    }

}
