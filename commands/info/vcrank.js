const { Levels } = require('../../utils/schema.js');
const canvacord = require("canvacord");
const Discord = require('discord.js')

module.exports = {
    name: 'vcrank',
    category: 'info',
    description: 'shows vc rank',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {

        let user = message.mentions.users.first() || message.author;
        let userData = await Levels.findOne({ id: user.id }) || new Levels({ id: user.id });
        const users = await Levels.find()
        const rawLeaderboard = users.sort((a, b) => b.vcXp - a.vcXp);
        const pos = rawLeaderboard.findIndex(i => i.id === user.id) + 1;

        const rank = new canvacord.Rank()
            .setAvatar(user.displayAvatarURL({ dynamic: false, format: 'png' }))
            .setFontSize('200px')
            .setCurrentXP(userData.vcXp)
            .setRequiredXP(userData.vcReqXp)
            .setLevel(userData.vclevel)
            .setRank(pos)
            .setBackground("IMAGE", "https://wallpaperset.com/w/full/f/7/a/473216.jpg")
            .setProgressBar('#FFA500', "COLOR")
            .setUsername(user.username)
            .setDiscriminator(user.discriminator)
        rank.build()
            .then(data => {
                const attachment = new Discord.AttachmentBuilder(data, 'funny.png')
                message.channel.send({
                    content: `**Chat Rankings** ${user.username}`,
                    files: [attachment] 
                    });
            })

    }
}