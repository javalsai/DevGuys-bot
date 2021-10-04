const Discord = require('discord.js');

module.exports = function main(bot = new Discord.Client(), dbClient = new (require('mongodb').MongoClient)(), config, emitter = new (require('events').EventEmitter)()) {
    const regexp = /^\/B(?:ig)?R(?:andom)?\s*(?<number>[0-9]*)(?<mode>[a-zA-Z])?$/; // max number = 1950
    return [
        {
            event: "message",
            run: (msg) => {
                if(!regexp.test(msg.content)) return;
                let message;
                const mode = (regexp.exec(msg.content).groups.mode || 'n').toLowerCase();
                mode_conditions: if(mode === 'l') {
                    const randoms = parseInt(regexp.exec(msg.content).groups.number || '2');
                    if(randoms > 1950) { message = NaN; break mode_conditions;}
                    let random = '';
                    while(random.length < randoms) {
                        random += Math.random().toString().slice(2);
                    }
                    message = `Your random number: \`${random.substring(0, randoms)}\``;
                } else if(mode === 'n') {
                    const randoms = parseInt(regexp.exec(msg.content).groups.number || '100');
                    if(randoms >= (1e2000 - 50) || Math.abs(randoms) === Infinity) { message = NaN; break mode_conditions;}
                    message = `Your random number: \`${Math.floor(Math.random() * randoms)}\``;
                }else {
                    message = `Metodo inválido: \`${mode}\``;
                }
                msg.channel.send((message.length <= 2e3 || Number.isNaN(message))? message : 'El mensaje es demasiado largo.');
            }
        }
    ];
}