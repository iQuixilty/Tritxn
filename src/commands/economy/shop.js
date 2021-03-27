const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const economy = require('../../../schemas/economy')
const shop = require("../../../config/shop.json")
const emoji = require("../../../config/emoji.json")

const { setCooldown, paginate } = require('../../utils/utils')

module.exports = {
    name: "shop",
    category: "Economy",
    aliases: ["store", 'item'],
    description: "Displays items you can buy from the store",
    usage: "\`PREFIXshop\`",
    cooldown: 5,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let userId = message.author.id

        const Fish = await economy.getInv(userId, 'fish')
        const Rod = await economy.getInv(userId, 'fishingRod')
        const Trident = await economy.getInv(userId, 'trident')
        const TriShard = await economy.getInv(userId, 'trishard')
        const Rifle = await economy.getInv(userId, 'rifle')
        const Pick = await economy.getInv(userId, 'pickaxe')
        const Raccoon = await economy.getInv(userId, 'raccoon')
        const Rabbit = await economy.getInv(userId, 'rabbit')

        const bCoin = await economy.getInv(userId, 'bronzeCoins')
        const sCoin = await economy.getInv(userId, 'silverCoins')
        const gCoin = await economy.getInv(userId, 'goldCoins')

        const SilverIngot = await economy.getInv(userId, 'silverIngot')
        const GoldIngot = await economy.getInv(userId, 'goldIngot')

        const bronzeKey = await economy.getInv(userId, 'bronzeKey')
        const silverKey = await economy.getInv(userId, 'silverKey')
        const goldKey = await economy.getInv(userId, 'goldKey')

        const bronzeLock = await economy.getInv(userId, 'bronzeLock')
        const silverLock = await economy.getInv(userId, 'silverLock')
        const goldLock = await economy.getInv(userId, 'goldLock')

        setCooldown(client, this, message)

        let embed = new Discord.MessageEmbed()

        const itemName = args.join(' ').toLowerCase();

        if (!itemName) return defaultHelp(client, message, guildPrefix)

        let item = shop.find((val) => val.name === itemName.toLowerCase())
        if (item === undefined) {
            shop.find((val) => {
                for (let i = 0; i < val.aliases.length; i++) {
                    item = shop.find((value) => value.aliases[i] === itemName.toLowerCase())
                    if (item && item.name) break;
                }
            })
        }

        if (!item || item === undefined) {
            return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**That item does not exist**`))
        }

        const replacers = {
            'emoji.rod': emoji.rod,
            'emoji.pick': emoji.pick,
            'emoji.rifle': emoji.rifle,
            'emoji.rabbit': emoji.rabbit,
            'emoji.fish': emoji.fish,
            'emoji.raccoon': emoji.raccoon,
            'emoji.bLock': emoji.bLock,
            'emoji.bKey': emoji.bKey,
            'emoji.sLock': emoji.sLock,
            'emoji.sKey': emoji.sKey,
            'emoji.gLock': emoji.gLock,
            'emoji.gKey': emoji.gKey,
            'emoji.bronzeCoin': emoji.bronzeCoin,
            'emoji.silverCoin': emoji.silverCoin,
            'emoji.goldCoin': emoji.goldCoin,
            'emoji.tri': emoji.tri,
            'emoji.trishard': emoji.trishard,
            'emoji.silver': emoji.silver,
            'emoji.gold': emoji.gold,
            '$Rod': Rod,
            '$Pickaxe': Pick,
            '$Rifle': Rifle,
            '$Rabbit': Rabbit,
            '$Fish': Fish,
            '$Raccoon': Raccoon,
            '$bronzeLock': bronzeLock,
            '$bronzeKey': bronzeKey,
            '$silverLock': silverLock,
            '$silverKey': silverKey,
            '$goldLock': goldLock,
            '$goldKey': goldKey,
            '$bCoin': bCoin,
            '$sCoin': sCoin,
            '$gCoin': gCoin,
            '$Trident': Trident,
            '$TriShard': TriShard,
            '$SilverIngot': SilverIngot,
            '$GoldIngot': GoldIngot,
        }

        let title = replace(item, replacers)

        let guildInfo = client.guildInfoCache.get(message.guild.id)
        let prefix = guildInfo.prefix
        let itemEmbed = new Discord.MessageEmbed()
            .setAuthor(`Tritxn Shop`)
            .setColor(message.guild.me.displayColor)
            .setTitle(title)
            .setDescription(item.description
                .replace(`emoji.bronzeCoin`, emoji.bronzeCoin)
                .replace(`emoji.silverCoin`, emoji.silverCoin)
                .replace(`emoji.goldCoin`, emoji.goldCoin))
            .addField('Usage', item.usage.replace(`guildPrefix`, prefix))
            .setTimestamp()


        let itemAliases = []
        if (item.aliases && item.aliases.length !== 0) itemAliases = itemAliases.concat(item.aliases)
        if (itemAliases.length > 0) itemEmbed.addField('Aliases', '`' + itemAliases.join('`, `') + '`')

        if (item.buyingPrice) itemEmbed.addField(
            'Buying Price',
            item.buyingPrice
                .replace(`emoji.bronzeCoin`, emoji.bronzeCoin)
                .replace(`emoji.silverCoin`, emoji.silverCoin)
                .replace(`emoji.goldCoin`, emoji.goldCoin), true)

        if (item.resalePrice) itemEmbed.addField(
            'Resale Price',
            item.resalePrice
                .replace(`emoji.bronzeCoin`, emoji.bronzeCoin)
                .replace(`emoji.silverCoin`, emoji.silverCoin)
                .replace(`emoji.goldCoin`, emoji.goldCoin), true)

        if (item.emojiId) itemEmbed.setThumbnail(`https://cdn.discordapp.com/emojis/${item.emojiId}.png`)

        message.channel.send(itemEmbed)
    }
}

function defaultHelp(client, message, guildPrefix) {
    let hEmbed1 = new Discord.MessageEmbed()
        .setTitle("Trtixns Shop Of Useful Tools")
        .setColor(message.guild.me.displayColor)
        .setDescription(`Use \`${guildPrefix}shop [item]\` to get more info on a item, for example: \`${guildPrefix}shop pole\`\n\n${emoji.rod} **Fishing Rod** ─ ${emoji.bronzeCoin} \`20,000 coins\`\n\n${emoji.rifle} **Hunting Rifle** ─ ${emoji.bronzeCoin} \`20,000 coins\`\n\n${emoji.pick} **Pickaxe** ─ ${emoji.bronzeCoin} \`30,000 coins\``)
        .setTimestamp()
        .setThumbnail(client.user.displayAvatarURL())

    let hEmbed2 = new Discord.MessageEmbed()
        .setTitle("Trtixns Shop Of Useful Utilities")
        .setColor(message.guild.me.displayColor)
        .setDescription(`Use \`${guildPrefix}shop [item]\` to get more info on a item, for example: \`${guildPrefix}shop pole\`\n\n${emoji.bLock} **Bronze Lock** ─ ${emoji.bronzeCoin} \`100,000 coins\`\n\n${emoji.sLock} **Silver Lock** ─ ${emoji.silverCoin} \`100,000 coins\`\n\n${emoji.gLock} **Gold Lock** ─ ${emoji.goldCoin} \`100,000 coins\``)
        .setTimestamp()
        .setThumbnail(client.user.displayAvatarURL())

    let hEmbed3 = new Discord.MessageEmbed()
        .setTitle("Trtixns Shop Of Useless Collectables")
        .setColor(message.guild.me.displayColor)
        .setDescription(`Use \`${guildPrefix}shop [item]\` to get more info on a item, for example: \`${guildPrefix}shop pole\`\n\n${emoji.tri} **Trident** ─ ${emoji.goldCoin} \`1,000,000 coins\``)
        .setTimestamp()
        .setThumbnail(client.user.displayAvatarURL())

    paginate(message, [hEmbed1, hEmbed2, hEmbed3], { time: 1000 * 7 })
}

/**
 * 
 * @param {object} item - Object - of strings you want to filter
 * @param {object} replacers - Object - of replacers you want to replace with
 * @returns {String} string - Returns string with replaced chars
 */
function replace(item, replacers) {
    let text = item.title.text
    for (const r of item.title.replace) {
        text = text.replace(r, replacers[r]);
    }
    return text;
}