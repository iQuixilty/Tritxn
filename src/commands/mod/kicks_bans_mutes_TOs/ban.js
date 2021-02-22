const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const { MessageCollector } = require('discord.js')

const modLogSchema = require('../../../../schemas/modLogSchema')

const emoji = require('../../../../config/emoji.json')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "ban",
    category: "Moderation",
    aliases: ["b"],
    ignoreDisabledChannels: true,
    description: "Bans a user",
    usage: "\`PREFIXban [user]\`",
    perms: ['BAN_MEMBERS'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'],

    execute: async function (client, message, args) {
        const ban = new Discord.MessageEmbed()

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        let reason = args.slice(1).join(' ');
        if (!reason) { reason = 'No Reason Provided' }

        if (!member) return message.channel.send(ban.setColor('RED').setDescription(`**${emoji.downvote} ${message.author} mention a member to ban!**`))

        if (member.user.id === message.author.id) return message.channel.send(ban.setColor('RED').setDescription(`**${emoji.downvote} ${message.author} you can\`t ban yourself!**`))
        if (!member.bannable) return message.channel.send(ban.setColor('RED').setDescription(`**${emoji.downvote} ${message.author} I can\`t ban that user!**`))

        message.channel.send(ban.setDescription(`\`[⏰ 10s]\` Are you sure you want ban ${member}? \`[yes/no]\``).setColor(message.guild.me.displayColor))

        const collector = new MessageCollector(message.channel, msg => msg.author.id === message.author.id, {
            time: 10000
        })

        const guildId = message.guild.id
        const userId = member.user.id

        const banEmbed = new Discord.MessageEmbed()
            .setTitle(`You were banned from ${message.guild.name}`)
            .setDescription(`Reason: ${reason}`)
            .setColor(message.guild.me.displayColor)

        collector.on('collect', async (msg) => {
            switch (msg.content) {
                case "yes":

                    member.ban({ days: 7, reason: `Banned by ${message.member.user.tag}, reason: ${reason}` })
                        .then(async () => {
                            collector.stop('success');


                            member.send(banEmbed).catch((e) => {
                                console.log(`I couldnt DM the user`)
                            })
                    
                            const modlog = {
                                author: message.member.id,
                                timestamp: new Date().getTime(),
                                type: 'Ban',
                                reason
                            }
                    
                            await modLogSchema.findOneAndUpdate({
                                guildId,
                                userId
                            }, {
                                guildId,
                                userId,
                                $push: {
                                    modlogs: modlog
                                }
                            }, {
                                upsert: true,
                            })

                            return message.channel.send(ban
                                .setThumbnail(`${member.user.displayAvatarURL({ dynamic: true })}`)
                                .setDescription(`**${emoji.upvote} Successfully banned \`${member.user.tag} (${member.user.id})\` \n\nReason: \`${reason}\`**`)
                                .setColor('GREEN'))
                        }).catch(err => {
                            collector.stop('success');
                            console.log(err)
                            if (err) return message.channel.send(ban.setColor('RED').setDescription(`**${emoji.downvote} Error**`))
                        })
                    break
                case "y":

                    member.ban({ days: 7, reason: `Successfully banned by ${message.member.user.tag}, reason: ${reason}` })
                        .then(async () => {
                            collector.stop('success');


                            member.send(banEmbed).catch((e) => {
                                console.log(`I couldnt DM the user`)
                            })

                            const modlog = {
                                author: message.member.id,
                                timestamp: new Date().getTime(),
                                type: 'Ban',
                                reason
                            }
                    
                            await modLogSchema.findOneAndUpdate({
                                guildId,
                                userId
                            }, {
                                guildId,
                                userId,
                                $push: {
                                    modlogs: modlog
                                }
                            }, {
                                upsert: true,
                            })


                            return message.channel.send(ban
                                .setDescription(`**${emoji.upvote} Banned \`${member.user.tag} (${member.user.id})\` \n\nReason: \`${reason}\`**`)
                                .setColor('GREEN')
                                .setThumbnail(`${member.user.displayAvatarURL({ dynamic: true })}`))
                        }).catch(err => {
                            collector.stop('success');
                            if (err) return message.channel.send(ban.setColor('RED').setDescription(`**${emoji.downvote} Error**`))
                        })
                    break
                case "no":
                    message.channel.send(ban.setDescription(`**${emoji.downvote} Cancelled**`).setColor('RED'))
                    collector.stop('success')
                    break
                case "n":
                    message.channel.send(ban.setDescription(`**${emoji.downvote} Cancelled**`).setColor('RED'))
                    collector.stop('success')
                    break
                default:
                    message.channel.send(ban.setDescription(`**${emoji.downvote} Cancelled**`).setColor('RED'))
                    collector.stop('success')
            }
            collector.stop('success')
        })
        collector.on('end', (ignore, error) => {
            if (error && error !== "success") {
                return message.channel.send(ban.setDescription(`**${emoji.downvote} Timed out**`).setColor('RED'))
            };
            collector.stop('success')
        });
    }
}