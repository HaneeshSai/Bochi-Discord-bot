const config = require('../config.json');
const { Levels } = require('../utils/schema.js');
const { EmbedBuilder } = require('discord.js');
const emotes = require("../assets/emotes.json");
const sqlite = require('sqlite3');

module.exports = async (client, oldMember, newMember) => {
    if (oldMember?.member.user.bot || newMember?.member.user.bot) return;
    let previous = client.voiceChannel.get(oldMember ? oldMember.id : newMember.id);
    const userid = oldMember.id;

    if (oldMember && oldMember.channel && !newMember.channel || !oldMember.mute && newMember.mute) {
        if (!previous) return;
        let user = await Levels.findOne({ id: oldMember.id }) || new Levels({ id: oldMember.id });
        let gain = config.vcXpadd;

        let currentLevel = user.vclevel;
        previous.time = (Date.now() - previous.started);

        let db = new sqlite.Database('./database/vcCounting.db', sqlite.OPEN_READWRITE);
        let query = `SELECT * FROM vctime WHERE userid = ?`
        db.get(query, [userid], (err, row) => {
            if (err) {
                client.log(err);
                return;
            }
            if (row === undefined) {
                let insertData = db.prepare(`INSERT INTO vctime VALUES(?,?,?,?)`);
                insertData.run(userid, previous.time, previous.time, previous.time);
                insertData.finalize();
                db.close();
                client.log('added');
                return;
            }
        });

        db.run(`UPDATE vctime SET vcday = vcday + ${previous.time}, vcweek = vcweek + ${previous.time}, vcmonth = vcmonth + ${previous.time} WHERE userid = ${userid}`);

        user.TimeSpentVc += previous.time;
        user.vcXp += Math.floor((previous.time * gain) / 30000);
        user.save();
        client.voiceChannel.delete(oldMember.id);

        if (user.vcXp > user.vcReqXp) {
            user.vclevel += 1;
            user.vcReqXp *= 2;
            let embed = new EmbedBuilder()
                .setDescription(`${emotes.levelup.congrats} <@${oldMember.id}> You VC level has leveled up, your level is now **${user.vclevel}**`)
                .setTitle(`${emotes.levelup.boost} Level Up`)
                .setColor("Random")

            let levelups = client.channels.cache.get(config.channels.levelups);
            levelups.send({ embeds: [embed] });
        }


    } else if (!oldMember.channel && newMember.channel || oldMember.mute && !newMember.mute) {
        client.voiceChannel.set(newMember.id, {
            user: newMember.id,
            started: Date.now(),
            time: null,
            channel: newMember.channelId
        });
    }

}