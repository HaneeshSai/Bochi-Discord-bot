const { EmbedBuilder } = require("discord.js");
const emotes = require("../assets/emotes.json")
const config = require('../config.json')


module.exports = async (client, member) => {

  let welchanel = await member.guild.channels.cache.get("917986564200620103")
  let user = member.user

  let embed = new EmbedBuilder()
    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
    .setDescription(`<a:arrow2:1084159424966434877> Make Sure To Read <#917986540821569577>\n<a:arrow2:1084159424966434877> Check Out <#917986554079748126>, <#917986555535192167>\n\n<a:yo:1055561884952166460> Boost For Pic Perms & Custom VC\n<a:k:1055560857121214524> Get Verified, Check Out <#1051095179379081256>`)
    .setColor("LuminousVividPink")
    .setThumbnail(member.guild.iconURL({ dynamic: true }))
    .setFooter({text: `We Hope You Enjoy Your Stay!`})

    welchanel.send({content:`Welcome to Enjoy <@${user.id}>`, embeds: [embed] })

 


}