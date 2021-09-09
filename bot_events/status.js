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
        },
        {
            event: "ready",
            run: () => {
                async function run() {
                    const guild = await bot.guilds.fetch(config.guild_id);
                    const ch_members = guild.channels.cache.get(config.channels.stats.members);
                    ch_members.name.replace(/^[^\:]+\:/i, (str) => { ch_members.setName(str + ' ' + guild.members.cache.array().filter(member => !member.user.bot).length) });
                    const ch_verified = guild.channels.cache.get(config.channels.stats.verified);
                    ch_verified.name.replace(/^[^\:]+\:/i, (str) => { ch_verified.setName(str + ' ' + guild.members.cache.array().filter(member => !member.roles.cache.find(role => role.id === config.roles.default)).length) });
                    const ch_bots = guild.channels.cache.get(config.channels.stats.bots);
                    ch_bots.name.replace(/^[^\:]+\:/i, (str) => { ch_bots.setName(str + ' ' + guild.members.cache.array().filter(member => member.user.bot).length) });
                }
                run()
                setInterval(run, 36e5);
            }
        }
    ]
}