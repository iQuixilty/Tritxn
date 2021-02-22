const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const midDuel = new Set()

module.exports = {
    name: "tictactoe",
    category: "Games",
    aliases: ["ttt"],
    description: "Starts a game of tictactoe against a user",
    usage: "\`PREFIXtictactoe [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const tttE = new Discord.MessageEmbed()

        const author = message.author.id
        const authorName = message.author.username

        let member = message.mentions.members.first()



        if (!member) {
            return message.channel.send(tttE.setColor(message.guild.me.displayColor).setTitle('Mention a user idiot...'))
        }
        if (member.id === author) {
            return message.channel.send(tttE.setColor(message.guild.me.displayColor).setTitle('Why would you play yourself...'))
        }

        if (midDuel.has(author)) {
            return message.channel.send(tttE.setColor(message.guild.me.displayColor).setTitle(`Stop trying to weasel your way out of the game`))
        } else if (midDuel.has(member.id)) {
            return message.channel.send(tttE.setColor(message.guild.me.displayColor).setTitle(`Leave <@${member.id}> alone, they're in a game!`))
        }

        if (member.id === message.client.user.id) {
            return message.channel.send(tttE.setColor(message.guild.me.displayColor).setTitle("As much as I want to beat you, I'll have to pass."))
        }

        let memberName = member.user.username


        midDuel.add(author)
        midDuel.add(member.id)

        let turnName
        let a1 = '⬜'
        let a2 = '⬜'
        let a3 = '⬜'
        let b1 = '⬜'
        let b2 = '⬜'
        let b3 = '⬜'
        let c1 = '⬜'
        let c2 = '⬜'
        let c3 = '⬜'
        let xCircle;
        let winner;

        const Embed = new Discord.MessageEmbed()
            .setTitle('Tic Tac Toe')
            .setDescription(`🎮 **${authorName}** VS ${memberName} 🎮\n\n🟦🟦🟦🟦🟦\n🟦${a1}${a2}${a3}🟦\n🟦${b1}${b2}${b3}🟦\n🟦${c1}${c2}${c3}🟦\n🟦🟦🟦🟦🟦`)
            .setFooter('You have 10 seconds to reply with your next move!\nYou may type "cancel" at any time to stop the game.\n1   2   3 \n4   5   6 \n7   8   9')
            .setColor(message.guild.me.displayColor)
        message.channel.send(`<@${author}>`, Embed).then(async message => {
            for (i = 0; i < 9; i++) {
                if (i % 2 == 0) {
                    turnName = author
                    xCircle = '❌'
                    winner = `<@${author}>`
                } else if (i % 2 > 0) {
                    turnName = member.id
                    xCircle = '🔴'
                    winner = `<@${member.id}>`
                }
                // console.log(turnName)
                const filter = m => m.author.id === turnName
                try {
                    msg = await message.channel.awaitMessages(filter, {
                        max: 1,
                        time: '20000',
                        errors: ['time']
                    })
                    if (msg.first().content.toLowerCase().trim() === 'cancel') {
                        message.channel.send(tttE.setColor(message.guild.me.displayColor).setTitle('Too scared huh..'))
                        midDuel.delete(author)
                        midDuel.delete(member.id)
                        break
                    } else {
                        if (msg.first().content.toLowerCase().trim() === '1') {
                            if (a1 == '🔴' || a1 == '❌') {
                                message.channel.send(tttE.setColor(message.guild.me.displayColor).setTitle('That spot is already occupied.. and now you lost lmao'))
                                midDuel.delete(author)
                                midDuel.delete(member.id)
                                break
                            } else {
                                a1 = xCircle
                            }
                        } else if (msg.first().content.toLowerCase().trim() === '2') {
                            if (a2 == '🔴' || a2 == '❌') {
                                message.channel.send(tttE.setColor(message.guild.me.displayColor).setTitle('That spot is already occupied.. and now you lost lmao'))
                                midDuel.delete(author)
                                midDuel.delete(member.id)
                                break
                            } else {
                                a2 = xCircle
                            }
                        } else if (msg.first().content.toLowerCase().trim() === '3') {
                            if (a3 == '🔴' || a3 == '❌') {
                                message.channel.send(tttE.setColor(message.guild.me.displayColor).setTitle('That spot is already occupied.. and now you lost lmao'))
                                midDuel.delete(author)
                                midDuel.delete(member.id)
                                break
                            } else {
                                a3 = xCircle
                            }
                        } else if (msg.first().content.toLowerCase().trim() === '4') {
                            if (b1 == '🔴' || b1 == '❌') {
                                message.channel.send(tttE.setColor(message.guild.me.displayColor).setTitle('That spot is already occupied.. and now you lost lmao'))
                                midDuel.delete(author)
                                midDuel.delete(member.id)
                                break
                            } else {
                                b1 = xCircle
                            }
                        } else if (msg.first().content.toLowerCase().trim() === '5') {
                            if (b2 == '🔴' || b2 == '❌') {
                                message.channel.send(tttE.setColor(message.guild.me.displayColor).setTitle('That spot is already occupied.. and now you lost lmao'))
                                midDuel.delete(author)
                                midDuel.delete(member.id)
                                break
                            } else {
                                b2 = xCircle
                            }
                        } else if (msg.first().content.toLowerCase().trim() === '6') {
                            if (b3 == '🔴' || b3 == '❌') {
                                message.channel.send(tttE.setColor(message.guild.me.displayColor).setTitle('That spot is already occupied.. and now you lost lmao'))
                                midDuel.delete(author)
                                midDuel.delete(member.id)
                                break
                            } else {
                                b3 = xCircle
                            }
                        } else if (msg.first().content.toLowerCase().trim() === '7') {
                            if (c1 == '🔴' || c1 == '❌') {
                                message.channel.send(tttE.setColor(message.guild.me.displayColor).setTitle('That spot is already occupied.. and now you lost lmao'))
                                midDuel.delete(author)
                                midDuel.delete(member.id)
                                break
                            } else {
                                c1 = xCircle
                            }
                        } else if (msg.first().content.toLowerCase().trim() === '8') {
                            if (c2 == '🔴' || c2 == '❌') {
                                message.channel.send(tttE.setColor(message.guild.me.displayColor).setTitle('That spot is already occupied.. and now you lost lmao'))
                                midDuel.delete(author)
                                midDuel.delete(member.id)
                                break
                            } else {
                                c2 = xCircle
                            }
                        } else if (msg.first().content.toLowerCase().trim() === '9') {
                            if (c3 == '🔴' || c3 == '❌') {
                                message.channel.send(tttE.setColor(message.guild.me.displayColor).setTitle('That spot is already occupied.. and now you lost lol'))
                                midDuel.delete(author)
                                midDuel.delete(member.id)
                                break
                            } else {
                                c3 = xCircle
                            }
                        } else {
                            message.channel.send(tttE.setColor(message.guild.me.displayColor).setTitle('Incorrect input, you lost.'))
                            midDuel.delete(author)
                            midDuel.delete(member.id)
                            break
                        }
                    }
                    msg.first().delete()
                } catch (ex) {
                    message.channel.send(tttE.setColor(message.guild.me.displayColor).setDescription(`<@${turnName}> took too long to respond, and now they lost. Nice job!`))
                    midDuel.delete(author)
                    midDuel.delete(member.id)
                    break
                }
                if (i % 2 == 0) {
                    const updatedEmbed = new Discord.MessageEmbed()
                        .setTitle('Tic Tac Toe')
                        .setDescription(`🎮 ${authorName} VS **${memberName}** 🎮\n\n🟦🟦🟦🟦🟦\n🟦${a1}${a2}${a3}🟦\n🟦${b1}${b2}${b3}🟦\n🟦${c1}${c2}${c3}🟦\n🟦🟦🟦🟦🟦`)
                        .setFooter('You have 10 seconds to reply with your next move!\nYou may type "cancel" at any time to stop the game.\n1   2   3 \n4   5   6 \n7   8   9')
                        .setColor(message.guild.me.displayColor)
                    message.edit(updatedEmbed)
                } else if (i % 2 > 0) {
                    const updatedEmbed = new Discord.MessageEmbed()
                        .setTitle('Tic Tac Toe')
                        .setDescription(`🎮 **${authorName}** VS ${memberName} 🎮\n\n🟦🟦🟦🟦🟦\n🟦${a1}${a2}${a3}🟦\n🟦${b1}${b2}${b3}🟦\n🟦${c1}${c2}${c3}🟦\n🟦🟦🟦🟦🟦`)
                        .setFooter('You have 10 seconds to reply with your next move!\nYou may type "cancel" at any time to stop the game.\n1   2   3 \n4   5   6 \n7   8   9')
                        .setColor(message.guild.me.displayColor)
                    message.edit(updatedEmbed)
                }
                if (a1 == '❌' && b1 == '❌' && c1 == '❌' || a1 == '🔴' && b1 == '🔴' && c1 == '🔴') {
                    message.channel.send(tttE.setColor(message.guild.me.displayColor).setDescription(`${winner} wins!`))
                    midDuel.delete(author)
                    midDuel.delete(member.id)
                    break
                } else if (a2 == '❌' && b2 == '❌' && c2 == '❌' || a2 == '🔴' && b2 == '🔴' && c2 == '🔴') {
                    message.channel.send(tttE.setColor(message.guild.me.displayColor).setDescription(`${winner} wins!`))
                    midDuel.delete(author)
                    midDuel.delete(member.id)
                    break
                } else if (a3 == '❌' && b3 == '❌' && c3 == '❌' || a3 == '🔴' && b3 == '🔴' && c3 == '🔴') {
                    message.channel.send(tttE.setColor(message.guild.me.displayColor).setDescription(`${winner} wins!`))
                    midDuel.delete(author)
                    midDuel.delete(member.id)
                    break
                } else if (a1 == '❌' && a2 == '❌' && a3 == '❌' || a1 == '🔴' && a2 == '🔴' && a3 == '🔴') {
                    message.channel.send(tttE.setColor(message.guild.me.displayColor).setDescription(`${winner} wins!`))
                    midDuel.delete(author)
                    midDuel.delete(member.id)
                    break
                } else if (b1 == '❌' && b2 == '❌' && b3 == '❌' || b1 == '🔴' && b2 == '🔴' && b3 == '🔴') {
                    message.channel.send(tttE.setColor(message.guild.me.displayColor).setDescription(`${winner} wins!`))
                    midDuel.delete(author)
                    midDuel.delete(member.id)
                    break
                } else if (c1 == '❌' && c2 == '❌' && c3 == '❌' || c1 == '🔴' && c2 == '🔴' && c3 == '🔴') {
                    message.channel.send(tttE.setColor(message.guild.me.displayColor).setDescription(`${winner} wins!`))
                    midDuel.delete(author)
                    midDuel.delete(member.id)
                    break
                } else if (a1 == '❌' && b2 == '❌' && c3 == '❌' || a1 == '🔴' && b2 == '🔴' && c3 == '🔴') {
                    message.channel.send(tttE.setColor(message.guild.me.displayColor).setDescription(`${winner} wins!`))
                    midDuel.delete(author)
                    midDuel.delete(member.id)
                    break
                } else if (a3 == '❌' && b2 == '❌' && c1 == '❌' || a3 == '🔴' && b2 == '🔴' && c1 == '🔴') {
                    message.channel.send(tttE.setColor(message.guild.me.displayColor).setDescription(`${winner} wins!`))
                    midDuel.delete(author)
                    midDuel.delete(member.id)
                    break
                } else if (i == 8) {
                    message.channel.send(tttE.setColor(message.guild.me.displayColor).setTitle("It's a tie!"))
                    midDuel.delete(author)
                    midDuel.delete(member.id)
                    break
                }
            }
        })

    }
}