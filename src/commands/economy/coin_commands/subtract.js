const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const economy = require('../../../../schemas/economy')

const emoji = require('../../../../config/emoji.json')

const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "subtract",
    aliases: ['sub', 'subbalance', 'subbal'],
    category: "Economy",
    description: "Allows the server owner to subtract coins from a users wallet",
    usage: "\`PREFIXsubtract [user] [type of coin] [amount]\`",
    canNotSetCooldown: true,
    serverOwnerOnly: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let mention =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0])

        const Coins = new Discord.MessageEmbed()

        if (!mention) {
            message.reply(Coins.setColor(message.guild.me.displayColor).setDescription(`**Please tag a user to subtract coins from**`))
            return
        }

        const typeOfCoins = args[1].toLowerCase()

        if (!typeOfCoins) {
            message.reply(Coins
                .setColor(message.guild.me.displayColor)
                .setDescription(`**Please provide the type of coin you wish to subtract. \n\nOptions: \`bronzeCoins\`, \`silverCoins\`, \`goldCoins\`**`))
            return
        }

        const coins = args[2]
        if (isNaN(coins) || coins <= 1) {
            message.reply(Coins.setColor(message.guild.me.displayColor).setDescription(`**Please provide a valid number of coins greater than 1**`))
            return
        }

        const userId = mention.id


        let subtractFromBal = async (typeOfCoin, coinName, emojiCoin) => {
            const newCoins = await economy.buyItem(userId, typeOfCoin, coins * -1)

            message.channel.send(`${message.author} **⇒**`, {
                embed: {
                    color: message.guild.me.displayColor,
                    description: `**You have subtracted** \`${coins} ${coinName} coins\` **from ${mention.user.username}**`,
                    fields: {
                        name: `They now have:`,
                        value: `${emojiCoin} \`${newCoins} coins\``
                    }
                }
            })
            // message.channel.send(Coins
            //     .setColor(message.guild.me.displayColor)
            //     .setDescription(`**You have subtracted** \`${coins} ${coinName} coins\` **from ${mention.user.username}**`)
            //     .addField(`They now have:`, `${emojiCoin} \`${newCoins} coins\``))
        }

        if (typeOfCoins === 'bronzecoins' || typeOfCoins === 'bcoins') {
            subtractFromBal('bronzeCoins', 'bronze', emoji.bronzeCoin)

        } else if (typeOfCoins === 'silvercoins' || typeOfCoins === 'scoins') {
            subtractFromBal('silverCoins', 'silver', emoji.silverCoin)

        } else if (typeOfCoins === 'goldcoins' || typeOfCoins === 'gcoins') {
            subtractFromBal('goldCoins', 'gold', emoji.goldCoin)

        } else {
            message.channel.send(Coins
                .setColor(message.guild.me.displayColor)
                .setDescription(`**That is not a valid type of coin!**`))
        }
    }
}