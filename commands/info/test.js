const { Levels } = require('../../utils/schema.js');

module.exports = {
    name: 'test',
    category: 'fun',
    description: 'test command for the dev',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {

        user = message.author;
        udata = await Levels.findOne({ id: user.id}) || new Levels({ id: user.id });

        message.channel.send(`you xp is ${udata.xp}`);
        

    }
}