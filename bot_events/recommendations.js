const Discord = require('discord.js');

module.exports = function main(bot = new Discord.Client(), dbClient = new (require('mongodb').MongoClient)(), config, emitter = new (require('events').EventEmitter)()) {
    const disbut = require('discord-buttons')(bot);
    const captchas_collection = dbClient.db('nodejs').collection('captchas');

    return [
        {
            event: "message",
            run: (msg = new Discord.Message()) => {
                if (msg.channel.id !== config.channels.recommendations.from) return;
                msg.react('❔');
                msg.guild.channels.cache.get(config.channels.recommendations.to).send(
                    {
                        embed: new Discord.MessageEmbed()
                            .setAuthor(msg.author.tag, msg.author.avatarURL())
                            .setDescription(msg.content)
                            .setTitle('Nueva Recomendación')
                            .setColor('BF9000')
                            .setFooter('ID: ' + msg.author.id)
                        ,
                        buttons: [
                            new disbut.MessageButton()
                                .setStyle('green')
                                .setLabel('Aceptar')
                                .setID('+r' + msg.id)
                            ,
                            new disbut.MessageButton()
                                .setStyle('red')
                                .setLabel('Denegar')
                                .setID('-r' + msg.id)
                            ,
                            new disbut.MessageButton()
                                .setStyle('url')
                                .setLabel('See Original Message')
                                .setURL(msg.url)
                        ]
                    }
                );
            }
        },
        {
            event: 'clickButton',
            run: async (button /* = new Discord.ButtonEvent (not able atm)*/) => {
                if (!/(?:\+|\-)r/.test(button.id)) return;
                button.defer();
                if (Array.from(button.message.embeds[0].fields).length !== 0) {
                    return button.message.channel.send(`<@${button.clicker.user.id}>, ya se ha decidido que hacer con esta recommendación`).then(msg => {
                        setTimeout(() => {
                            msg.delete();
                        }, 2e3);
                    });
                }
                const accept = !!button.id.startsWith('+r'); // true = accept | false = deny
                const original_message = (await button.guild.channels.cache.get(config.channels.recommendations.from).messages.fetch(button.id.substring(2)));
                original_message.reactions.resolve('❔').users.remove(bot.id);
                original_message.react(accept ? '✅' : '❎');
                const embed2edit = new Discord.MessageEmbed(button.message.embeds[0]);
                embed2edit.addField('Estado', accept ? 'Aceptada' : 'Denegada');
                button.message.edit(embed2edit);
                (await bot.users.fetch(embed2edit.footer.text.substring(3))).send(
                    new Discord.MessageEmbed()
                        .setTitle('Recomendación ' + (accept ? 'Aceptada' : 'Denegada'))
                        .setDescription(embed2edit.description)
                        .setColor(accept? '#2ecc71' : '#e74c3c')
                        .setAuthor(button.clicker.user.tag, button.clicker.user.avatarURL())
                        .setTimestamp(new Date())
                );
                (await bot.channels.fetch(config.channels.recommendations.todo)).send(
                    new Discord.MessageEmbed()
                        .setTitle('Recomendación ' + (accept ? 'Aceptada' : 'Denegada'))
                        .setDescription(embed2edit.description)
                        .setColor(accept? '#2ecc71' : '#e74c3c')
                        .setAuthor(button.clicker.user.tag, button.clicker.user.avatarURL())
                        .setTimestamp(new Date())
                );
                // I now it can be resumed and more efficient, but I'm VERY tired
            }
        }
    ]
}