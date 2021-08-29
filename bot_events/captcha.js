const Discord = require('discord.js');
const Captcha = require('captcha-generator-alphanumeric').default;

module.exports = function main(bot = new Discord.Client(), dbClient = new (require('mongodb').MongoClient)(), config = {}, emitter = new (require('events').EventEmitter)()) {
    const captchas_collection = dbClient.db('nodejs').collection('captchas');

    return [
        {
            event: 'ready',
            run: async () => {
                global.logs_channel = await bot.channels.fetch(config.channels.logs.captchas);
            }
        },
        {
            event: "guildMemberAdd",
            run: async (member = new Discord.GuildMember()) => {
                // If has already a captcha, delete it
                if ((await captchas_collection.find({ user: member.user.id }).toArray())[0]) {
                    await captchas_collection.deleteOne({ user: member.user.id });
                }

                // Generate captcha
                const userCaptcha = new Captcha();

                // Save value to database and send it to user
                await captchas_collection.insertOne({ user: member.user.id, captcha: userCaptcha.value });
                member.user.send(
                    'Por favor, responde a este mensaje con: \`captcha: <valor del captcha>\`',
                    new Discord.MessageAttachment(userCaptcha.JPEGStream, "captcha.jpeg")
                );
            }
        },
        {
            event: "guildMemberRemove",
            run: async (member = new Discord.GuildMember()) => {
                // If user is still in db, remove from it
                if ((await captchas_collection.find({ user: member.user.id }).toArray())[0]) {
                    await captchas_collection.deleteOne({ user: member.user.id });
                }
            }
        },
        {
            event: "message",
            run: async (message = new Discord.Message()) => {
                // Extract captcha value
                const receivedCaptcha = (message.content.match(/captcha:\s*([a-z0-9]{6})\s*/i) || [, undefined])[1];
                if (receivedCaptcha === undefined || message.channel.type !== 'dm') return;

                // Validate captcha
                const validCaptcha = ((await captchas_collection.find({ user: message.author.id }).toArray())[0] || { captcha: undefined }).captcha;
                if (validCaptcha === undefined) return message.channel.send('No tienes ningún captcha.');
                if (receivedCaptcha === validCaptcha) {
                    message.channel.send(':white_check_mark:');
                    (await bot.guilds.cache.get(config.guild_id).members.fetch(message.author.id)).roles.add(config.roles.default);
                    await captchas_collection.deleteOne({ user: message.author.id });
                    logs_channel.send(
                        new Discord.MessageEmbed()
                            .setTitle(':white_check_mark: Captcha Correcto')
                            .setColor('#2ecc71')
                            .setAuthor(message.author.tag, message.author.avatarURL())
                            .setDescription(`<@${message.author.id}> a acertado el captcha.\n\n- Recibido: ${receivedCaptcha}\n- Correcto: ${validCaptcha}`)
                            .setTimestamp(new Date())
                    );
                } else {
                    message.channel.send(':negative_squared_cross_mark:');
                    logs_channel.send(
                        new Discord.MessageEmbed()
                            .setTitle(':negative_squared_cross_mark: Captcha Fallado')
                            .setColor('#e74c3c')
                            .setAuthor(message.author.tag, message.author.avatarURL())
                            .setDescription(`<@${message.author.id}> a fallado el captcha.\n  -Recibido: ${receivedCaptcha}\n  -Correcto: ${validCaptcha}`)
                            .setTimestamp(new Date())
                    );
                }
            }
        }
    ]
}