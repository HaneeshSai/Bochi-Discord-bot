const config = require("../config.json");
const prefix = config.prefix;
const { User } = require("../utils/schema.js");
const { Levels } = require("../utils/schema.js");
const { EmbedBuilder } = require("discord.js");
const formatdays = require("../utils/functions.js");
const sqlite = require("sqlite3");

module.exports = async (client, message) => {
  if (message.author.bot) return;
  let userid = message.author.id;
  let uname = message.author.tag;

  //--------------------------------------------------MESSAGECOUNTINGS--------------------------------------------
  let db = new sqlite.Database(
    "./database/messageCount.db",
    sqlite.OPEN_READWRITE
  );
  let query = `SELECT * FROM data WHERE userid = ?`;
  db.get(query, [userid], (err, row) => {
    if (err) {
      console.log(err);
      return;
    }
    if (row === undefined) {
      let insertData = db.prepare(`INSERT INTO data VALUES(?,?,?,?,?,?)`);
      insertData.run(userid, uname, 1, 1, 1, 1);
      insertData.finalize();
      db.close();
      client.log("added");
      return;
    }
    db.run(
      `UPDATE data SET messageDaily = messageDaily + 1, messageWeek = messageWeek + 1, messageMonth = messageMonth + 1, messageLife = messageLife + 1 WHERE userid = ${userid}`
    );
  });

  if (message.member.roles.cache.has("1053339254861869128")) {
    console.log("staff");
    let staffquery = `SELECT * FROM staff WHERE userid = ?`;
    db.get(staffquery, [userid], (err, row) => {
      if (err) {
        console.log(err);
        return;
      }
      if (row === undefined) {
        let insertData = db.prepare(`INSERT INTO staff VALUES(?,?,?,?,?,?)`);
        insertData.run(userid, uname, 1, 1, 1, 1);
        insertData.finalize();
        db.close();
        client.log("added");
        return;
      }
      db.run(
        `UPDATE staff SET daily = daily + 1, weekly = weekly + 1, monthly = monthly + 1, life = life + 1 WHERE userid = ${userid}`
      );
    });
  }

  //------------------------------------------ LEVEL UPS----------------------------------------------------

  let user = message.author;
  let userData =
    (await Levels.findOne({ id: user.id })) || new Levels({ id: user.id });
  let userdata =
    (await User.findOne({ id: user.id })) || new User({ id: user.id });
  if (userData.xp > userData.reqXp) {
    client.log(`${user.tag} has leveled up to ${userData.level + 1}`);
    let embed = new EmbedBuilder()
      .setTitle("LEVEL UP")
      .setDescription(
        `<@${user.id}> has leveled up to **${userData.level + 1}**`
      )
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() });
    message.channel.send({ embeds: [embed] });
    userData.level += 1;
    userData.reqXp = (userData.level + 1) ** 2 * 100;
  }

  //--------------------------------------------XP ADDING ----------------------------------------------------

  let xpToBeAdded;

  let inv = new sqlite.Database("./database/shop.db", sqlite.OPEN_READWRITE);
  let q = `SELECT * FROM inventory WHERE userid = ${message.author.id}`;
  let row = await formatdays.dbdata(inv, q);
  if (row != undefined && Date.now() < row.xp_booster) {
    xpToBeAdded = 2 * config.xpAdding;
  } else xpToBeAdded = config.xpAdding;

  userData.xp += xpToBeAdded;
  userData.save();

  //-------------------------------------------MAIN----------------------------------------------
  if (!message.content.startsWith(prefix)) return;
  if (!message.guild) return;

  if (!message.member)
    message.member = await message.guild.fetchMember(message);
  let args = message.content
    .slice(message.content.match(prefix)[0].length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;
  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (!command) return;

  if (
    command.permission &&
    command.permission === "helper" &&
    !message.member.roles.cache.has(config.helper)
  ) {
    let embed = new EmbedBuilder()
      .setDescription(
        `${config.wrong} <@${message.author.id}> you do not have the perms to use this command!`
      )
      .setColor("Red");

    message.channel.send({ embeds: [embed] });
    return;
  }

  if (
    command.permission &&
    command.permission === "owner" &&
    !message.member.roles.cache.has(config.ownerrole)
  ) {
    let embed = new EmbedBuilder()
      .setDescription(
        `${config.wrong} <@${message.author.id}> you do not have the perms to use this command!`
      )
      .setColor("Red");

    message.channel.send({ embeds: [embed] });
    return;
  }

  let time = new Date().getTime();
  const cool = Math.floor(time - userdata.cooldown[command.name]);
  let remtime = command.cooldown - cool;

  if (cool < command.cooldown) {
    let embed = new EmbedBuilder().setDescription(
      `<@${user.id}> ${
        config.wrong
      } you cannot use this command, wait for **${formatdays.formatDays(
        remtime
      )}**`
    );
    message.channel.send({ embeds: [embed] });
    return;
  }

  let argsObj = {};
  if (command.params) {
    for (let l in command.params) {
      if (command.params[l].multiword) {
        if (typeof args[l] === "object") args[l] = args.slice(l);
        else args[l] = args.slice(l).join(" ");
        args = args.slice(0, l + 1);
      }
    }

    for (let i in command.params) {
      if (
        (command.params[i].required && !args[i]) ||
        (command.params[i].options &&
          args[i] &&
          !command.params[i].options.includes(args[i].toLowerCase()))
      ) {
        let embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `${config.wrong} <@${user.id}> please use the command properly`
          );

        message.channel.send({ embeds: [embed] });
        return;
      } else {
        argsObj[command.params[i].name] = args[i];
        if (message.mentions.members) {
          message.mentions.members.map((member) =>
            message.mentions.members.has(argsObj[command.params[i].name])
              ? (argsObj[command.params[i].name] = member)
              : argsObj[command.params[i].name]
          );
        }
        if (message.mentions.channels) {
          message.mentions.channels.map((channel) =>
            message.mentions.channels.has(argsObj[command.params[i].name])
              ? (argsObj[command.params[i].name] = channel)
              : argsObj[command.params[i].name]
          );
        }
      }
    }
  } else argsObj = args;

  if (command) command.run(client, message, argsObj);
};
