
module.exports = async (client, message) => {
    try { await message.fetch() } catch { }
    if (!message || message?.author?.bot) return;

    client.snipe.set(message.channel.id, message);
}