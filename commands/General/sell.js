const { EmbedBuilder } = require('discord.js');
const sqlite = require('sqlite3');
const shop = require('../../assets/shop.json');
const config = require('../../config.json');
const { User } = require('../../utils/schema.js');
const datab = require('./../../utils/functions.js')
const tools = ['fishing_rod', 'shovel', '']

module.exports = {
    name: 'sell',
    category: 'General',
    aliases: [''],
    description: 'shows the shop menu',
    params: [
        {
            name: "amount",
            required: true,
        },
        {
            name: "item",
            required: true,
            multiword: true
        }
    ],
    run: async (client, message, { amount, item }) => {
        let db = new sqlite.Database('./database/shop.db', sqlite.OPEN_READWRITE);
        const user = await User.findOne({ id: message.author.id }) || new User({ id: message.author.id })

        let itemname = item.split(" ").join("").toLowerCase();
        let items = []
        let ids = []
        let prices = []

        shop.sellable.forEach(e => {
            items.push((e.name).split("_").join("").toLowerCase())
            ids.push(e.id)
            prices.push(e.price)
        })


        let num = Number(amount);
        
        let id;
        let price;
        if (items.includes(itemname)) {
            id = items.indexOf(itemname)
            itemid = ids[id]
            price = Number(prices[id])
        }

        let expcol = item.split(" ").join("_")

        if (items.includes(itemname)) {
            let q = `SELECT ${expcol} FROM collected WHERE userid = ${message.author.id}`
            let row = await datab.dbdata(db, q);
            if (row === undefined) {
                let embed = new EmbedBuilder()
                    .setDescription(`${config.wrong} <@${message.author.id}> You do not have an inventory! please create an inventory first by using the command  \`.inventory\``)
                    .setColor('Red');
                message.channel.send({ embeds: [embed] })
                return;
            }
            else {
                if (row[expcol] == 0) {
                    let embed = new EmbedBuilder()
                        .setDescription(`${config.wrong} <@${message.author.id}> you do not possess a \`${item}\` in your inventory, you cannot sell something which you do not possess`)
                        .setColor('Random')

                    message.channel.send({ embeds: [embed] });
                    return;
                } 
                if(row[expcol] < num) {
                    let embed = new EmbedBuilder()
                    .setDescription(`${config.wrong} <@${message.author.id}> You cannot sell **${num}** number of \`${item}\`! Since you only have **${row[expcol]}** number of \`${item}\``)
                    .setColor("Red")

                    message.channel.send({embeds: [embed]})
                }
                
                else {
                    let comirmembed = new EmbedBuilder()
                        .setDescription(`<@${message.author.id}> do you really wish to sell **${num}** \`${item}\` for \`${num * price}\`!, you only have \`${row[expcol]}\` left on total`)
                        .setColor('Red')
                    let msg = await message.channel.send({ embeds: [comirmembed] })
                    await msg.react('✅');
                    await msg.react('❌');

                    let ok = new EmbedBuilder()
                        .setDescription(`${config.tick} <@${message.author.id}> You have sold \`${item}\` for \`${price}\``)
                        .setColor('Random')

                    let no = new EmbedBuilder()
                        .setDescription(`${config.wrong} <@${message.author.id}> guess you changed your mind on selling \`${item}\` for \`${price}\``)
                        .setColor('Random')

                    const filter = (reaction, user) => {
                        return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                    };
                    msg.awaitReactions({ filter, max: 1 })
                        .then(collected => {
                            const reaction = collected.first();
                            if (reaction.emoji.name == '✅') {
                                msg.edit({ embeds: [ok] })
                                db.run(`UPDATE collected SET ${expcol} = ${expcol} - ${num} WHERE userid = ${message.author.id}`);
                                user.wallet += num * price;
                                user.save();
                            }
                            else {
                                msg.edit({ embeds: [no] })
                            }
                        })
                }
            }
        } else return message.channel.send('that item does not exist')
    }
}