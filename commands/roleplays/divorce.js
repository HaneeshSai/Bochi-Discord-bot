const { EmbedBuilder } = require("discord.js");
const { User } = require('../../utils/schema.js');
const config = require('../../config.json');

module.exports = {
    name: 'divorce',
    aliases: ['div', 'ditch'],
    cooldown: 60000,
    category: 'fun',
    description: 'marries a user',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {
        user = message.author;
        target = message.mentions.members.first();

        let userdata = await User.findOne({ id: user.id }) || new User({ id: user.id });

        if (!target || target.id === message.author.id || target.user.bot) {
            let embed = new EmbedBuilder()
                .setDescription(`${config.wrong} <@${user.id}> please mention a valid user who is not a bot or yourself`)
                .setColor("Red");
            await message.channel.send({ embeds: [embed] });
            return;
        }

        let targetData = await User.findOne({ id: target.id }) || new User({ id: target.id });

        if (!userdata.married.find(e => e.id === target.id)) {
            let embed = new EmbedBuilder()
                .setDescription(`${config.wrong} you are not married to that user you cannot divorce someone who havent married yet`)
                .setColor("Red");
            await message.channel.send({ embeds: [embed] });
            return;
        }

        let divorceEmbed = new EmbedBuilder()
            .setTitle('Divorce')
            .setDescription(`<@${user.id}> do you really want to divorce <@${target.id}> `)
            .setColor("Random");

        let accept = new EmbedBuilder()
            .setTitle("Divorced")
            .setDescription(`<@${user.id}> you have succesfully divorced <@${target.id}> :sneezing_face:`)
            .setColor("Random")

        let reject = new EmbedBuilder()
            .setTitle('Divorce')
            .setDescription(`<@${user.id}> Guess you've changed your mind to divorce <@${target.id}>`)
            .setColor("Random")

        let embedmsg = await message.channel.send({ embeds: [divorceEmbed] });

        await embedmsg.react('✅');
        await embedmsg.react('❌');

        let userObject = {
            id: target.id,
            time: Date.now()
        }

        let targetObject = {
            id: user.id,
            time: Date.now()
        }

        const filter = (reaction, user) => {
            return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        embedmsg.awaitReactions({ filter, max: 1 })
            .then(collected => {
                const reaction = collected.first();
                if (reaction.emoji.name === '✅') {
                    userdata.married.pop(userObject);
                    targetData.married.pop(targetObject);
                    userdata.save();
                    targetData.save();
                    embedmsg.edit({ embeds: [accept] });
                    return;
                } else {
                    embedmsg.edit({ embeds: [reject] });
                }
            })
    }
}