const Discord = require('discord.js');

module.exports = function main(bot = new Discord.Client(), dbClient = new (require('mongodb').MongoClient)(), config, emitter = new (require('events').EventEmitter)()) {
    const regexp = /^\/B(?:ig)?R(?:andom)?\s*(?<number>[0-9]|[1-9][0-9]{1,2}|1[0-8][0-9]{2}|19[0-4][0-9]|1950)?$/; // max number = 1950
    return [
        {
            event: "message",
            run: (msg) => {
                if(!regexp.test(msg.content)) return;
                const randoms = parseInt(regexp.exec(msg.content).groups.number || '2');
                let random = '';
                while(random.length < randoms) {
                    random += Math.random().toString().slice(2);
                }
                msg.channel.send(`Your random number: \`${random.substring(0, randoms)}\``);
            }
        }
    ];
}