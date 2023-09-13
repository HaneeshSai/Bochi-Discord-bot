const { EmbedBuilder } = require("discord.js");
const { User } = require('../../utils/schema.js');
const config = require('../../config.json');

module.exports = {
    name: 'marry',
    aliases: [],
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

        userdata = await User.findOne({ id: user.id }) || new User({ id: user.id });
        
        if (!target || target.id === message.author.id || target.user.bot) {
            let embed = new EmbedBuilder()
                .setDescription(`${config.wrong} please mention a valid user you want to marry! who is not a bot nor yourself`)
                .setColor("Red");
            await message.channel.send({ embeds: [embed] });
            return;
        }

        if (userdata.married.length >= 1 ) {
            let embed = new EmbedBuilder()
            .setDescription(`${config.wrong} You are already married to\n ${userdata.married.map(e => `<@${e.id}> - <t:${Math.floor(e.time / 1000)}:R>`).join("\n")}\nPlease divorce someone to marry another person`)
            .setColor('Red');
            userdata.cooldown.marry = new Date().getTime();
            userdata.save();
            message.channel.send({embeds: [embed]});
            return;
        } 

        targetData = await User.findOne({ id: target.id }) || new User({ id: target.id });

        if(targetData.married.length >= 1) {
            let embed = new EmbedBuilder()
            .setDescription(`<@${target.id}> is already married to 
            ${targetData.married.map(e => `<@${e.id}> - <t:${Math.floor(e.time / 1000)}:R>`).join("\n")}
            they have to divorce someone to accept your marriage`)
            .setColor('Random');
            await message.channel.send({embeds: [embed]});
            return;
            
        }

        else if(userdata.married.find(e => e.id === target.id)) {
            let embed = new EmbedBuilder()
            .setDescription(`${config.wrong} You are already married to that user! you cannot marry same user twice`)
            .setColor("DarkRed");
            userdata.cooldown.marry = new Date().getTime();
            userdata.save();
            await message.channel.send({embeds: [embed]});
            return;
        }

               

        let proposeEmbed = new EmbedBuilder()
            .setTitle(':ring: Marriage Proposal')
            .setDescription(`<@${target.id}>, <@${user.id}>  has proposed you! \nDo you wish to accept their proposal?\nMessage along with the proposal: **I WANNA MARRY YOU!!**`)
            .setColor('Random');

        let acceptEmbed = new EmbedBuilder()
        .setTitle('<a:YAY:1079663245364842507> Proposal Accepted')
        .setDescription(`<@${target.id}> you have accepted <@${user.id}> marriage proposal!, you both look lovely together.<a:cute_hearts:1079663948430848062>`)
        .setColor("LuminousVividPink");

        let rejectEmbed = new EmbedBuilder()
        .setTitle('<a:sadpats:1079664796590411826> Proposal rejected')
        .setDescription(`<@${target.id}> you have rejected <@${user.id}>'s proposal`)
        .setColor('DarkButNotBlack')

        let ignoreEmbed = new EmbedBuilder()
        .setTitle("Proposal Ignored")
        .setDescription(`<@${user.id}> Your proposal has been ignored by <@${target.id}> <a:stitchsad:1080012705836056598>`)
        .setColor("Blue")


        const embedmsg = await message.channel.send({ embeds: [proposeEmbed] });
        userdata.cooldown.marry = new Date().getTime();
        userdata.save();
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
            return ['✅', '❌'].includes(reaction.emoji.name) && user.id === target.id;
        };

        embedmsg.awaitReactions({ filter, max: 1})
                .then(collected => {
                    const reaction = collected.first();
                    if (reaction.emoji.name === '✅') {
                        userdata.married.push(userObject);
                        targetData.married.push(targetObject);
                        userdata.save();
                        targetData.save();
                        embedmsg.edit({embeds: [acceptEmbed]});
                        return;
                    } else {
                        embedmsg.edit({embeds: [rejectEmbed]});
                    }
                })
    }
}