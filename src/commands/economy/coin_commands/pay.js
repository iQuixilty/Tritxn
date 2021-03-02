const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const economy = require('../../../../schemas/economy')

const emoji = require('../../../../config/emoji.json')

const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "pay",
    category: "Economy",
    aliases: ["give", 'share'],
    description: "Gives coins to a user (within your wallet)",
    usage: "\`PREFIXpay [user] [type of coin] [amount]\`",
    cooldown: 5,
    canNotSetCooldown: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const { member } = message

        const Coins = new Discord.MessageEmbed()

        let target =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0])

        if (!target) {
            message.reply(Coins.setColor(message.guild.me.displayColor).setDescription(`**Please specify someone to give coins to**`))
            return
        }

        const typeOfCoins = args[1].toLowerCase()
        if (!typeOfCoins) {
            message.reply(Coins.setColor(message.guild.me.displayColor).setDescription(`**Please provide a type of coin to give.  \n\nOptions: \`bronzeCoins\`, \`silverCoins\`, \`goldCoins\`**`))
            return
        }


        const coinsToGive = args[2]
        if (isNaN(coinsToGive) || coinsToGive <= 0) {
            message.reply(Coins.setColor(message.guild.me.displayColor).setDescription(`**Please provide a valid number of coins to give greater than 0**`))
            return
        }


        let pay = async (typeOfCoin, emojiCoin) => {
            const coinsOwned = await economy.getInv(member.id, typeOfCoin)
            if (coinsOwned < coinsToGive) {
                message.reply(Coins.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, you do not have ${emojiCoin} \`${coinsToGive} coins\`!**  \n\nYou only have ${emojiCoin} \`${coinsOwned} coin(s)\``))
                return
            }

            setCooldown(client, this, message);

            const remainingCoins = await economy.buyItem(member.id, typeOfCoin, coinsToGive * -1)

            const newBalance = await economy.buyItem(target.id, typeOfCoin, coinsToGive)
            message.channel.send(`${message.author} **⇒**`, {
                embed: {
                    color: message.guild.me.displayColor,
                    title: `**You have given ${target.user.username} \`${coinsToGive} coins\`!**`,
                    fields: [{
                        name: `They now have:`,
                        value: `${emojiCoin} \`${newBalance} coins\``,
                    },
                    {
                        name: `You have:`,
                        value: `${emojiCoin} \`${remainingCoins} coins\``
                    }]
                }
            })
        }


        if (typeOfCoins === 'bronzecoins' || typeOfCoins === 'bcoins') {
            pay('bronzeCoins', emoji.bronzeCoin)

        } else if (typeOfCoins === 'silvercoins' || typeOfCoins === 'scoins') {
            pay('silverCoins', emoji.silverCoin)

        } else if (typeOfCoins === 'goldcoins' || typeOfCoins === 'gcoins') {
            pay('goldCoins', emoji.goldCoin)

        } else {
            message.channel.send(Coins
                .setColor(message.guild.me.displayColor)
                .setDescription(`**Thats not a valid type of coin!**`))
        }

    }

}