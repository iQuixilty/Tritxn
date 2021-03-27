const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const economy = require('../../../../schemas/economy')
const emoji = require('../../../../config/emoji.json')
const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "buy",
    category: "Economy",
    aliases: ["purchase"],
    description: "Buy something from the shop",
    usage: "\`PREFIXbuy [item]\`",
    cooldown: 5,
    canNotSetCooldown: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const ITEM = new Discord.MessageEmbed()
        let guildInfo = client.guildInfoCache.get(message.guild.id)
        let guildPrefix = guildInfo.prefix

        let items = args[0]

        const userId = message.author.id

        let amount = args[1]

        if (!amount) {
            amount = 1
        }

        if (amount < 1) {
            amount = 1
        }

        if (!Number.isInteger(Number(amount))) {
            return message.channel.send(ITEM.setColor(message.guild.me.displayColor).setDescription(`**The amount must be a whole number**`))
        }

        if (!items) {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setDescription(`**You need to mention something to buy. \n\nUse \`${guildPrefix}shop\` to view a list of items**`))
            return
        }


        setCooldown(client, this, message);


        let buyItem = async (typeOfCoin, price, itemName, itemIndex, emojiCoin, emojiItem) => {
            const coinsRN = await economy.getInv(userId, typeOfCoin)

            if (coinsRN < price * amount) {
                message.channel.send(ITEM
                    .setColor(message.guild.me.displayColor)
                    .setTitle(`${message.author.username}, you don't have enough coins to buy this item`)
                    .addField('Amount You Have:', `${emojiCoin} \`${coinsRN} coins\``, true)
                    .addField("Amount Needed", `${emojiCoin} \`${price * amount} coins\``, true)
                    .setFooter(`${itemName}`, client.user.displayAvatarURL()))
                return
            }

            const newCoins = await economy.buyItem(userId, typeOfCoin, -1 * price * amount)
            const newItem = await economy.buyItem(userId, itemIndex, amount)

            message.channel.send(`${message.author} **⇒**`, {
                embed: {
                    color: message.guild.me.displayColor,
                    title: `**You have bought ${emojiItem} \`${amount} ${itemName}(s)\`!**`,
                    fields: {
                        name: `You have:`,
                        value: `${emojiCoin} ─ \`${newCoins} coins\`\n\n${emojiItem} ─ \`${newItem} ${itemName}(s)\``,
                    },
                    footer: {
                        text: `Use ${guildPrefix}shop ${itemName} to see what you can do with it (no spaces)`
                    }
                }
            })
            return
        }

        if (items === 'pole' || items === 'rod' || items === 'fishingpole' || items === 'fishingrod') {
            buyItem('bronzeCoins', 20000, 'fishing rod', 'fishingRod', emoji.bronzeCoin, emoji.rod)

        } else if (items === 'trident' || items === 'trid') {
            buyItem('goldCoins', 1000000, 'trident', 'trident', emoji.goldCoin, emoji.tri)

        } else if (items === 'rifle' || items === 'gun' || items === 'huntingrifle') {
            buyItem('bronzeCoins', 20000, 'rifle', 'rifle', emoji.bronzeCoin, emoji.rifle)

        } else if (items === 'pickaxe' || items === 'axe' || items === 'pick') {
            buyItem('bronzeCoins', 30000, 'pickaxe', 'pickaxe', emoji.bronzeCoin, emoji.pick)

        } else if (items === 'bronzelock' || items === 'block') {
            buyItem('bronzeCoins', 100000, 'bronze lock', 'bronzeLock', emoji.bronzeCoin, emoji.bLock)

        } else if (items === 'silverlock' || items === 'slock') {
            buyItem('silverCoins', 100000, 'silver lock', 'silverLock', emoji.silverCoin, emoji.sLock)

        } else if (items === 'goldlock' || items === 'glock') {
            buyItem('goldCoins', 100000, 'gold lock', 'goldLock', emoji.goldCoin, emoji.gLock)

        } else {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setDescription(`**${message.author} either you can't buy this item or it doesnt exist!**`))
        }

    }
}