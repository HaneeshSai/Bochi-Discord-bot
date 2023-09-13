const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({ language: 'en' })

module.exports = {
    name: 'tictactoe',
    aliases: ['ttt'],
    category: 'Games',
    description: 'play tictactoe with a bot or a user',
    params: [
        {
            name: "mentioned",
        },
        {
            name: "bet",
        }
    ],

    run: async (client, message, args) => {
        game.handleMessage(message);
       
    }
}
