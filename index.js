const Discord = require('discord.js');
const MongoDB = require('mongodb');
const jsonc = require('jsonc');
const path = require('path');
const http = require('http');
const fs = require('fs');


// Eviromental file if it isn't in heroku
if (!process.env.HEROKU) {
    require('dotenv').config();
}



// Clients
const bot = new Discord.Client();
bot.setMaxListeners(20);
const dbClient = new MongoDB.MongoClient(process.env.DBURI, { useNewUrlParser: true });



// Global variables
const config = jsonc.parse(fs.readFileSync(process.env.CONFIG_PATH).toString());
const emitter = new (require('events').EventEmitter)();


// Test local
if (!process.env.HEROKU) {
    require('./.test.js')(bot);
}



//////////////////// * Start Function * ////////////////////
async function start() {
    await dbClient.connect();
    bot.login(process.env.TOKEN);
    
    // Ping web for preventing idling
    setInterval(() => {
        http.get("https://devguys-bot.herokuapp.com/");
    }, 3e5); // 5 min
}
start();



//////////////////// * Bot code * ////////////////////
bot.once('ready', () => {
    console.log('🤖 I\'m ready 🤖');
});

fs.readdirSync('bot_events', { withFileTypes: true })
    .filter(entry => entry.isFile())
    .map(file => file.name)
    .filter(file => file.endsWith('js') || file.endsWith('node'))
    .forEach(file => {
        const file_event = require('./' + path.join('bot_events', file))(bot, dbClient, config, emitter);
        file_event.forEach(event => {
            bot.on(event.event, event.run || Function());
        });
    });



//////////////////// * Catch exit gignals * ////////////////////
(['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM']).forEach(function (sig) {
    process.on(sig, function () {
        terminator(sig);
    });
});

function terminator(sig) {
    if (typeof sig === "string") {
        preExit(function () {
            process.exit(1);
        });
    }
}

// async before exit
async function preExit(cb) {
    bot.destroy();
    await dbClient.close();
    cb();
}