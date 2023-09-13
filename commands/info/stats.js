const { EmbedBuilder } = require("discord.js");
const { Levels } = require('../../utils/schema.js');
const config = require('../../config.json');
const sqlite = require('sqlite3');
const emotes = require('../../assets/emotes.json');
const formatdays = require('../../utils/functions.js');

module.exports = {
    name: 'stats',
    aliases: ["stat"],
    category: 'info',
    description: 'shows the number of messages sent and time spent in vc',
    params: [
        {
            name: "choice"
        }
    ],

    run: async (client, message, {choice}) => {
        var messages;
        var time;
        let user = message.mentions.members.first() || message.author;
        const userData = await Levels.findOne({ id: user.id }) || new Levels({ id: user.id });

        

        let db = new sqlite.Database('./database/messageCount.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
        let query = `SELECT * FROM data WHERE userid = ${user.id}`;
        db.all(query, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                if(choice === 'daily' || choice === 'day') messages = row.messageDaily;
                else if(choice === 'weekly' || choice === 'week') messages = row.messageWeek;
                else if(choice === 'monthly' || choice === 'month') messages = row.messageMonth;
                else if (!choice || choice === 'life' || choice === 'lifetime') messages = row.messageLife
            });

            let vdb = new sqlite.Database('./database/vcCounting.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
            let vquery = `SELECT * FROM vctime WHERE userid = ${user.id}`;
            vdb.all(vquery, [], (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    if(choice === 'daily' || choice === 'day') time = row.vcday;
                    else if(choice === 'weekly' || choice === 'week') time = row.vcweek;
                    else if(choice === 'monthly' || choice === 'month') time = row.vcmonth;
                    else if (!choice || choice === 'life' || choice === 'lifetime') time = userData.TimeSpentVc
                });

                let embed = new EmbedBuilder()
            .setTitle(`${emotes.stats.diamond} STATS ${emotes.stats.diamond}`)
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL()})
            .setDescription(`${emotes.stats.blueheart} You have sent **${messages}** messages in text channels\n\n${emotes.stats.pinghearts} You have spent **${formatdays.formatDays(time)}** in voice channels`)
            .setColor("Random")
            .setThumbnail(message.guild.iconURL({dynamic: true}))
            .setTimestamp()

            message.channel.send({embeds: [embed]})
            })

        })
    }
}