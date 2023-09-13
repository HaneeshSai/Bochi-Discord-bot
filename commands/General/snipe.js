const { EmbedBuilder } = require("discord.js");
const { moment } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'snipe',
    description: "View the last deleted message from the channel",
    Permission: "helper",
    category: "Information",
    cooldown: 1,

    run: async (client, message, args) => {
        let channel = message.channel;
        let data = client.snipe.get(channel.id);
        let user = message.author;

        if(!data) {
            let embed = new EmbedBuilder()
            .setDescription(`${config.wrong} there are no recent deleted messages`)
            .setColor('Red')
            message.channel.send({embeds: [embed]});
            return;
        }
        let image = data.attachments.first() ? data.attachments.first().url : null;

        let embed = new EmbedBuilder()
        .setAuthor({ name: data.author.tag, iconURL: data.author.displayAvatarURL()})
        .setDescription(data.content)
        .setImage(image)
        .setColor("Random");
        await message.channel.send({embeds: [embed]})
    }
}