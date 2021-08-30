const Discord = require('discord.js');

module.exports = function main(bot = new Discord.Client(), dbClient = new (require('mongodb').MongoClient)(), config = {}, emitter = new (require('events').EventEmitter)()) {
    return [
        {
            event: "ready",
            run: () => {
                bot.user.setPresence({
                    status: "online",
                    game: {
                        name: "https://github.com/javalsai/DevGuys-bot",
                        type: 1
                    }
                });
            }
        }
    ]
}