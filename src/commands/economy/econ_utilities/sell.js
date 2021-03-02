const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const economy = require('../../../../schemas/economy')

const emoji = require('../../../../config/emoji.json')

const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "sell",
    category: "Economy",
    description: "Sells an item from your inventory",
    usage: "\`PREFIXsell [item]\`",
    cooldown: 10,
    canNotSetCooldown: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const Sell = new Discord.MessageEmbed()

        const userId = message.author.id

        let item = args[0]
        let amount = args[1]

        if (!item) {
            message.channel.send(Sell.setColor(message.guild.me.displayColor).setDescription(`**What are you trying to sell?**`))
            return;
        }


        if (!amount) {
            amount = 1
        }

        if (amount < 1) {
            amount = 1
        }

        if (!Number.isInteger(Number(amount))) {
            return message.channel.send(Sell.setColor(message.guild.me.displayColor).setDescription(`**The amount must be a whole number**`))
        }

        setCooldown(client, this, message);

        let sellItem = async (itemIndex, itemName, typeOfCoin, pricePer, emojiCoin, emojiItem) => {
            const ItemToSell = await economy.getInv(userId, itemIndex)

            if (ItemToSell < amount) {
                message.channel.send(Sell
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**${message.author}, you do not have \`${amount} ${itemName}\`**`))
                return;
            } else {
                const updatedItem = await economy.buyItem(userId, itemIndex, amount * -1)
                const newCoins = await economy.buyItem(userId, typeOfCoin, amount * pricePer)

                message.channel.send(`${message.author} **⇒**`, {
                    embed: {
                        color: message.guild.me.displayColor,
                        description: `**You sold ${amount} ${itemName}(s) for ${emojiCoin} \`${amount * pricePer} coins\`**`,
                        fields: {
                            name: `You now have:`,
                            value: `${emojiItem} ─ \`${updatedItem} ${itemName}(s)\`\n\n${emojiCoin} ─ \`${newCoins} coins\``,
                        },
                        footer: {
                            text: `${message.guild.name}`,
                            iconURL: client.user.displayAvatarURL()
                        }
                    }
                })
            }
        }

        if (item === `fish` || item === `f`) {
            sellItem('fish', 'fish', 'bronzeCoins', 200, emoji.bronzeCoin, '🐟')

        } else if (item === `rod` || item === `pole` || item === 'fishingpole') {
            sellItem('fishingRod', 'fishing rod', 'bronzeCoins', 10000, emoji.bronzeCoin, emoji.rod)

        } else if (item === `trid` || item === `trident`) {
            sellItem('trident', 'trident', 'goldCoins', 500000, emoji.goldCoin, emoji.tri)

        } else if (item === `rifle` || item === `gun` || item === 'huntingrifle') {
            sellItem('rifle', 'rifle', 'bronzeCoins', 10000, emoji.bronzeCoin, emoji.rifle)


        } else if (item === `pickaxe` || item === `axe` || item === `pick`) {
            sellItem('pickaxe', 'pickaxe', 'bronzeCoins', 15000, emoji.bronzeCoin, emoji.pick)

        } else if (item === `raccoon` || item === `rac`) {
            sellItem('raccoon', 'raccoon', 'bronzeCoins', 1000, emoji.bronzeCoin, '🦝')

        } else if (item === `rabbit` || item === `rab`) {
            sellItem('rabbit', 'rabbit', 'bronzeCoins', 500, emoji.bronzeCoin, '🐇')

        } else if (item === `silveringot` || item === `silveri` || item === 'si') {
            sellItem('silverIngot', 'silver ingot', 'bronzeCoins', 2000, emoji.bronzeCoin, emoji.silver)

        } else if (item === `goldingot` || item === `goldi` || item === 'gi') {
            sellItem('goldIngot', 'gold ingot', 'silverCoins', 2000, emoji.silverCoin, emoji.gold)

        } else if (item === `bronzekey` || item === `bkey`) {
            sellItem('bronzeKey', 'bronze key', 'bronzeCoins', 125000, emoji.bronzeCoin, emoji.bKey)

        } else if (item === `silverkey` || item === `skey`) {
            const SilverKey = await economy.getInv(userId, 'silverKey')

            if (SilverKey < amount) {
                message.channel.send(Sell
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**${message.author}, you do not have \`${amount} silver key(s)\`.**`))
                return;
            } else {
                const updatedItem = await economy.buyItem(userId, 'silverKey', amount * -1)
                const newCoins1 = await economy.buyItem(userId, 'bronzeCoins', amount * 225000)
                const newCoins2 = await economy.buyItem(userId, 'silverCoins', amount * 40000)

                message.channel.send(`${message.author} **⇒**`, {
                    embed: {
                        color: message.guild.me.displayColor,
                        description: `**You sold ${amount} silver key(s) for ${emoji.bronzeCoin} \`${amount * 225000} coins\` and ${emoji.silverCoin} \`${amount * 40000} coins\`**`,
                        fields: {
                            name: `You now have:`,
                            value: `${emoji.sKey} ─ \`${updatedItem} silver keys(s)\`
                            \n${emoji.bronzeCoin} ─ \`${newCoins1} coins\`\n${emoji.silverCoin} ─ \`${newCoins2} coins\``,
                        },
                        footer: {
                            text: `${message.guild.name}`,
                            iconURL: client.user.displayAvatarURL()
                        }
                    }
                })


            }
        } else if (item === `goldkey` || item === `gkey`) {
            const GoldKey = await economy.getInv(userId, 'goldKey')

            if (GoldKey < amount) {
                message.channel.send(Sell
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**${message.author}, you do not have \`${amount} gold key(s)\`.**`))
                return;
            } else {
                const updatedItem = await economy.buyItem(userId, 'goldKey', amount * -1)
                const newCoins1 = await economy.buyItem(userId, 'bronzeCoins', amount * 425000)
                const newCoins2 = await economy.buyItem(userId, 'silverCoins', amount * 115000)
                const newCoins3 = await economy.buyItem(userId, 'goldCoins', amount * 40000)

                message.channel.send(`${message.author} **⇒**`, {
                    embed: {
                        color: message.guild.me.displayColor,
                        description: `**You sold ${amount} gold key(s) for ${emoji.bronzeCoin} \`${amount * 425000} coins\`, ${emoji.silverCoin} \`${amount * 115000} coins\` and ${emoji.goldCoin} \`${amount * 40000} coins\`**`,
                        fields: {
                            name: `You now have:`,
                            value:  `${emoji.gKey} ─ \`${updatedItem} gold keys(s)\`
                            \n${emoji.bronzeCoin} ─ \`${newCoins1} coins\`\n${emoji.silverCoin} ─ \`${newCoins2} coins\`\n${emoji.goldCoin} ─ \`${newCoins3} coins\``,
                        },
                        footer: {
                            text: `${message.guild.name}`,
                            iconURL: client.user.displayAvatarURL()
                        }
                    }
                })


            }
        } else if (item === `bronzelock` || item === `block`) {
            sellItem('bronzeLock', 'bronze lock', 'bronzeCoins', 50000, emoji.bronzeCoin, emoji.bLock)

        } else if (item === `silverlock` || item === `slock`) {
            sellItem('silverLock', 'silver lock', 'silverCoins', 50000, emoji.silverCoin, emoji.sLock)
            
        } else if (item === `goldlock` || item === `glock`) {
            sellItem('goldLock', 'gold lock', 'goldCoins', 50000, emoji.goldCoin, emoji.gLock)

        } else if (item === `tridentshard` || item === `trishard` || item === 'tris') {
            sellItem('trishard', 'trident shard', 'goldCoins', 250000, emoji.goldCoin, emoji.trishard)

        } else {
            message.channel.send(Sell
                .setColor(message.guild.me.displayColor)
                .setDescription(`**${message.author} either that item doesnt exist or it cant be sold.**`))
        }
    }
}