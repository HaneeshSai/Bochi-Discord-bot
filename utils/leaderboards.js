const config = require('../config.json');
const sqlite = require('sqlite3');
const { EmbedBuilder } = require('discord.js');
const emotes = require('../assets/emotes.json');
const { Levels } = require('../utils/schema.js');
const { User } = require('../utils/schema.js');
const { formatDays } = require('./functions');


async function chatlb(a, b, c, d, e, f, g) {
    let db = new sqlite.Database('./database/messageCount.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
    let dayuserids = [];
    let weekuserids = [];
    let monthuserids = [];
    let lifeuserids = [];

    var dailystr = "";
    var weeklystr = "";
    var monthstr = "";
    var lifestr = "";
    let dailyquery = `SELECT * FROM data ORDER BY messageDaily DESC LIMIT 10`;
    let weekquery = `SELECT * FROM data ORDER BY messageWeek DESC LIMIT 10`;
    let monthquery = `SELECT * FROM data ORDER BY messageMonth DESC LIMIT 10`;
    let lifequery = `SELECT * FROM data ORDER BY messageLife DESC LIMIT 10`;

    db.all(dailyquery, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            dayuserids.push(row);
        });

        let firstpos = dayuserids.shift()

        dayuserids.forEach((user, i) => {
            dailystr += `${emotes.numbers[i]} <@${user.userid}> ${emotes.arrow} **${user.messageDaily.toLocaleString()}** messages\n`;
        });

        let Dailyembed = new EmbedBuilder()
            .setTitle('Chat LeaderBoard [Daily]')
            .setDescription(`${emotes.crown} **Most Active User** <@${firstpos.userid}> ${emotes.arrow} **${firstpos.messageDaily.toLocaleString()}**\n\n${dailystr}\n<a:coolpikachu:1055529931687333968> Gain **messages** by chatting\n\n<a:bheart:1084363244409454684> Resets in **${formatDays(e)}**`)
            .setImage(config.lbline)
            .setColor("Random")
            .setFooter({ text: `${config.guildName} | LeaderBoard` });

            a.edit({content: "", embeds: [Dailyembed]})
    });

    db.all(weekquery, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            weekuserids.push(row);
        });

        let firstpos = weekuserids.shift()

        weekuserids.forEach((user, i) => {
            weeklystr += `${emotes.numbers[i]} <@${user.userid}> ${emotes.arrow} **${user.messageWeek.toLocaleString()}** messages\n`;
        });

        let weeklyembed = new EmbedBuilder()
            .setTitle('Chat LeaderBoard [Weekly]')
            .setDescription(`${emotes.crown} **Most Active User** <@${firstpos.userid}> ${emotes.arrow} **${firstpos.messageWeek.toLocaleString()}**\n\n${weeklystr}\n<a:coolpikachu:1055529931687333968> Gain **messages** by chatting\n\n<a:bheart:1084363244409454684> Resets in **${formatDays(f)}**`)
            .setImage(config.lbline)
            .setColor("Random")
            .setFooter({ text: `${config.guildName} | LeaderBoard` });

            b.edit({content: "", embeds: [weeklyembed]})
    });

    db.all(monthquery, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            monthuserids.push(row);
        });

        let firstpos = monthuserids.shift()

        monthuserids.forEach((user, i) => {
            monthstr += `${emotes.numbers[i]} <@${user.userid}> ${emotes.arrow} **${user.messageMonth.toLocaleString()}** messages\n`;
        });

        let monthlyembed = new EmbedBuilder()
            .setTitle('Chat LeaderBoard [Monthly]')
            .setDescription(`${emotes.crown} **Most Active User** <@${firstpos.userid}> ${emotes.arrow} **${firstpos.messageMonth.toLocaleString()}**\n\n${monthstr}\n<a:coolpikachu:1055529931687333968> Gain **messages** by chatting\n\n<a:bheart:1084363244409454684> Resets in **${formatDays(g)}**`)
            .setImage(config.lbline)
            .setColor("Random")
            .setFooter({ text: `${config.guildName} | LeaderBoard` });

            c.edit({content: "",embeds: [monthlyembed]})
    });

    db.all(lifequery, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            lifeuserids.push(row);
        });

        let firstpos = lifeuserids.shift()

        lifeuserids.forEach((user, i) => {
            lifestr += `${emotes.numbers[i]} <@${user.userid}> ${emotes.arrow} **${user.messageLife.toLocaleString()}** messages\n`;
        });

        let lifeembed = new EmbedBuilder()
        .setTitle('Chat LeaderBoard [LifeTime]')
        .setDescription(`${emotes.crown} **Most Active User** <@${firstpos.userid}> ${emotes.arrow} **${firstpos.messageLife.toLocaleString()}**\n\n${lifestr}\n<a:coolpikachu:1055529931687333968> Gain **messages** by chatting`)
        .setImage(config.lbline)
        .setColor("Random")
        .setFooter({ text: `${config.guildName} | LeaderBoard` });

        d.edit({content: "",embeds: [lifeembed]})
    });

}

async function vclb(a, b, c, d, e, f, g) {

    let vdb = new sqlite.Database('./database/vcCounting.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
    let dayuserids = [];
    let weekuserids = [];
    let monthuserids = [];

    var vcdailystr = "";
    var vcweeklystr = "";
    var vcmonthstr = "";
    let dailyquery = `SELECT * FROM vctime ORDER BY vcday DESC LIMIT 10`;
    let weekquery = `SELECT * FROM vctime ORDER BY vcweek DESC LIMIT 10`;
    let monthquery = `SELECT * FROM vctime ORDER BY vcmonth DESC LIMIT 10`;

    vdb.all(dailyquery, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            dayuserids.push(row);
        });

        let firstpos = dayuserids.shift()

        dayuserids.forEach((user, i) => {
            vcdailystr += `${emotes.numbers[i]} <@${user.userid}> ${emotes.arrow} **${formatDays(user.vcday)}** \n`;
        });

        let vcday = new EmbedBuilder()
            .setTitle('Voice LeaderBoard [Daily]')
            .setDescription(`${emotes.crown} **Most Active User** <@${firstpos.userid}> ${emotes.arrow} **${formatDays(Number(firstpos.vcday))}**\n\n${vcdailystr}\n\n<a:bheart:1084363244409454684> Resets in **${formatDays(e)}**`)
            .setImage(config.lbline)
            .setColor("Random")
            .setFooter({ text: `${config.guildName} | LeaderBoard` });

            a.edit({content: "", embeds: [vcday]})
    });

    vdb.all(weekquery, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            weekuserids.push(row);
        });

        let firstpos = weekuserids.shift()

        weekuserids.forEach((user, i) => {
            vcweeklystr += `${emotes.numbers[i]} <@${user.userid}> ${emotes.arrow} **${formatDays(user.vcweek)}** \n`;
        });

        let vcweek = new EmbedBuilder()
            .setTitle('Voice LeaderBoard [Week]')
            .setDescription(`${emotes.crown} **Most Active User** <@${firstpos.userid}> ${emotes.arrow} **${formatDays(Number(firstpos.vcweek))}**\n\n${vcweeklystr}\n\n<a:bheart:1084363244409454684> Resets in **${formatDays(f)}**`)
            .setImage(config.lbline)
            .setColor("Random")
            .setFooter({ text: `${config.guildName} | LeaderBoard` });

            b.edit({content: "", embeds: [vcweek]})
    });

    vdb.all(monthquery, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            monthuserids.push(row);
        });

        let firstpos = monthuserids.shift()

        monthuserids.forEach((user, i) => {
            vcmonthstr += `${emotes.numbers[i]} <@${user.userid}> ${emotes.arrow} **${formatDays(user.vcmonth)}** \n`;
        });

        let vcmonth = new EmbedBuilder()
            .setTitle('Voice LeaderBoard [Month]')
            .setDescription(`${emotes.crown} **Most Active User** <@${firstpos.userid}> ${emotes.arrow} **${formatDays(Number(firstpos.vcmonth))}**\n\n${vcmonthstr}\n\n<a:bheart:1084363244409454684> Resets in **${formatDays(g)}**`)
            .setImage(config.lbline)
            .setColor("Random")
            .setFooter({ text: `${config.guildName} | LeaderBoard` });

            c.edit({content: "", embeds: [vcmonth]})
    });

    const users = await Levels.find()

        //sorting the users
        const sortedUsers = users.sort((a,b) => {
            return (b.TimeSpentVc) - (a.TimeSpentVc)
        }).slice(0, 10)

        let firstpos = sortedUsers.shift()

        lbstr = sortedUsers.map((user, i) => {
            return `${emotes.numbers[i]} <@${user.id}> ${emotes.arrow} **${formatDays(user.TimeSpentVc)}**`
        }).join("\n")

        let vclife = new EmbedBuilder()
            .setTitle('Voice LeaderBoard [Lifetime]')
            .setDescription(`${emotes.crown} **Most Active User** <@${firstpos.id}> ${emotes.arrow} **${formatDays(Number(firstpos.TimeSpentVc))}**\n\n${lbstr}`)
            .setImage(config.lbline)
            .setColor("Random")
            .setFooter({ text: `${config.guildName} | LeaderBoard` });

            d.edit({content: "", embeds: [vclife]})

}

async function eclb(a) {
    let users = await User.find()

        //sorting the users
        const sortedUsers = users.sort((a,b) => {
            return (b.wallet + b.bank) - (a.wallet + a.bank)
        }).slice(0, 10)
        
        let firstpos = sortedUsers.shift()

        lbstr = sortedUsers.map((user, i) => {
            return `${emotes.numbers[i]} <@${user.id}> ${emotes.arrow} **${(user.wallet + user.bank).toLocaleString()}**`
        }).join("\n")

        let embed = new EmbedBuilder()
        .setTitle('Economy LeaderBoard')
        .setDescription(`${emotes.crown} Most Richest user <@${firstpos.id}> ${emotes.arrow} **${(firstpos.wallet + firstpos.bank).toLocaleString()}**\n\n${lbstr}\n\n${emotes.heart} gain more cash by \`.work\`\n${emotes.heart} gain more cash by \`.daily\`\n${emotes.heart} gain more cash by \`.beg\`\n${emotes.heart} gain more cash by \`.steal\``)
        .setImage(config.lbline)
        .setFooter({ text: `${config.guildName} | LeaderBoard` })
        .setColor("Random")

        a.edit({contents: "",embeds: [embed]});
}

async function stafflb(a, b, c, d, e, f, g) {
    let db = new sqlite.Database('./database/messageCount.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
    let dayuserids = [];
    let weekuserids = [];
    let monthuserids = [];
    let lifeuserids = [];

    var dailystr = "";
    var weeklystr = "";
    var monthstr = "";
    var lifestr = "";
    let dailyquery = `SELECT * FROM staff ORDER BY daily DESC LIMIT 10`;
    let weekquery = `SELECT * FROM staff ORDER BY weekly DESC LIMIT 10`;
    let monthquery = `SELECT * FROM staff ORDER BY monthly DESC LIMIT 10`;
    let lifequery = `SELECT * FROM staff ORDER BY life DESC LIMIT 10`;

    db.all(dailyquery, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            dayuserids.push(row);
        });

        let firstpos = dayuserids.shift()

        dayuserids.forEach((user, i) => {
            dailystr += `${emotes.numbers[i]} <@${user.userid}> ${emotes.arrow} **${user.daily.toLocaleString()}** messages\n`;
        });

        let Dailyembed = new EmbedBuilder()
            .setTitle('Chat LeaderBoard [Daily]')
            .setDescription(`${emotes.crown} **Most Active User** <@${firstpos.userid}> ${emotes.arrow} **${firstpos.daily.toLocaleString()}**\n\n${dailystr}\n<a:coolpikachu:1055529931687333968> Gain **messages** by chatting\n\n<a:bheart:1084363244409454684> Resets in **${formatDays(e)}**`)
            .setImage(config.lbline)
            .setColor("Random")
            .setFooter({ text: `${config.guildName} | LeaderBoard` });

            a.edit({content: "", embeds: [Dailyembed]})
    });

    db.all(weekquery, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            weekuserids.push(row);
        });

        let firstpos = weekuserids.shift()

        weekuserids.forEach((user, i) => {
            weeklystr += `${emotes.numbers[i]} <@${user.userid}> ${emotes.arrow} **${user.weekly.toLocaleString()}** messages\n`;
        });

        let weeklyembed = new EmbedBuilder()
            .setTitle('Chat LeaderBoard [Weekly]')
            .setDescription(`${emotes.crown} **Most Active User** <@${firstpos.userid}> ${emotes.arrow} **${firstpos.weekly.toLocaleString()}**\n\n${weeklystr}\n<a:coolpikachu:1055529931687333968> Gain **messages** by chatting\n\n<a:bheart:1084363244409454684> Resets in **${formatDays(f)}**`)
            .setImage(config.lbline)
            .setColor("Random")
            .setFooter({ text: `${config.guildName} | LeaderBoard` });

            b.edit({content: "", embeds: [weeklyembed]})
    });

    db.all(monthquery, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            monthuserids.push(row);
        });

        let firstpos = monthuserids.shift()

        monthuserids.forEach((user, i) => {
            monthstr += `${emotes.numbers[i]} <@${user.userid}> ${emotes.arrow} **${user.monthly.toLocaleString()}** messages\n`;
        });

        let monthlyembed = new EmbedBuilder()
            .setTitle('Chat LeaderBoard [Monthly]')
            .setDescription(`${emotes.crown} **Most Active User** <@${firstpos.userid}> ${emotes.arrow} **${firstpos.monthly.toLocaleString()}**\n\n${monthstr}\n<a:coolpikachu:1055529931687333968> Gain **messages** by chatting\n\n<a:bheart:1084363244409454684> Resets in **${formatDays(g)}**`)
            .setImage(config.lbline)
            .setColor("Random")
            .setFooter({ text: `${config.guildName} | LeaderBoard` });

            c.edit({content: "",embeds: [monthlyembed]})
    });

    db.all(lifequery, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            lifeuserids.push(row);
        });

        let firstpos = lifeuserids.shift()

        lifeuserids.forEach((user, i) => {
            lifestr += `${emotes.numbers[i]} <@${user.userid}> ${emotes.arrow} **${user.life.toLocaleString()}** messages\n`;
        });

        let lifeembed = new EmbedBuilder()
        .setTitle('Chat LeaderBoard [LifeTime]')
        .setDescription(`${emotes.crown} **Most Active User** <@${firstpos.userid}> ${emotes.arrow} **${firstpos.life.toLocaleString()}**\n\n${lifestr}\n<a:coolpikachu:1055529931687333968> Gain **messages** by chatting`)
        .setImage(config.lbline)
        .setColor("Random")
        .setFooter({ text: `${config.guildName} | LeaderBoard` });

        d.edit({content: "",embeds: [lifeembed]})
    });

}

module.exports = { chatlb, vclb, eclb, stafflb };
