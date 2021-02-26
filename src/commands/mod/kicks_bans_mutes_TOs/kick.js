const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { MessageCollector } = require('discord.js')

const modLogSchema = require('../../../../schemas/modLogSchema')

const emoji = require('../../../../config/emoji.json')

module.exports = {
    name: "kick",
    category: "Moderation",
    aliases: ["k"],
    ignoreDisabledChannels: true,
    description: "Kicks a users",
    usage: "\`PREFIXkick [user]\`",
    perms: ['KICK_MEMBERS'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'KICK_MEMBERS'],

    execute: async function (client, message, args) {
        const kick = new Discord.MessageEmbed()

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        let reason = args.slice(1).join(' ');
        if (!reason) { reason = 'No Reason Given' }

        if (!member) return message.channel.send(kick.setColor('RED').setDescription(`**${emoji.downvote} ${message.author} mention a member to kick!**`))

        if (member.user.id === message.author.id) return message.channel.send(kick.setColor('RED').setDescription(`**${emoji.downvote} ${message.author} you can\`t kick yourself!**`))
        if (!member.kickable) return message.channel.send(kick.setColor('RED').setDescription(`**${emoji.downvote} ${message.author} I can\`t kick that user!**`))

        message.channel.send(kick.setDescription(`\`[⏰ 10s]\` Are you sure you want kick ${member}? \`[yes/no]\``).setColor(message.guild.me.displayColor))

        const collector = new MessageCollector(message.channel, msg => msg.author.id === message.author.id, {
            time: 10000
        })


        const guildId = message.guild.id
        const userId = member.user.id

        const kickEmbed = new Discord.MessageEmbed()
            .setTitle(`You were kicked from ${message.guild.name}`)
            .setDescription(`Reason: ${reason}`)
            .setColor(message.guild.me.displayColor)

        collector.on('collect', async (msg) => {
            switch (msg.content.toLowerCase()) {
                case "yes":


                    member.send(kickEmbed).catch((e) => {
                        console.log(`I couldnt DM the user`)
                    })


                    member.kick(`Kicked by ${message.member.user.tag}, reason: ${reason}`)
                        .then(async () => {
                            collector.stop('success');

                            const modlog = {
                                author: message.member.id,
                                timestamp: new Date().getTime(),
                                type: 'Kick',
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

                            return message.channel.send(kick
                                .setThumbnail(`${member.user.displayAvatarURL({ dynamic: true })}`)
                                .setDescription(`**${emoji.upvote} Kicked \`${member.user.tag} (${member.user.id})\` \n\nReason: \`${reason}\`**`)
                                .setColor('GREEN'))
                        }).catch(err => {
                            collector.stop('success');
                            if (err) return message.channel.send(kick.setColor('RED').setDescription(`**${emoji.downvote}Error**`))
                        })
                    break
                case "y":

                    member.send(kickEmbed).catch((e) => {
                        console.log(`I couldnt DM the user`)
                    })


                    member.kick(`Kicked by ${message.member.user.tag}, reason: ${reason}`)
                        .then(async () => {
                            collector.stop('success');

                            const modlog = {
                                author: message.member.id,
                                timestamp: new Date().getTime(),
                                type: 'Kick',
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

                            return message.channel.send(kick
                                .setDescription(`**${emoji.upvote} Kicked \`${member.user.tag} (${member.user.id})\` \n\nReason: \`${reason}\`**`)
                                .setColor('GREEN')
                                .setThumbnail(`${member.user.displayAvatarURL({ dynamic: true })}`))
                        }).catch(err => {
                            collector.stop('success');
                            if (err) return message.channel.send(kick.setColor('RED').setDescription(`**${emoji.downvote} Error**`))
                        })
                    break
                case "no":
                    message.channel.send(kick.setDescription(`**${emoji.downvote} Cancelled**`).setColor('RED'))
                    collector.stop('success')
                    break
                case "n":
                    message.channel.send(kick.setDescription(`**${emoji.downvote} Cancelled**`).setColor('RED'))
                    collector.stop('success')
                    break
                default:
                    message.channel.send(kick.setDescription(`**${emoji.downvote} Cancelled**`).setColor('RED'))
                    collector.stop('success')
            }
            collector.stop('success')
        })
        collector.on('end', (ignore, error) => {
            if (error && error !== "success") {
                return message.channel.send(kick.setDescription(`**${emoji.downvote} Timed out**`).setColor('RED'))
            };
            collector.stop('success')
        });
    }
}