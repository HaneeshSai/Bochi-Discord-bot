const { EmbedBuilder } = require("discord.js");
const { User } = require('../../utils/schema.js');

module.exports = {
    name: "flag",
    description: "Guess the name of a flag!",
    category: "Games",
    params: [
        {
            name: "name",
            required: true,
            multiword: true
        }
    ],
    run: async (client, message, args) => {
        let name = args.name.toLowerCase().split(" ").join("");
        let user = message.author;
        let userData = await User.findOne({ id: user.id }) || new User({ id: user.id });
        let credits = client.flags.get(message.channel.id);
        if (!credits || credits.expire < Date.now() || credits.answered) {
                let embed = new EmbedBuilder()
                .setDescription(`<@${user.id}> there are no flags in this channel to guess at the moment. use command **.gtf** to spawn a flag.`)
                .setColor("Random")
                message.channel.send({embeds: [embed]});
                return;
            }

        if(name !== credits.name.split(" ").join("").toLowerCase()) return;

        userData.wallet += credits.wallet;
        userData.save();
        credits.answered = true;

        let embed = new EmbedBuilder()
        .setDescription(`<@${user.id}> guessed it right! It was **${credits.name}**! **${(credits.wallet).toLocaleString()}** heartz have been added to their wallet.`)
        .setColor("Random")

        message.channel.send({embeds: [embed]});

        let msg;
        try {
            msg = await message.channel.messages.fetch(credits.id);
        } catch { }

        if (msg) {
            try { await msg.delete() } catch { }
        }
    }
}