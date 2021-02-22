const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
// ////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor


const economy = require('../../../../schemas/economy')
const emoji = require('../../../../config/emoji.json')

const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "tradein",
    category: "Economy",
    aliases: ["tradei", 'switch', 'swi'],
    description: "Gives the ability to trade in coins for a higher value",
    usage: `-\`PREFIXtradein\` to see the conversion rates
    -\`PREFIXtradein [type of coin you have] [amount you want to trade in]\` to choose what type to trade in and how many of it`,
    examples: `-\`PREFIXtradein bcoins 2000\``,
    cooldown: 10,
    canNotSetCooldown: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {

        const tradei = new Discord.MessageEmbed()

        let userId = message.author.id

        const level = await economy.getInv(userId, 'level')

        if (level === 0) {
            return message.channel.send(tradei
                .setColor(message.guild.me.displayColor)
                .setDescription(`**You are only level 0 so you cannot trade in coins**`))
        }

        let typeOfCoin = args[0]
        let amount = args[1]

        const x = `\`\`\``

        if (!typeOfCoin) {
            return message.channel.send(tradei
                .setColor(message.guild.me.displayColor)
                .setTitle('Conversion Rates!')
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(x + `css` + `\n[Bronze coins ⇒ Silver coins] \n10 Bronze coins ⇒ 1 Silver coin \n\n[Silver coins ⇒ Gold coins]\n20 silver coins ⇒ 1 Gold coin\n\n[Gold coins ⇒ Bronze coins]\n1 gold coins ⇒ 200 Bronze coins` + x))
        }

        if (!amount) {
            return message.channel.send(tradei
                .setColor(message.guild.me.displayColor)
                .setDescription(`**Specify how many of coins you would like to trade in** `))
        }

        let tradeIn = async (typeOfCoin, emojiCoin, secondTypeOfCoin, divisor, secondEmojiCoin, firstCoinName, secondCoinName) => {
            const Coin = await economy.getInv(userId, typeOfCoin)

            if (Coin < amount) {
                return message.channel.send(tradei
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**You do not have ${emojiCoin} \`${amount} coin(s)\`**`))
            } else {
                setCooldown(client, this, message);

                const newFCoin = await economy.buyItem(userId, typeOfCoin, -amount)
                const newSCoin = await economy.buyItem(userId, secondTypeOfCoin, amount / divisor)

                message.channel.send(tradei
                    .setColor(message.guild.me.displayColor)
                    .setTitle(`Trade In Was A Success!`)
                    .setDescription(`**You traded in ${emojiCoin} \`${amount} coin(s)\` for ${secondEmojiCoin} \`${amount / divisor} coin(s)\`**`)
                    .addField('You Used', `${emojiCoin} \`${amount} coin(s)\``)
                    .addField(`Remaining ${firstCoinName} Coins`, `${emojiCoin} \`${newFCoin} coin(s)\``)
                    .addField('You Gained', `${secondEmojiCoin} \`${amount / divisor} coin(s)\``)
                    .addField(`Total ${secondCoinName} Coins`, `${secondEmojiCoin} \`${newSCoin} coin(s)\``))
            }
        }

        if (typeOfCoin.toLowerCase() === 'bronzecoins' || typeOfCoin.toLowerCase() === 'bcoins') {
            tradeIn('bronzeCoins', emoji.bronzeCoin, 'silverCoins', 10, emoji.silverCoin, 'Bronze', 'Silver')

        } else if (typeOfCoin.toLowerCase() === 'silvercoins' || typeOfCoin.toLowerCase() === 'scoins') {
            tradeIn('silverCoins', emoji.silverCoin, 'goldCoins', 20, emoji.goldCoin, 'Silver', 'Gold')

        } else if (typeOfCoin.toLowerCase() === 'goldcoins' || typeOfCoin.toLowerCase() === 'gcoins') {
            tradeIn('goldCoins', emoji.goldCoin, 'bronzeCoins', 1/200, emoji.bronzeCoin, 'Gold', 'Bronze')

        } else {
            return message.channel.send(tradei
                .setColor(message.guild.me.displayColor)
                .setDescription(`**That is not a valid type of coin**`))
        }

    }
}