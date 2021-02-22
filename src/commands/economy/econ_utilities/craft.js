const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const economy = require('../../../../schemas/economy')
const emoji = require('../../../../config/emoji.json')
const mongo = require('../../../../schemas/mongo')

const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "craft",
    category: "Economy",
    aliases: ['make'],
    description: "Allows you to craft items",
    usage: "\`PREFIXcraft [item]\`",
    cooldown: 75,
    canNotSetCooldown: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const craft = new Discord.MessageEmbed()
        let userId = message.author.id

        const guildInfo = client.guildInfoCache.get(message.guild.id)

        let item = args[0]
        let amount = args[1]

        if (!item) {
            return message.channel.send(craft
                .setColor(message.guild.me.displayColor)
                .setDescription(`**${message.author} what are you trying to craft? Do \`${guildInfo.prefix}recipes\` to see all craftable items.**`))
        }

        if (amount < 1) {
            amount = 1
        }

        if (!amount) {
            amount = 1
        }


        if (item === 'bronzekey' || item === 'bkey') {
            const BronzeCoins = await economy.getInv(userId, 'bronzeCoins')
            const SilvIngot = await economy.getInv(userId, 'silverIngot')
            const GoldIngot = await economy.getInv(userId, 'goldIngot')
            const XP = await economy.getInv(userId, 'XP')

            if (BronzeCoins < amount * 100000 || SilvIngot < amount * 10 || GoldIngot < amount * 3 || XP < 100) {
                message.channel.send(craft
                    .setColor(message.guild.me.displayColor)
                    .setTitle(`Insufficent Materials`)
                    .setDescription(`**${message.author} you do not have enough materials to craft \`${amount} bronze key(s)\`**`)
                    .addField('Items Needed', `${emoji.bronzeCoin} ─ \`${amount * 100000} coins\`\n${emoji.silver} ─ \`${amount * 10} silver ingots\`\n${emoji.gold} ─ \`${amount * 3} gold ingots\`\n⭐ ─ \`100 XP\``, true)
                    .addField('Items You Have', `${emoji.bronzeCoin} ─ \`${BronzeCoins} coins\`\n${emoji.silver} ─ \`${SilvIngot} silver ingots\`\n${emoji.gold} ─ \`${GoldIngot} gold ingots\`\n⭐ ─ \`${XP} XP\``, true))
            } else {
                const bronzeCoins = await economy.buyItem(userId, 'bronzeCoins', amount * -100000)
                const silvIngot = await economy.buyItem(userId, 'silverIngot', amount * -10)
                const goldIngot = await economy.buyItem(userId, 'goldIngot', amount * -3)

                const bronzeKey = await economy.buyItem(userId, 'bronzeKey', amount)

                setCooldown(client, this, message);

                message.channel.send(craft
                    .setColor(message.guild.me.displayColor)
                    .setTitle('Successfully Crafted A Bronze Key')
                    .setDescription(`${message.author} **you crafted a bronze key and can now use it on a bronze lock to get to level 1**`)
                    .addField('Items You Used', `${emoji.bronzeCoin} ─ \`${amount * 100000} coins\`\n${emoji.silver} ─ \`${amount * 10} silver ingots\`\n${emoji.gold} ─ \`${amount * 3} gold ingots\``, true)
                    .addField('Items You Have Left', `${emoji.bronzeCoin} ─ \`${bronzeCoins} coins\`\n${emoji.silver} ─ \`${silvIngot} silver ingots\`\n${emoji.gold} ─ \`${goldIngot} gold ingots\``, true)
                    .addField('What You Gained', `${emoji.bKey} ─ \`${amount} bronze key(s)\``))
            }
        } else if (item === 'silverkey' || item === 'skey') {
            const BronzeCoins = await economy.getInv(userId, 'bronzeCoins')
            const SilverCoins = await economy.getInv(userId, 'silverCoins')
            const SilvIngot = await economy.getInv(userId, 'silverIngot')
            const GoldIngot = await economy.getInv(userId, 'goldIngot')
            const XP = await economy.getInv(userId, 'XP')


            if (BronzeCoins < amount * 200000 || SilvIngot < amount * 20 || GoldIngot < amount * 6 || SilverCoins < amount * 50000 || XP < 300) {
                message.channel.send(craft
                    .setColor(message.guild.me.displayColor)
                    .setTitle(`Insufficent Materials`)
                    .setDescription(`${message.author} **you do not have enough materials to craft \`${amount} silver key(s)\`**`)
                    .addField('Items Needed', `${emoji.bronzeCoin} ─ \`${amount * 200000} coins\`\n${emoji.silverCoin} ─ \`${amount * 50000} coins\`\n${emoji.silver} ─ \`${amount * 20} silver ingots\`\n${emoji.gold} ─ \`${amount * 6} gold ingots\`\n⭐ ─ \`300 XP\``, true)
                    .addField('Items You Have', `${emoji.bronzeCoin} ─ \`${BronzeCoins} coins\`\n${emoji.silverCoin} ─ \`${SilverCoins} coins\`\n${emoji.silver} ─ \`${SilvIngot} silver ingots\`\n${emoji.gold} ─ \`${GoldIngot} gold ingots\`\n⭐ ─ \`${XP} XP\``, true))
            } else {
                const bronzeCoins = await economy.buyItem(userId, 'bronzeCoins', amount * -200000)
                const silverCoins = await economy.buyItem(userId, 'silverCoins', amount * -50000)
                const silvIngot = await economy.buyItem(userId, 'silverIngot', amount * -20)
                const goldIngot = await economy.buyItem(userId, 'goldIngot', amount * -6)

                const silverKey = await economy.buyItem(userId, 'silverKey', amount)

                setCooldown(client, this, message);

                message.channel.send(craft
                    .setColor(message.guild.me.displayColor)
                    .setTitle('Successfully Crafted A Silver Key')
                    .setDescription(`${message.author} **you crafted a silver key and can now use it on a silver lock to get to level 2**`)
                    .addField('Items You Used', `${emoji.bronzeCoin} ─ \`${amount * 200000} coins\`\n${emoji.silverCoin} ─ \`${amount * 50000} coins\`\n${emoji.silver} ─ \`${amount * 20} silver ingots\`\n${emoji.gold} ─ \`${amount * 6} gold ingots\``, true)
                    .addField('Items You Have Left', `${emoji.bronzeCoin} ─ \`${bronzeCoins} coins\`\n${emoji.silverCoin} ─ \`${silverCoins} coins\`\n${emoji.silver} ─ \`${silvIngot} silver ingots\`\n${emoji.gold} ─ \`${goldIngot} gold ingots\``, true)
                    .addField('What You Gained', `${emoji.sKey} ─ \`${amount} silver key(s)\``))
            }
        } else if (item === 'goldkey' || item === 'gkey') {
            const BronzeCoins = await economy.getInv(userId, 'bronzeCoins')
            const SilverCoins = await economy.getInv(userId, 'silverCoins')
            const GoldCoins = await economy.getInv(userId, 'goldCoins')
            const SilvIngot = await economy.getInv(userId, 'silverIngot')
            const GoldIngot = await economy.getInv(userId, 'goldIngot')
            const XP = await economy.getInv(userId, 'XP')


            if (BronzeCoins < amount * 400000 || SilvIngot < amount * 40 || GoldIngot < amount * 12 || SilverCoins < amount * 125000 || XP < 600 || GoldCoins < amount * 50000) {
                message.channel.send(craft
                    .setColor(message.guild.me.displayColor)
                    .setTitle(`Insufficent Materials`)
                    .setDescription(`${message.author} **you do not have enough materials to craft \`${amount} gold key(s)\`**`)
                    .addField('Items Needed', `${emoji.bronzeCoin} ─ \`${amount * 400000} coins\`\n${emoji.silverCoin} ─ \`${amount * 125000} coins\`\n${emoji.goldCoin} ─ \`${amount * 50000} coins\`\n${emoji.silver} ─ \`${amount * 40} silver ingots\`\n${emoji.gold} ─ \`${amount * 12} gold ingots\`\n⭐ ─ \`600 XP\``, true)
                    .addField('Items You Have', `${emoji.bronzeCoin} ─ \`${BronzeCoins} coins\`\n${emoji.silverCoin} ─ \`${SilverCoins} coins\`\n${emoji.goldCoin} ─ \`${GoldCoins} coins\`\n${emoji.silver} ─ \`${SilvIngot} silver ingots\`\n${emoji.gold} ─ \`${GoldIngot} gold ingots\`\n⭐ ─ \`${XP} XP\``, true))
            } else {
                const bronzeCoins = await economy.buyItem(userId, 'bronzeCoins', amount * -400000)
                const silverCoins = await economy.buyItem(userId, 'silverCoins', amount * -125000)
                const goldCoins = await economy.buyItem(userId, 'goldCoins', amount * -50000)
                const silvIngot = await economy.buyItem(userId, 'silverIngot', amount * -40)
                const goldIngot = await economy.buyItem(userId, 'goldIngot', amount * -12)

                const goldKey = await economy.buyItem(userId, 'goldKey', amount)

                setCooldown(client, this, message);

                message.channel.send(craft
                    .setColor(message.guild.me.displayColor)
                    .setTitle('Successfully Crafted A Gold Key')
                    .setDescription(`${message.author} **you crafted a gold key and can now use it on a gold lock to get to level 3**`)
                    .addField('Items You Used', `${emoji.bronzeCoin} ─ \`${amount * 400000} coins\`\n${emoji.silverCoin} ─ \`${amount * 125000} coins\`\n${emoji.goldCoin} ─ \`${amount * 50000} coins\`\n${emoji.silver} ─ \`${amount * 40} silver ingots\`\n${emoji.gold} ─ \`${amount * 12} gold ingots\``, true)
                    .addField('Items You Have Left', `${emoji.bronzeCoin} ─ \`${bronzeCoins} coins\`\n${emoji.silverCoin} ─ \`${silverCoins} coins\`\n${emoji.goldCoin} ─ \`${goldCoins} coins\`\n${emoji.silver} ─ \`${silvIngot} silver ingots\`\n${emoji.gold} ─ \`${goldIngot} gold ingots\``, true)
                    .addField('What You Gained', `${emoji.gKey} ─ \`${amount} gold key(s)\``))
            }
        } else if (item === 'trident' || item === 'trid') {
            const TriShard = await economy.getInv(userId, 'trishard')
            const XP = await economy.getInv(userId, 'XP')


            if (XP < 150 || TriShard < amount * 3) {
                message.channel.send(craft
                    .setColor(message.guild.me.displayColor)
                    .setTitle(`Insufficent Materials`)
                    .setDescription(`${message.author} **you do not have enough materials to craft \`${amount} tridents(s)\`**`)
                    .addField('Items Needed', `${emoji.trishard} ─ \`${amount * 3} trident shards\`\n⭐ ─ \`150 XP\``, true)
                    .addField('Items You Have', `${emoji.trishard} ─ \`${TriShard} trident shard(s)\`\n⭐ ─ \`${XP} XP\``, true))
            } else {
                const triShard = await economy.buyItem(userId, 'trishard', amount * -3)

                const trident = await economy.buyItem(userId, 'trident', amount)

                message.channel.send(craft
                    .setColor(message.guild.me.displayColor)
                    .setTitle('Successfully Crafted A Trident')
                    .setDescription(`${message.author} **you crafted a trident and can now use it to flex on others**`)
                    .addField('Items You Used', `${emoji.trishard} ─ \`${amount * 3} trident shards\``, true)
                    .addField('Items You Have Left', `${emoji.trishard} ─ \`${triShard} trident shard(s)\``, true)
                    .addField('What You Gained', `${emoji.tri} ─ \`${amount} trident(s)\``))
            }
        } else {
            message.channel.send(craft
                .setColor(message.guild.me.displayColor)
                .setDescription(`**${message.author} either that item doesnt exist or you cant craft it**`))
        }
    }
}