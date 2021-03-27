const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const economy = require('../../../../schemas/economy')
const emoji = require('../../../../config/emoji.json')

const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "diceroll",
    category: "Economy",
    aliases: ['roll', 'bet'],
    description: "Rolls 2 die, 2 each for player and bot, higher one wins the bet",
    cooldown: 5,
    examples: "\`PREFIXbet bcoins 500\`",
    canNotSetCooldown: true,
    usage: "\`PREFIXdiceroll [type of coin] [amount]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const DR = new Discord.MessageEmbed()

        const userId = message.author.id

        let typeOfCoin = args[0]
        let bet = args[1]

        if (!typeOfCoin) {
            return message.channel.send(DR.setColor(message.guild.me.displayColor).setDescription(`**You need to provide what type of coin you are going to bet**`))
        }

        if (!bet) {
            return message.channel.send(DR.setColor(message.guild.me.displayColor).setDescription(`**You need to actually bet something**`))
        }

        if (bet < 500) {
            return message.channel.send(DR.setColor(message.guild.me.displayColor).setDescription(`**You need to actually bet something greater than 500**`))
        }

        if (bet > 1000000) {
            return message.channel.send(DR.setColor(message.guild.me.displayColor).setDescription(`**You cannot bet more than 1000000 coins**`))
        }


        let diceroll = async (typeOfCoin, nameOfCoin, emojiOfCoin) => {
            const typeOfC = await economy.getInv(userId, typeOfCoin)

            if (isNaN(bet)) {
                if (bet.toLowerCase() === 'all' || bet.toLowerCase() === 'max') {
                    if (typeOfC > 1000000) {
                        bet = 1000000
                    } else {
                        bet = typeOfC
                    }
                } else if (bet.toLowerCase() === 'half') {
                    bet = Math.round(typeOfC / 2)
                } else {
                    return message.channel.send(DR.setColor(message.guild.me.displayColor).setDescription(`**You have to bet an actual amount of coins**`))
                }
            }

            if (!Number.isInteger(Number(bet))) {
                return message.channel.send(DR.setColor(message.guild.me.displayColor).setDescription(`**Your bet must be a whole number... no decimals**`))
            }

            if (typeOfC === 0) {
                return message.channel.send(DR.setColor(message.guild.me.displayColor).setDescription(`**You have no ${nameOfCoin} coins**`))
            }

            if (bet > typeOfC) {
                return message.channel.send(DR
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**${message.author} you only have ${emojiOfCoin} \`${typeOfC} coins\`**`))
            }

            let randomNum = Math.floor(Math.random() * 8) + 1
            let userDR1 = getRandomInt(7)
            let userDR2 = getRandomInt(7)
            let botDR1 = getRandomInt(7)
            let botDR2 = getRandomInt(7)

            let totalUserScore = userDR1 + userDR2
            let totalBotScore = botDR1 + botDR2

            setCooldown(client, this, message);

            if (totalUserScore === totalBotScore) {
                let winAmount = Math.random() + 0.6
                let winnings = Math.round(bet * winAmount)

                const newUserCoins = await economy.buyItem(userId, typeOfCoin, winnings)
                await economy.buyItem(userId, 'XP', randomNum)

                return message.channel.send(DR
                    .setColor('GREEN')
                    .setAuthor(`${message.author.username} Won!`, message.author.displayAvatarURL())
                    .setDescription(`You won ${emojiOfCoin} **\`${winnings.toLocaleString()} coins\`**\n\n**Percent of Bet Won:** \`${winAmount.toFixed(2) * 100}%\`\n**You Now Have:** ${emojiOfCoin} \`${newUserCoins} coins\``)
                    .addField(`You Rolled`, `${totalUserScore} \`🎲\``, true)
                    .addField(`I Rolled`, `${totalBotScore} \`🎲\``, true))
            }

            if (totalUserScore > totalBotScore) {
                let winAmount = Math.random() + 0.3
                let winnings = Math.round(bet * winAmount)
                await economy.buyItem(userId, 'XP', randomNum)

                if (winnings === bet) {
                    return message.channel.send(DR.setColor(message.guild.me.displayColor).setDescription(`**Congrats, you made 0 coins**`))
                }

                const newUserCoins = await economy.buyItem(userId, typeOfCoin, winnings)

                return message.channel.send(DR
                    .setColor("GREEN")
                    .setAuthor(`${message.author.username} Won!`, message.author.displayAvatarURL())
                    .setDescription(`You won ${emojiOfCoin} **\`${winnings.toLocaleString()} coins\`**\n\n**Percent of Bet Won:** \`${winAmount.toFixed(2) * 100}%\`\n**You Now Have:** ${emojiOfCoin} \`${newUserCoins} coins\``)
                    .addField(`You Rolled`, `${totalUserScore} \`🎲\``, true)
                    .addField(`I Rolled`, `${totalBotScore} \`🎲\``, true))
            } else {
                const newUserCoins = await economy.buyItem(userId, typeOfCoin, -bet)
                await economy.buyItem(userId, 'XP', randomNum)

                return message.channel.send(DR
                    .setColor('RED')
                    .setAuthor(`${message.author.username} Lost!`, message.author.displayAvatarURL())
                    .setDescription(`Unfortunate, you lost ${emojiOfCoin} **\`${Number(bet).toLocaleString()} coins\`**\n\n**You Now Have:** ${emojiOfCoin} \`${newUserCoins} coins\``)
                    .addField(`You Rolled`, `${totalUserScore} \`🎲\``, true)
                    .addField(`I Rolled`, `${totalBotScore} \`🎲\``, true))
            }
        }

        if (typeOfCoin.toLowerCase() === 'bronzecoins' || typeOfCoin.toLowerCase() === 'bcoins') {
            diceroll('bronzeCoins', 'bronze', emoji.bronzeCoin)

        } else if (typeOfCoin.toLowerCase() === 'silvercoins' || typeOfCoin.toLowerCase() === 'scoins') {
            diceroll('silverCoins', 'silver', emoji.silverCoin)

        } else if (typeOfCoin.toLowerCase() === 'goldcoins' || typeOfCoin.toLowerCase() === 'gcoins') {
            diceroll('goldCoins', 'gold', emoji.goldCoin)

        }

    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
