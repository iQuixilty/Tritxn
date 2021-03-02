const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const economy = require('../../../../schemas/economy')
const emoji = require('../../../../config/emoji.json')

module.exports = {
    name: "add",
    aliases: ['addbal', 'addbalance'],
    category: "Economy",
    serverOwnerOnly: true,
    canNotSetCooldown: true,
    description: "Allows the server owner to add coins to a users wallet",
    usage: "\`PREFIXadd [user] [type of coin] [amount]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let mention =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0])

        const Coins = new Discord.MessageEmbed()

        if (!mention) {
            message.reply(Coins.setColor(message.guild.me.displayColor).setDescription(`**Please tag a user to add coins to**`))
            return
        }

        const typeOfCoins = args[1].toLowerCase()

        if (!typeOfCoins) {
            message.reply(Coins
                .setColor(message.guild.me.displayColor)
                .setDescription(`**Please provide the type of coin you wish to add. \n\nOptions: \`bronzeCoins\`, \`silverCoins\`, \`goldCoins\`**`))
            return
        }

        const coins = args[2]
        if (isNaN(coins) || coins <= 1) {
            message.reply(Coins.setColor(message.guild.me.displayColor).setDescription(`**Please provide a valid number of coins greater than 1**`))
            return
        }

        const userId = mention.id

        let addToBal = async (typeOfCoin, coinName, emojiCoin) => {
            const newCoins = await economy.buyItem(userId, typeOfCoin, coins)
            message.channel.send(`${message.author} **⇒**`, {
                embed: {
                    color: message.guild.me.displayColor,
                    description: `**You have given ${mention.user.username}** \`${coins} ${coinName} coins\``, 
                    fields: {
                        name: `They now have:`,
                        value: `${emojiCoin} \`${newCoins} coins\``
                    }
                }
            })
            // message.channel.send(Coins
            //     .setColor(message.guild.me.displayColor)
            //     .setDescription(`**You have given ${mention.user.username}** \`${coins} ${coinName} coins\``)
            //     .addField(`They now have:`, `${emojiCoin} \`${newCoins} coins\``))
        }


        if (typeOfCoins === 'bronzecoins' || typeOfCoins === 'bcoins') {
            addToBal('bronzeCoins', 'bronze', emoji.bronzeCoin)

        } else if (typeOfCoins === 'silvercoins' || typeOfCoins === 'scoins') {
            addToBal('silverCoins', 'silver', emoji.silverCoin)

        } else if (typeOfCoins === 'goldcoins' || typeOfCoins === 'gcoins') {
            addToBal('goldCoins', 'gold', emoji.goldCoin)

        } else {
            message.channel.send(Coins
                .setColor(message.guild.me.displayColor)
                .setDescription(`**That is not a valid type of coin!**`))
        }

    }
}

