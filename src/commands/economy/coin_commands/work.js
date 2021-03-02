const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const economy = require('../../../../schemas/economy')
const emoji = require('../../../../config/emoji.json')

const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "work",
    category: "Economy",
    description: "Work to gain some money",
    cooldown: 3600,
    canNotSetCooldown: true,
    usage: "\`PREFIXwork\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const Coins = new Discord.MessageEmbed()

        const userId = message.author.id
        const level = await economy.getInv(userId, 'level')

        setCooldown(client, this, message);

        let work = async (amount, typeOfCoin, emojiCoin, lowNum, highNum) => {
            let coins = Math.floor((Math.random() * amount) + 1);
            const newCoins = await economy.buyItem(userId, typeOfCoin, coins)

            if (coins <= lowNum) {
                message.channel.send(`${message.author} **⇒**`, {
                    embed: {
                        color: message.guild.me.displayColor,
                        title: `You didn't work hard enough!`,
                        fields: [{
                            name: "You only earned:",
                            value: `${emojiCoin} \`${coins} coins\``
                        },
                        {
                            name: `You now have:`,
                            value: `${emojiCoin} \`${newCoins} coins\``
                        }]
                    }
                })
               
            } else if (coins > lowNum && coins <= highNum) {
                message.channel.send(`${message.author} **⇒**`, {
                    embed: {
                        color: message.guild.me.displayColor,
                        title: `You worked!`,
                        fields: [{
                            name: "You only earned:",
                            value: `${emojiCoin} \`${coins} coins\``
                        },
                        {
                            name: `You now have:`,
                            value: `${emojiCoin} \`${newCoins} coins\``
                        }]
                    }
                })

            } else {
                message.channel.send(`${message.author} **⇒**`, {
                    embed: {
                        color: message.guild.me.displayColor,
                        title: `You worked really hard!`,
                        fields: [{
                            name: "You only earned:",
                            value: `${emojiCoin} \`${coins} coins\``
                        },
                        {
                            name: `You now have:`,
                            value: `${emojiCoin} \`${newCoins} coins\``
                        }]
                    }
                })
            }
        }

        if (level === 0 || level === 1) {
            work(1000, 'bronzeCoins', emoji.bronzeCoin, 350, 700)

        } else if (level === 2) {
            work(3000, 'silverCoins', emoji.silverCoin, 1350, 2300)

        } else if (level >= 3) {
            work(5000, 'goldCoins', emoji.goldCoin, 2350, 3700)

        }

    }
}