const { EmbedBuilder } = require("discord.js");
const { readdirSync } = require("fs");
const prefix = require("../../config.json").prefix;

module.exports = {
  name: "help",
  aliases: ['h'],
  description: "Shows all available bot commands.",
  run: async (client, message, args) => {


    /*    const roleColor =
          message.guild.me.displayHexColor === "#000000"
            : message.guild.me.displayHexColor;*/

    if (!args[0]) {
      let categories = [];

      readdirSync("./commands/").forEach((dir) => {
        const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
          file.endsWith(".js")
        );

        const cmds = commands.map((command) => {
          let file = require(`../../commands/${dir}/${command}`);

          if (!file.name) return "No command name.";

          let name = file.name.replace(".js", "");

          return `\`${name}\``;
        });

        let data = new Object();

        data = {
          name: dir.toUpperCase(),
          value: cmds.length === 0 ? "In progress." : cmds.join(" "),
        };

        categories.push(data);
      });

      const embed = new EmbedBuilder()
        .setTitle("📬 Need help? Here are all of my commands:")
        .addFields(categories)
        .setDescription(
          `Use \`${prefix}help\` followed by a command name to get more additional information on a command. For example: \`${prefix}help ban\`.`
        )
        .setTimestamp()
        .setColor('Red');
      return message.channel.send({ embeds: [embed] });
    } else {
      const command =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.find(
          (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
        );

      if (!command) {
        const embed = new EmbedBuilder()
          .setTitle(`Invalid command! Use \`${prefix}help\` for all of my commands!`)
          .setColor("FF0000");
        return message.channel.send({ embeds: [embed] });
      }

      const embed = new EmbedBuilder()
        .setTitle("Command Details:")
        .addFields({ name: "PREFIX:", value: `\`${prefix}\`` })
        .addFields({
          name: "COMMAND:",
          value: command.name ? `\`${command.name}\`` : "No name for this command."
        })
        .addFields({
          name: "ALIASES:",
          value: command.aliases
            ? `\`${command.aliases.join("` `")}\``
            : "No aliases for this command."
        })
        .addFields({
          name: "USAGE:",
          value: command.usage
            ? `\`${prefix}${command.name} ${command.usage}\``
            : `\`${prefix}${command.name}\``
        })
        .addFields({
          name: "DESCRIPTION:",
          value: command.description
            ? command.description
            : "No description for this command."
        })
        .setFooter({
          text: `Requested by ${message.author.tag}`,
          icon: message.author.displayAvatarURL({ dynamic: true })
    })
        .setTimestamp()
        .setColor("Random");
      return message.channel.send({ embeds: [embed] });
    }
  },
};
