const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const economy = require('../../../../schemas/economy')
const emoji = require('../../../../config/emoji.json')

const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "trade",
    category: "Economy",
    aliases: ["tr", 'gift'],
    description: "Allows you to trade items with a user",
    usage: "\`PREFIXtrade [user] [item] [amount]\`",
    cooldown: 15,
    canNotSetCooldown: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const ITEM = new Discord.MessageEmbed()

        let target =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0])

        if (!target) {
            return message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setDescription(`**Who are you trading with?**`))
        }

        let items = args[1]

        if (!items) {
            return message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setDescription(`**${message.author} what item are you trading?**`))
        }

        let amount = args[2]

        if (!amount) {
            return message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setDescription(`**How many of those are you giving to ${target}?**`))
        }

        if (isNaN(amount)) {
            return message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setDescription(`**Amount must be a number**`))
        }

        if (!Number.isInteger(Number(amount))) {
            return message.channel.send(ITEM.setColor(message.guild.me.displayColor).setDescription(`**The amount must be a whole number**`))
        }

        let userId = message.author.id
        let targetId = target.id

        let tradeItem = async (itemIndex, itemName, itemEmoji) => {
            const authorItem = await economy.getInv(userId, itemIndex)

            if (authorItem < amount) {
                return message.channel.send(ITEM
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**You only have \`${authorItem} ${itemName}(s)\`**`))
            } else {
                const newItemUser = await economy.buyItem(userId, itemIndex, -amount)
                const newItemTarget = await economy.buyItem(targetId, itemIndex, amount)

                message.channel.send(ITEM
                    .setColor(message.guild.me.displayColor)
                    .setAuthor('Trade Success')
                    .setTitle(`${message.author.username} traded with ${target.user.username}`)
                    .addField('You Now Have', `${itemEmoji} \`${newItemUser} ${itemName}(s)\``)
                    .addField('They Now Have', `${itemEmoji} \`${newItemTarget} ${itemName}(s)\``)
                    .setTimestamp())
            }
        }

        setCooldown(client, this, message);

        if (items === 'pole' || items === 'rod' || items === 'fishingpole' || items === 'fishingrod') {
            tradeItem('fishingRod', 'fishing rod', emoji.rod)

        } else if (items === 'fish' || items === 'f') {
            tradeItem('fish', 'fish', emoji.fish)

        } else if (items === 'trident' || items === 'trid') {
            tradeItem('trident', 'trident', emoji.tri)

        } else if (items === 'rifle' || items === 'gun' || items === 'huntingrifle') {
            tradeItem('rifle', 'rifle', emoji.rifle)

        } else if (items === 'pickaxe' || items === 'axe' || items === 'pick') {
            tradeItem('pickaxe', 'pickaxe', emoji.pick)

        } else if (items === 'raccoon' || items === 'rac') {
            tradeItem('raccoon', 'raccoon', emoji.raccoon)

        } else if (items === 'rabbit' || items === 'rab') {
            tradeItem('rabbit', 'rabbit', emoji.rabbit)

        } else if (items === 'goldingot' || items === 'goldi' || items === 'gi') {
            tradeItem('goldIngot', 'gold ingot', emoji.gold)

        } else if (items === 'silveringot' || items === 'silveri' || items === 'si') {
            tradeItem('silverIngot', 'silver ingot', emoji.silver)

        } else if (items === 'bronzekey' || items === 'bkey') {
            tradeItem('bronzeKey', 'bronze key', emoji.bKey)

        } else if (items === 'silverkey' || items === 'skey') {
            tradeItem('silverKey', 'silver key', emoji.sKey)

        } else if (items === 'goldkey' || items === 'gkey') {
            tradeItem('goldKey', 'gold key', emoji.gKey)

        } else if (items === 'bronzelock' || items === 'block') {
            tradeItem('bronzeLock', 'bronze lock', emoji.bLock)

        } else if (items === 'silverlock' || items === 'slock') {
            tradeItem('silverLock', 'silver lock', emoji.sLock)

        } else if (items === 'goldlock' || items === 'glock') {
            tradeItem('goldLock', 'gold lock', emoji.gLock)

        } else if (items === 'trishard' || items === 'tridentshard' || items === 'tris') {
            tradeItem('trishard', 'trident shard', emoji.trishard)

        } else {
            return message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setDescription(`**That item doesnt exist**`))
        }

    }
}
