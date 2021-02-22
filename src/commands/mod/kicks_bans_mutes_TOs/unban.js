const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor
const { MessageCollector } = require('discord.js')

const emoji = require('../../../../config/emoji.json')

module.exports = {
    name: "unban",
    category: "Moderation",
    aliases: ["unb"],
    description: "Unbans a user with their id",
    usage: "\`PREFIXunban [user id]\`",
    perms: ['BAN_MEMBERS'],
    ignoreDisabledChannels: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'],

    execute: async function (client, message, args) {
        const unban = new Discord.MessageEmbed()


        let reason = args.slice(1).join(" ");
        let userId = args[0]

        if (!reason) {
            reason = "No reason given!";
        }

        if (isNaN(args[0])) return message.channel.send(unban
            .setColor('RED')
            .setDescription(`**${emoji.downvote} ${message.author} the ID stated is not a number**`))


        message.guild.fetchBans().then(async bans => {
            if (bans.size === 0) return message.channel.send(unban
                .setColor('RED')
                .setDescription(`**${emoji.downvote} ${message.author} this server does not have anyone banned**`))

            let bUser = bans.find(b => b.user.id === userId)

            if (!bUser) return message.channel.send(unban
                .setColor('RED')
                .setDescription(`**${emoji.downvote} ${message.author} the user ID stated is not banned**`))


            message.channel.send(unban.setDescription(`\`[⏰ 10s]\` Are you sure you want unban <@${userId}>? \`[yes/no]\``).setColor(message.guild.me.displayColor))

            const collector = new MessageCollector(message.channel, msg => msg.author.id === message.author.id, {
                time: 10000
            })

            collector.on('collect', msg => {
                switch (msg.content) {
                    case "yes":
                        message.guild.members.unban(bUser.user, reason).catch(err => {
                            console.log(err);
                            return message.channel.send(unban
                                .setColor('RED')
                                .setDescription(`**${emoji.downvote} ${message.author} something went wrong unbanning the id**`))
                        }).then(() => {
                            collector.stop('success')

                            return message.channel.send(unban
                                .setColor('GREEN')
                                .setDescription(`**${emoji.upvote} Succesfully unbanned <@${args[0]}>  \n\nReason: \`${reason}\`**`));
                        }).catch(err => {
                            collector.stop('success');
                            if (err) return message.channel.send(unban.setColor('RED').setDescription(`**${emoji.downvote} Error**`))
                        })
                        break
                    case "y":
                        message.guild.members.unban(bUser.user, reason).catch(err => {
                            console.log(err);
                            return message.channel.send(unban
                                .setColor('RED')
                                .setDescription(`**${emoji.downvote} ${message.author} something went wrong unbanning the id**`))
                        }).then(() => {
                            collector.stop('success')

                            return message.channel.send(unban
                                .setColor('GREEN')
                                .setDescription(`**${emoji.upvote} Succesfully unbanned <@${args[0]}>  \n\nReason: \`${reason}\`**`));
                        }).catch(err => {
                            collector.stop('success');
                            if (err) return message.channel.send(unban.setColor('RED').setDescription(`**${emoji.downvote} Error**`))
                        })
                        break
                        break
                    case "no":
                        message.channel.send(unban.setDescription(`**${emoji.downvote} Cancelled**`).setColor('RED'))
                        collector.stop('success')
                        break
                    case "n":
                        message.channel.send(unban.setDescription(`**${emoji.downvote} Cancelled**`).setColor('RED'))
                        collector.stop('success')
                        break
                    default:
                        message.channel.send(unban.setDescription(`**${emoji.downvote} Cancelled**`).setColor('RED'))
                        collector.stop('success')
                }
                collector.stop('success')
            })
            collector.on('end', (ignore, error) => {
                if (error && error !== "success") {
                    return message.channel.send(unban.setDescription(`**${emoji.downvote} Timed out**`).setColor('RED'))
                };
                collector.stop('success')
            });
        });
    }
}