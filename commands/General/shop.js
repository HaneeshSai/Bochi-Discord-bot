const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, Events } = require('discord.js')

const shop = require('../../assets/shop.json')

module.exports = {
    name: 'shop',
    category: 'General',
    aliases: [''],
    description: 'shows the shop menu',

    run: async (client, message, args) => {
        let shopEmbed = new EmbedBuilder()
            .setDescription(`**Select a category to view items of that category! Use the dropdown menu below.**
        ✨ Tools
        ╰- Tools you can purchase from the shop!\n
        💎 Items
        ╰- Items to equip for boosts!`)
            .setColor('Random')

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select')
                    .setPlaceholder("Select a shop category!")
                    .addOptions(
                        {
                            label: '💎 Tools',
                            description: 'Tools you can purchase from the shop!',
                            value: '1',
                        },
                        {
                            label: '✨ Items',
                            description: 'Buy some cool items for boosts!',
                            value: '2',
                        },
                        {
                            label: 'Home',
                            description: 'Return to the Homepage!',
                            value: '3',
                        }
                    )
            )

            message.channel.send({embeds: [shopEmbed], components: [row]});
            
            let itemstr = "";
            let toolstr = "";

            shop.buyable.items.forEach((e, i) => {
                itemstr += `\`${i+1}\`. **${e.name}** \n<a:arrow:1087007948858986618>\`Description\`: ${e.description}\n<a:arrow:1087007948858986618>\`price\`: ${e.price}         <a:aa_cash_23:1087009059653304330>\n<a:arrow:1087007948858986618>\`validity\`: **${e.validity}**\n\n`
            })

            shop.buyable.tools.forEach((e, i) => {
                toolstr += `\`${i+1}\`. **${e.name}** \n<a:arrow:1087007948858986618>\`Description\`: ${e.description}\n<a:arrow:1087007948858986618>\`price\`: ${e.price} <a:aa_cash_23:1087009059653304330>\n<a:arrow:1087007948858986618>\`validity\`: **${e.validity}**\n<a:arrow:1087007948858986618>\`usage\`: ${e.usage}\n\n`
            })

            let itemsEmbed = new EmbedBuilder()
            .setTitle('💎 Items')
            .setDescription(itemstr)

            let toolsembed = new EmbedBuilder()
            .setTitle('✨ Tools')
            .setDescription(toolstr)

            client.on(Events.InteractionCreate, async interaction => {
                if (!interaction.isStringSelectMenu()) return;
            
                const selected = interaction.values[0];
            
                if (selected === '1') {
                    await interaction.update({embeds: [toolsembed], components: [row]});
                } else if (selected === '2') {
                    await interaction.update({embeds: [itemsEmbed], components: [row]});
                } else if (selected === '3') {
                    await interaction.update({embeds: [shopEmbed], components: [row]});
                }
            });

            


    }
}