const {Collection, Client, Discord, GatewayIntentBits} = require('discord.js')
const fs = require('fs')
const { mongoose } = require('mongoose');
const winston = require("winston");
const chalk = require("chalk");
const moment = require("moment")

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.GuildPresences
	],
});

const myFomat = winston.format.printf(({ level, message, timestamp }) => {
    return `${chalk.blueBright(`[${moment(timestamp).format("YYYY-MM-DD_hh:mm:ss")}]`)} ${level}: ${message}`;
});

const logger = winston.createLogger({
    exitOnError: false,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "bot.log", dirname: "./Logs/" })
    ],
    format: winston.format.combine(winston.format.colorize(), winston.format.timestamp(), myFomat)
});

const config = require('./config.json')
const prefix = config.prefix
const token = config.token
const MONGO_URI = config.mongoURl;

client.voiceChannel = new Collection();
client.snipe = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
client.games = new Collection();
client.flags = new Collection()
client.categories = fs.readdirSync("./commands/");


main();

async function main() {
    ["events", "command"].forEach(handler => {
        require(`./handlers/${handler}`)(client);
    });
}

client.log = (a, type = "info") => {
    logger.info(a.stack || a);
}

//mongoose.set('debug', true)

mongoose.set('strictQuery', true);

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    client.log(`${chalk.blueBright("[MONGODB]")} Connection established successfully.`)
}).catch((error) => {
    console.log(error);
});

client.login(token)

process.on("uncaughtException", async (err) => {
    client.log(err);
});

process.on("unhandledRejection", async (err) => {
    client.log(err);
})
