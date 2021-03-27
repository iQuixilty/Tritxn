const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const economy = require('../../../../schemas/economy')
const emoji = require('../../../../config/emoji.json')

const { setSavedCooldown } = require('../../../utils/utils')

module.exports = {
    name: "daily",
    category: "Economy",
    description: "Adds your daily amount of coins",
    savedCooldown: 86400,
    canNotSetCooldown: true,
    usage: "\`PREFIXdaily\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const Coins = new Discord.MessageEmbed()
        setSavedCooldown(client, this, message)
        const userId = message.author.id

        const level = await economy.getInv(userId, 'level')

        if (level === 0 || level === 1) {
            let bCoins = Math.floor((Math.random() * 5000) + 1);
            const newBCoins = await economy.buyItem(userId, 'bronzeCoins', bCoins)

            message.channel.send(`${message.author} **⇒**`, {
                embed: {
                    color: message.guild.me.displayColor,
                    title: `Daily Coins!`,
                    fields: [{
                        name: "You earned:",
                        value: `${emoji.bronzeCoin} \`${bCoins} coins\``
                    },
                    {
                        name: `You now have:`,
                        value: `${emoji.bronzeCoin} \`${newBCoins} coins\``
                    }],

                }
            })

        } else if (level === 2) {
            let sCoins = Math.floor((Math.random() * 3000) + 1);
            const newSCoins = await economy.buyItem(userId, 'silverCoins', sCoins)

            message.channel.send(`${message.author} **⇒**`, {
                embed: {
                    color: message.guild.me.displayColor,
                    title: `Daily Coins!`,
                    fields: [{
                        name: "You earned:",
                        value: `${emoji.silverCoin} \`${sCoins} coins\``
                    },
                    {
                        name: `You now have:`,
                        value: `${emoji.silverCoin} \`${newSCoins} coins\``
                    }],

                }
            })

        } else if (level >= 3) {
            let gCoins = Math.floor((Math.random() * 1000) + 1);
            const newGCoins = await economy.buyItem(userId, 'goldCoins', gCoins)

            message.channel.send(`${message.author} **⇒**`, {
                embed: {
                    color: message.guild.me.displayColor,
                    title: `Daily Coins!`,
                    fields: [{
                        name: "You earned:",
                        value: `${emoji.goldCoin} \`${gCoins} coins\``
                    },
                    {
                        name: `You now have:`,
                        value: `${emoji.goldCoin} \`${newGCoins} coins\``
                    }],

                }
            })

        }

    }
}