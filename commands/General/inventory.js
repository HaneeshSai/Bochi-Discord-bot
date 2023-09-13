const sqlite = require('sqlite3')
const { EmbedBuilder } = require('discord.js');
const shop = require('../../assets/shop.json')
const config = require('../../config.json')
const datb = require('./../../utils/functions.js')

const time = ['xp_booster', 'anti_steal', 'cash_booster']

module.exports = {
    name: 'inventory',
    category: 'General',
    aliases: ['inv'],
    description: 'shows or creates an inventory for a user',
    run: async (client, message, args) => {
        let db = new sqlite.Database('./database/shop.db', sqlite.OPEN_READWRITE);
        let expiries = []

        let allitems = [];
        let allitemids = []
        shop.buyable.items.forEach(e => {
            allitems.push(e.name);
            allitemids.push(e.id);
        })

        shop.buyable.tools.forEach(e => {
            allitems.push(e.name);
            allitemids.push(e.id);
        })

        let envq = `SELECT * FROM inventory WHERE userid = ${message.author.id}`
        let row = await datb.dbdata(db,envq)
            if (row === undefined) {
                let ins1 = db.prepare(`INSERT INTO inventory VALUES(?,?,?,?,?,?,?)`);
                let ins2 = db.prepare(`INSERT INTO collected VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
                ins1.run(message.author.id, 0, 0, 0, 0, 0, 0);
                ins2.run(message.author.id, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                ins1.finalize();
                ins2.finalize();
                client.log('added');
                let embed = new EmbedBuilder()
                    .setDescription(`${config.tick} you have now made an inventory for yourself! you can now buy things in shop`)
                    .setColor('Random');

                message.channel.send({ embeds: [embed] })
                return;
            }
            else {
                let itms = Object.keys(row)
                let vals = Object.values(row)
                let alitms = []
                let vales = []
                
                itms.forEach(e=>{
                    if(time.includes(e) && Date.now() < row[e] && row[e] > 0){
                        alitms.push(e)
                    }
                    else if(!time.includes(e) && row[e] > 0) {
                        alitms.push(e)
                    }
                })

                vals.forEach(e=>{
                    if(e > 10 && Date.now() < e){
                        vales.push(e)
                    }
                    else if(e < 11 && e > 0) {
                        vales.push(e)
                    }
                }) 


                let q = `SELECT * FROM collected WHERE userid = ${message.author.id}`;
                let r = await datb.dbdata(db, q)

                let collects = Object.keys(r).filter(k=> r[k] > 0)
                collects.shift();
                let collects_num = Object.values(r).filter(e => e > 0)
                collects_num.shift()
                alitms.shift()
                vales.shift()


                if (alitms.length < 1) {
                    let embed = new EmbedBuilder()
                        .setDescription(`${config.wrong} <@${message.author.id}> You do not possess any items in your inventory!, Please use the command \`.shop\` to know what items are on sale`)
                        .setColor("Red")

                    return message.channel.send({ embeds: [embed] });
                }

                let str1 = '';
                alitms.forEach((e,i)=>{
                    str1 += `\`[${i+1}]\`. \`${e}\`: ${vales[i] > 10 ? `<t:${Math.floor(vales[i]/1000) - 7 * 24 * 60 * 60}:R>` : `${vales[i]} uses`}\n`
                })

                let str = "";
                collects.forEach((e, i) => {
                    str += `\`[${i + 1}]\`. \`${e}\`: ${collects_num[i]}\n`
                })

                let embed = new EmbedBuilder()
                    .setDescription(`<@${message.author.id}>'s Inventory\nThe items you possess in your inventory are:`)
                    .addFields(
                        { name: 'Tools/Boosters', value: str1, inline: true},
                        { name: 'Collected items', value: `${str? str : "No items" }`, inline: true }
                    )
                    .setColor('Random')
                return message.channel.send({ embeds: [embed] })
            }

    }
}