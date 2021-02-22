const Discord = require('discord.js')
const waterDROP = new Discord.MessageEmbed()


class Waterdrop {

    constructor(client) {
        (client, {
            name: 'waterdrop',
            group: 'games',
            memberName: 'waterdrop',
            description: 'Starts a waterdrop game',
            userPermissions: ['ADMINISTRATOR'],
        })
    }

    async run(message) {
        let a1 = '⬜'
        let a2 = '⬜'
        let a3 = '⬜'
        let b1 = '⬜'
        let b2 = '⬜'
        let b3 = '⬜'
        let c1 = '⬜'
        let c2 = '⬜'
        let c3 = '⬜'

        const filter = m => m.author.id === message.author.id
        const practice = '🟩🟩🟩🟩🟩\n🟩🟦🟦🟦🟩\n🟩🟦🟦🟦🟩\n🟩🟦🟦🟦🟩\n🟩🟩🟩🟩🟩'
        const level1 = [1, 2, 3, 4]
        const randomIndex = Math.floor(Math.random() * level1.length)
        const level1Random = level1[randomIndex]
        const level2 = [1, 2, 3, 4, 5, 6]
        const randomIndex2 = Math.floor(Math.random() * level2.length)
        const level2Random = level2[randomIndex2]
        const level3 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        const randomIndex3 = Math.floor(Math.random() * level3.length)
        const level3Random = level3[randomIndex3]
        const level4 = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        const randomIndex4 = Math.floor(Math.random() * level4.length)
        const level4Random = level4[randomIndex4]
        let i = 0
        message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle("Please wait 5 seconds as we're setting up the jumps!"))

        const waterdrop = setInterval(() => {
            let d = ''
            let description = ''
            let title = ''
            if (i == 0) {
                a1 = a2 = a3 = b1 = b2 = b3 = c1 = c2 = c3 = '🟦'
            } else if (i == 1) {
                if (level1Random == 1) {
                    a1 = a2 = a3 = b1 = b2 = b3 = '🟦'
                    c1 = c2 = c3 = '⬜'
                } else if (level1Random == 2) {
                    a1 = a2 = b1 = b2 = c1 = c2 = '🟦'
                    a3 = b3 = c3 = '⬜'
                } else if (level1Random == 3) {
                    b1 = b2 = b3 = c1 = c2 = c3 = '🟦'
                    a1 = a2 = a3 = '⬜'
                } else if (level1Random == 4) {
                    a2 = a3 = b2 = b3 = c2 = c2 = '🟦'
                    a1 = b1 = c1 = '⬜'
                }
            } else if (i == 2) {
                if (level2Random == 1) {
                    a1 = a2 = a3 = '🟦'
                    b1 = b2 = b3 = c1 = c2 = c3 = '⬜'
                } else if (level2Random == 2) {
                    b1 = b2 = b3 = '🟦'
                    a1 = a2 = a3 = c1 = c2 = c3 = '⬜'
                } else if (level2Random == 3) {
                    c1 = c2 = c3 = '🟦'
                    a1 = a2 = a3 = b1 = b2 = b3 = '⬜'
                } else if (level2Random == 4) {
                    a1 = b1 = c1 = '🟦'
                    a2 = a3 = b2 = b3 = c2 = c3 = '⬜'
                } else if (level2Random == 5) {
                    a2 = b2 = c2 = '🟦'
                    a1 = b1 = c1 = a3 = b3 = c3 = '⬜'
                } else if (level2Random == 6) {
                    a3 = b3 = c3 = '🟦'
                    a1 = a2 = b1 = b2 = c1 = c2 = '⬜'
                }
            } else if (i == 3) {
                if (level3Random == 1) {
                    a1 = a2 = '🟦'
                    a3 = b1 = b2 = b3 = c1 = c2 = c3 = '⬜'
                } else if (level3Random == 2) {
                    a2 = a3 = '🟦'
                    a1 = b1 = b2 = b3 = c1 = c2 = c3 = '⬜'
                } else if (level3Random == 3) {
                    b1 = b2 = '🟦'
                    a1 = a2 = a3 = b3 = c1 = c2 = c3 = '⬜'
                } else if (level3Random == 4) {
                    b2 = b3 = '🟦'
                    a1 = a2 = a3 = b1 = c1 = c2 = c3 = '⬜'
                } else if (level3Random == 5) {
                    c1 = c2 = '🟦'
                    a1 = a2 = a3 = b1 = b2 = b3 = c3 = '⬜'
                } else if (level3Random == 6) {
                    c2 = c3 = '🟦'
                    a1 = a2 = a3 = b1 = b2 = b3 = c1 = '⬜'
                } else if (level3Random == 7) {
                    a1 = b1 = '🟦'
                    a2 = a3 = b2 = b3 = c1 = c2 = c3 = '⬜'
                } else if (level3Random == 8) {
                    b1 = c1 = '🟦'
                    a1 = a2 = a3 = b2 = b3 = c2 = c3 = '⬜'
                } else if (level3Random == 9) {
                    a2 = b2 = '🟦'
                    a1 = a3 = b1 = b3 = c1 = c2 = c3 = '⬜'
                } else if (level3Random == 10) {
                    b2 = c2 = '🟦'
                    a1 = a2 = a3 = b1 = b3 = c1 = c3 = '⬜'
                } else if (level3Random == 11) {
                    a3 = b3 = '🟦'
                    a1 = a2 = b1 = b2 = c1 = c2 = c2 = '⬜'
                } else if (level3Random == 12) {
                    b3 = c3 = '🟦'
                    a1 = a2 = a3 = b1 = b2 = c1 = c3 = '⬜'
                }
            } else if (i == 4) {
                if (level4Random == 1) {
                    a1 = '🟦'
                    a2 = a3 = b1 = b2 = b3 = c1 = c2 = c3 = '⬜'
                } else if (level4Random == 2) {
                    a2 = '🟦'
                    a1 = a3 = b1 = b2 = b3 = c1 = c2 = c3 = '⬜'
                } else if (level4Random == 3) {
                    a3 = '🟦'
                    a1 = a2 = b1 = b2 = b3 = c1 = c2 = c3 = '⬜'
                } else if (level4Random == 4) {
                    b1 = '🟦'
                    a1 = a2 = a3 = b2 = b3 = c1 = c2 = c3 = '⬜'
                } else if (level4Random == 5) {
                    b2 = '🟦'
                    a1 = a2 = a3 = b1 = b3 = c1 = c2 = c3 = '⬜'
                } else if (level4Random == 6) {
                    b3 = '🟦'
                    a1 = a2 = a3 = b1 = b2 = c1 = c2 = c3 = '⬜'
                } else if (level4Random == 7) {
                    c1 = '🟦'
                    a1 = a2 = a3 = b1 = b2 = b3 = c2 = c3 = '⬜'
                } else if (level4Random == 8) {
                    c2 = '🟦'
                    a1 = a2 = a3 = b1 = b2 = b3 = c1 = c3 = '⬜'
                } else if (level4Random == 9) {
                    c3 = '🟦'
                    a1 = a2 = a3 = b1 = b2 = b3 = c1 = c2 = '⬜'
                }
            }
            const Embed = new Discord.MessageEmbed()
                .setTitle(`Waterdrop! - Round ${i + 1}`)
                .setColor(message.guild.me.displayColor)
                .setDescription(`🧍‍♂️\n🟫\n\n\n\n\n\n🟩🟩🟩🟩🟩\n🟩${a1}${a2}${a3}🟩\n🟩${b1}${b2}${b3}🟩\n🟩${c1}${c2}${c3}🟩\n🟩🟩🟩🟩🟩`)
                .setFooter('You have 5 seconds to jump into the water!\nYou may type "cancel" at any time to stop the game.\n1   2   3 \n4   5   6 \n7   8   9')
            message.channel.send(Embed).then(async message => {
                try {
                    let msg = await message.channel.awaitMessages(filter, {
                        max: 1,
                        time: '5000',
                        errors: ['time']
                    });
                    if (msg.first().content.toLowerCase().trim() === 'cancel') {
                        message.delete()
                        message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle('Cancelled!'))
                        clearInterval(waterdrop)
                    } else {
                        if (msg.first().content.toLowerCase().trim() === '1') {
                            if (a1 === '🟦') {
                                message.delete()
                                if (i != 4) {
                                    message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle('Nice one! Wait for the 5 seconds to be over!'))
                                } else {
                                    message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle('Ayyy, you beat the waterdrop!!'))
                                    clearInterval(waterdrop)
                                }
                            } else {
                                title = 'You lose!'
                                description = 'You missed the water!'
                                a1 = '🟥'
                                clearInterval(waterdrop)
                            }
                        } else if (msg.first().content.toLowerCase().trim() === '2') {
                            if (a2 === '🟦') {
                                message.delete()
                                if (i != 4) {
                                    message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle('Nice one! Wait for the 5 seconds to be over!'))
                                } else {
                                    message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle('Ayyy, you beat the waterdrop!!'))
                                    clearInterval(waterdrop)
                                }
                            } else {
                                title = 'You lose!'
                                description = 'You missed the water!'
                                a2 = '🟥'
                                clearInterval(waterdrop)
                            }
                        } else if (msg.first().content.toLowerCase().trim() === '3') {
                            if (a3 === '🟦') {
                                message.delete()
                                if (i != 4) {
                                    message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle('Nice one! Wait for the 5 seconds to be over!'))
                                } else {
                                    message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle('Ayyy, you beat the waterdrop!!'))
                                    clearInterval(waterdrop)
                                }
                            } else {
                                title = 'You lose!'
                                description = 'You missed the water!'
                                a3 = '🟥'
                                clearInterval(waterdrop)
                            }
                        } else if (msg.first().content.toLowerCase().trim() === '4') {
                            if (b1 === '🟦') {
                                message.delete()
                                if (i != 4) {
                                    message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle('Nice one! Wait for the 5 seconds to be over!'))
                                } else {
                                    message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle('Ayyy, you beat the waterdrop!!'))
                                    clearInterval(waterdrop)
                                }
                            } else {
                                title = 'You lose!'
                                description = 'You missed the water!'
                                b1 = '🟥'
                                clearInterval(waterdrop)
                            }
                        } else if (msg.first().content.toLowerCase().trim() === '5') {
                            if (b2 === '🟦') {
                                message.delete()
                                if (i != 4) {
                                    message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle('Nice one! Wait for the 5 seconds to be over!'))
                                } else {
                                    message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle('Ayyy, you beat the waterdrop!!'))
                                    clearInterval(waterdrop)
                                }
                            } else {
                                title = 'You lose!'
                                description = 'You missed the water!'
                                b2 = '🟥'
                                clearInterval(waterdrop)
                            }
                        } else if (msg.first().content.toLowerCase().trim() === '6') {
                            if (b3 === '🟦') {
                                message.delete()
                                if (i != 4) {
                                    message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle('Nice one! Wait for the 5 seconds to be over!'))
                                } else {
                                    message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle('Ayyy, you beat the waterdrop!!'))
                                    clearInterval(waterdrop)
                                }
                            } else {
                                title = 'You lose!'
                                description = 'You missed the water!'
                                b3 = '🟥'
                                clearInterval(waterdrop)
                            }
                        } else if (msg.first().content.toLowerCase().trim() === '7') {
                            if (c1 === '🟦') {
                                message.delete()
                                if (i != 4) {
                                    message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle('Nice one! Wait for the 5 seconds to be over!'))
                                } else {
                                    message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle('Ayyy, you beat the waterdrop!!'))
                                    clearInterval(waterdrop)
                                }
                            } else {
                                title = 'You lose!'
                                description = 'You missed the water!'
                                c1 = '🟥'
                                clearInterval(waterdrop)
                            }
                        } else if (msg.first().content.toLowerCase().trim() === '8' || msg.first().content.toLowerCase().trim() === '8') {
                            if (c2 === '🟦') {
                                message.delete()
                                if (i != 4) {
                                    message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle('Nice one! Wait for the 5 seconds to be over!'))
                                } else {
                                    message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle('Ayyy, you beat the waterdrop!!'))
                                    clearInterval(waterdrop)
                                }
                            } else {
                                title = 'You lose!'
                                description = 'You missed the water!'
                                c2 = '🟥'
                                clearInterval(waterdrop)
                            }
                        } else if (msg.first().content.toLowerCase().trim() === '9') {
                            if (c3 === '🟦') {
                                message.delete()
                                if (i != 4) {
                                    message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle('Nice one! Wait for the 5 seconds to be over!'))
                                } else {
                                    message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle('Ayyy, you beat the waterdrop!!'))
                                    clearInterval(waterdrop)
                                }
                            } else {
                                title = 'You lose!'
                                description = 'You missed the water!'
                                c2 = '🟥'
                                clearInterval(waterdrop)
                            }
                        } else {
                            message.delete()
                            message.channel.send(waterDROP.setColor(message.guild.me.displayColor).setTitle('Incorrect input, you completely missed the water and died!'))
                            b2 = '🟥'
                            clearInterval(waterdrop)
                        }
                    }
                } catch (ex) {
                    title = 'You lose!'
                    description = "5 seconds have passed, and the host thought you were AFK so he pushed you off, resulting in you completely missing the water. Nice!"
                    b2 = '🟥'
                    clearInterval(waterdrop)
                }
                i++
                if (a1 == '🟥' || a2 == '🟥' || a3 == '🟥' || b1 == '🟥' || b2 == '🟥' || b3 == '🟥' || c1 == '🟥' || c2 == '🟥' || c3 == '🟥' || d == '🟥') {
                    const embedLose = new Discord.MessageEmbed()
                        .setTitle(title)
                        .setDescription(`${description}\n\n\n🟩🟩🟩🟩🟩\n🟩${a1}${a2}${a3}🟩\n🟩${b1}${b2}${b3}🟩\n🟩${c1}${c2}${c3}🟩\n🟩🟩🟩🟩🟩`)
                        .setColor(15158332)
                    message.channel.send(embedLose)
                }
            })
        }, 6000)
    }
}

module.exports = Waterdrop;

const PREFIX = require('../../../config/config.json').PREFIX;
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

module.exports = {
    name: "dropper",
    category: "Games",
    aliases: ["waterdrop", "drop"],
    description: "Starts a game of dropper",
    usage: "\`PREFIXdropper\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const wat = new Waterdrop(client)
        wat.run(message)
    }
}

