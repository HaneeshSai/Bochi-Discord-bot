const { EmbedBuilder } = require('discord.js');
const sqlite = require('sqlite3');
const shop = require('../../assets/shop.json');
const config = require('../../config.json');
const { User } = require('../../utils/schema.js');
const datb = require('./../../utils/functions.js')

module.exports = {
    name: 'buy',
    category: 'General',
    aliases: [''],
    description: 'shows the shop menu',
    params: [
        {
            name: "item",
            required: true,
            multiword: true,
        }

    ],
    run: async (client, message, { item }) => {
        let db = new sqlite.Database('./database/shop.db', sqlite.OPEN_READWRITE);
        const user = await User.findOne({ id: message.author.id }) || new User({ id: message.author.id })
        let itemname = item.split(" ").join("").toLowerCase();
        let items = []
        let ids = []
        let prices = []
        let validity = []

        shop.buyable.items.forEach(e => {
            items.push((e.name).split("_").join("").toLowerCase())
            ids.push(e.id)
            prices.push(e.price)
            validity.push(e.validity)

        });

        shop.buyable.tools.forEach(e => {
            items.push((e.name).split("_").join("").toLowerCase())
            ids.push(e.id)
            prices.push(e.price)
            validity.push(e.validity)
        })

        let expiry;

        let itemid;
        let id;
        let price;
        if (items.includes(itemname)) {
            id = items.indexOf(itemname)
            itemid = ids[id]
            price = Number(prices[id])
        }
        if (validity[id] == '1 week') expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
        else expiry = 10;

        let emptycolumns = []
        let fillcolums = []

        
        let expcol = item.split(" ").join("_")

        if (items.includes(itemname)) {
            let q = `SELECT ${expcol} FROM inventory WHERE userid = ${message.author.id}`;
            let row = await datb.dbdata(db, q);
            if (row === undefined) {
                let embed = new EmbedBuilder()
                    .setDescription(`${config.wrong} <@${message.author.id}> You do not have an inventory! please create an inventory first by using the command  \`.inventory\``)
                    .setColor('Red');
                message.channel.send({ embeds: [embed] })
                return;
            }
            else {
                let q = `SELECT * FROM inventory WHERE userid = ${message.author.id}`
                let r = await datb.dbdata(db, q)
                emptycolumns = Object.keys(r).filter(k => r[k] === 0)
                if (expcol.length < 4 && Date.now() < row[expcol] && row[expcol] > 0) {
                    let embed = new EmbedBuilder()
                        .setDescription(`${config.wrong} <@${message.author.id}> you already have a \`${item}\` in your inventory, you cannot buy it again untill its validity expires`)
                        .setColor('Random')

                    message.channel.send({ embeds: [embed] });
                    return;
                }
                else if (expcol.length > 3 && row[expcol] > 0) {
                    let embed = new EmbedBuilder()
                        .setDescription(`${config.wrong} <@${message.author.id}> you already have a \`${item}\` in your inventory, you cannot buy it again untill its validity expires`)
                        .setColor('Random')

                    message.channel.send({ embeds: [embed] });
                    return;
                }
                if (emptycolumns.length < 2) {
                    let embed = new EmbedBuilder()
                        .setDescription(`${config.wrong} <@${message.author.id}> you inventory is full, you can have only 5 items in your inventory`)
                        .setColor("Random")

                    message.channel.send({ embeds: [embed] })
                    return;
                }

                if (user.wallet < price) {
                    let embed = new EmbedBuilder()
                        .setDescription(`${config.wrong} <@${message.author.id}> You do not have enough cash to buy this item! The price for this item is \`${price}\` cash`)
                        .setColor("Random")
                    return message.channel.send({ embeds: [embed] });
                }
            }

           db.run(`UPDATE inventory SET ${expcol} = ${expiry} WHERE userid = ${message.author.id}`)
            user.wallet -= price;
            user.save()

            let embed = new EmbedBuilder()
                .setDescription(`${config.tick} <@${message.author.id}> You have bought the item \`${item}\`!, You can use it for \`${validity[id]}\``)
                .setColor("Random")

            return message.channel.send({ embeds: [embed] });
        } else {
            let embed = new EmbedBuilder()
                .setDescription(`${config.wrong} <@${message.author.id}> You cannot buy that item since it does not exist in the shop!, Please select a valid item you want to buy`)
                .setColor("Red")

            return message.channel.send({ embeds: [embed] });
        }

    }
}