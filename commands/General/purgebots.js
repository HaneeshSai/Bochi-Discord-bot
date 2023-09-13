const { EmbedBuilder } = require('discord.js')

module.exports = {
	name: 'purgebot',
	category: 'General',
	aliases : ['pb'],
	permission: "helper",
	description: 'deletes some messages sent by a bot',

	run: async(client, message, args) => {

		let deleteAmount = args[0] || 30;
		
			const allmessages = await message.channel.messages.fetch({ limit: Math.min(deleteAmount + 1, 100)})
			const botMessages = await allmessages.filter(msg => msg.author.bot)
			await message.channel.bulkDelete(botMessages);
			let messagesDeleted = parseInt(botMessages.size)

			let succEmbed = new EmbedBuilder()
				.setDescription(`<@${message.author.id}> has deleted **${messagesDeleted}** messages in the channel`)
				.setColor("Green");
			message.channel.send({ embeds: [succEmbed] }).then(m => setTimeout(() => m.delete(), 5000));
	}
}