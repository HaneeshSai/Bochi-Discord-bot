const config = require("../config.json");
const prefix = config.prefix;
const sqlite = require("sqlite3");
const fs = require("fs");
const { EmbedBuilder } = require("discord.js");
const lbs = require("../utils/leaderboards.js");
const dbs = require("../utils/functions.js");
const { User } = require("../utils/schema.js");

module.exports = async (client) => {
  client.user.setActivity(`${prefix}help`);
  client.log(`${client.user.username} is now active prefix is ${prefix}`);

  //----------------------------------------------DATABASE CREATINGS-------------------------------------------

  let db = new sqlite.Database(
    "./database/messageCount.db",
    sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS data(userid TEXT NOT NULL, username TEXT NOT NULL,messageDaily INTEGER NOT NULL, messageWeek INTEGER NOT NULL, messageLife INTEGER NOT NULL, messageMonth INTEGER NOT NULL)`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS staff(userid TEXT NOT NULL, username TEXT NOT NULL, daily INTEGER NOT NULL, weekly INTEGER NOT NULL, monthly INTEGER NOT NULL, life INTEGER NOT NULL)`
  );

  let vdb = new sqlite.Database(
    "./database/vcCounting.db",
    sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE
  );
  vdb.run(
    `CREATE TABLE IF NOT EXISTS vctime(userid TEXT NOT NULL, vcday BIGINT NOT NULL, vcweek BIGINT NOT NULL, vcmonth BIGINT NOT NULL)`
  );

  let shopdb = new sqlite.Database(
    "./database/shop.db",
    sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE
  );
  shopdb.run(
    `CREATE TABLE IF NOT EXISTS inventory(userid VARCHAR(20), cash_booster BIGINT, xp_booster BIGINT, anti_steal BIGINT, shovel BIGINT, cross_bow BIGINT, fishing_rod BIGINT)`
  );
  shopdb.run(
    `CREATE TABLE IF NOT EXISTS collected(userid VARCHAR(20), gold INTEGER, silver INTEGER, coal INTEGER, diamond INTEGER, iron INTEGER, tuna INTEGER, salmon INTEGER, crab INTEGER, ghol INTEGER, rabbit INTEGER, boar INTEGER, squirrel INTEGER, deer INTEGER)`
  );

  let clientJson = JSON.parse(fs.readFileSync("./database/client.json"));

  //-------------------------------------MESSAGE COUNT RESETTER-----------------------------------

  setInterval(function () {
    const month = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const week = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const day = Date.now() + 1 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    client.log(`checking now`);
    if (now > clientJson.day) {
      db.run(`UPDATE data SET messageDaily = 0 WHERE userid NOT NULL`);
      vdb.run(`UPDATE vctime SET vcday = 0 WHERE userid NOT NULL`);
      clientJson.day = day;
      fs.writeFileSync("./database/client.json", JSON.stringify(clientJson));
      client.log("been a day, daily message counter resetting");
    }
    if (now > clientJson.week) {
      db.run(`UPDATE data SET messageWeek = 0 WHERE userid NOT NULL`);
      vdb.run(`UPDATE vctime SET vcweek = 0 WHERE userid NOT NULL`);
      clientJson.week = week;
      fs.writeFileSync("./database/client.json", JSON.stringify(clientJson));
      client.log("been a week, weekly message counter resetting");
    }
    if (now > clientJson.month) {
      db.run(`UPDATE data SET messageMonth = 0 WHERE userid NOT NULL`);
      vdb.run(`UPDATE vctime SET vcmonth = 0 WHERE userid NOT NULL`);
      clientJson.month = month;
      fs.writeFileSync("./database/client.json", JSON.stringify(clientJson));
      console.log("been a month, monthly message counter resetting");
    }
  }, 3600000);

  //----------------------leaderboards----------------------------

  //get the channel
  let msglbChannel = client.channels.cache.get(config.channels.chatlb);
  await msglbChannel.bulkDelete(10);
  let vclbChannel = client.channels.cache.get(config.channels.vclb);
  await vclbChannel.bulkDelete(10);
  let eclbchannel = client.channels.cache.get(config.channels.economylb);
  await eclbchannel.bulkDelete(5);

  let daily = await msglbChannel.send({ content: "-", embeds: [] });
  let weekly = await msglbChannel.send({ content: "-", embeds: [] });
  let monthly = await msglbChannel.send({ content: "-", embeds: [] });
  let lifetim = await msglbChannel.send({ content: "-", embeds: [] });

  let vcdaily = await vclbChannel.send({ content: "-", embeds: [] });
  let vcweekly = await vclbChannel.send({ content: "-", embeds: [] });
  let vcmonthly = await vclbChannel.send({ content: "-", embeds: [] });
  let vclifetim = await vclbChannel.send({ content: "-", embeds: [] });

  let ecembed = await eclbchannel.send({ content: ",", embeds: [] });

  //delete messages in channel and send new ones every 15 minutes
  setInterval(async function dlb() {
    let Dayremtime = clientJson.day - Date.now();
    let weekRemtime = clientJson.week - Date.now();
    let monthRemtime = clientJson.month - Date.now();

    client.log("leaderboard updating");
    lbs.chatlb(
      lifetim,
      monthly,
      weekly,
      daily,
      Dayremtime,
      weekRemtime,
      monthRemtime
    );
    lbs.vclb(
      vclifetim,
      vcmonthly,
      vcweekly,
      vcdaily,
      Dayremtime,
      weekRemtime,
      monthRemtime
    );
    lbs.eclb(ecembed);
  }, 300000);

  //---------------------------------INVENTORY MANAGEMNET---------------
};
