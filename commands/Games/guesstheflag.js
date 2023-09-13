const { EmbedBuilder } = require('@discordjs/builders');
const Flags = require('../../assets/flags.json');

module.exports = {
    name: "guessflag",
    description: "Create a guess teh flag game in chat",
    aliases: ["gtf", "flagguess"],
    category: "Games",
    
    run: async (client, message, args) => {
        let user = message.author;
        let already = client.flags.get(message.channel.id);
        if (already && already.expire > Date.now() && !already.answered) {
            let embed = new EmbedBuilder()
                .setDescription(`<@${user.id}> A flag which has not expired yet is still in the chat! please wait for it to expire or answer it correctly. (Flags expire after 2 minuutes)`)
                .setColor("Red")

            message.channel.send({ embeds: [embed] })
            return;
        }

        // if (already && (already?.date + 1000 * 60 * 2) > Date.now()) return message.channel.send({
        //     embeds: [client.utils.generateEmbed({
        //         color: "RED",
        //         description: `${message.author} <:imp:970009909921992704> There is a cooldown of 2 minutes before you can use this command in the channel again. Time remaining before you can use it again: **${client.utils.formatDays((already.date + 1000 * 60 * 2) - Date.now())}**`
        //     })]
        // });

        let allFlags = Object.entries(Flags);
        let flag = allFlags[Math.floor(Math.random() * allFlags.length)];
        let name = flag[0];
        let link = flag[1];
        let reward = Math.floor(Math.random() * 40) + 10;

        let embed = new EmbedBuilder()
        .setTitle('Guess The Flag')
        .setDescription(`Guess the name of the flag! To guess a name, typ \`.flag name\` .\nExample: **.flat uniter states**\nReward: **${reward}** leafz`)
        .setImage(link)

        let msg = await message.channel.send({ embeds: [embed] });

        client.flags.set(message.channel.id, {
            wallet: reward,
            expire: Date.now() + (1000 * 60 * 2),
            date: Date.now(),
            id: msg.id,
            name: name,
            answered: false
        })
    }
}