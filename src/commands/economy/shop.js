const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const economy = require('../../../schemas/economy')
const emoji = require('../../../config/emoji.json')


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
        let guildInfo = client.guildInfoCache.get(message.guild.id)
        let guildPrefix = guildInfo.prefix

        const ITEM = new Discord.MessageEmbed()

        let items = args[0]

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

        if (items === 'pole' || items === 'rod' || items === 'fishingpole' || items === 'fishingrod') {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setAuthor('Tritxn Shop')
                .setThumbnail('https://cdn.discordapp.com/emojis/791840038794952704.png')
                .setTitle(`${emoji.rod} ─ Fishing Rod \`(${Rod} owned)\``)
                .setDescription(`This item can be used to catch fish\nCosts ${emoji.bronzeCoin} **\`20000 coins\`** to buy`)
                .addField('Usage', `\`${guildPrefix}fish\``)
                .addField('Aliases', '`pole`, `rod`, `fishingpole`, `fishingrod`')
                .addField('Buying Price', `${emoji.bronzeCoin} \`20000 coins\``, true)
                .addField('Resale Price', `${emoji.bronzeCoin} \`10000 coins\``, true)
                .setTimestamp())
        } else if (items === 'fish' || items === 'f') {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setAuthor('Tritxn Shop')
                .setTitle(`🐟 ─ Fish \`(${Fish} owned)\``)
                .setDescription('This item is only a cheap collectable, nothing else')
                .addField('Usage', `\`none\``)
                .addField('Aliases', '`f`')
                .addField('Buying Price', '\`Cant Be Bought\`', true)
                .addField('Resale Price', `${emoji.bronzeCoin} \`200 coins\``, true)
                .setTimestamp())
        }
        else if (items === 'trident' || items === 'trid') {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setAuthor('Tritxn Shop')
                .setThumbnail('https://cdn.discordapp.com/emojis/792869156164075571.png')
                .setTitle(`${emoji.tri} ─ Trident \`(${Trident} owned)\``)
                .setDescription(`This item is the rarest of collectables\nCosts ${emoji.goldCoin} **\`1000000 coins\`** to buy`)
                .addField('Usage', `\`${guildPrefix}use trident\``)
                .addField('Aliases', '`trid`')
                .addField('Buying Price', `${emoji.goldCoin} \`1000000 coins\``, true)
                .addField('Resale Price', `${emoji.goldCoin} \`500000 coins\``, true)
                .setTimestamp())
        } else if (items === 'rifle' || items === 'gun' || items === 'huntingrifle') {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setAuthor('Tritxn Shop')
                .setThumbnail('https://cdn.discordapp.com/emojis/791772909466812516.png')
                .setTitle(`${emoji.rifle} ─ Rifle \`(${Rifle} owned)\``)
                .setDescription(`This item can be used to catch animals\nCosts ${emoji.bronzeCoin} **\`20000 coins\`** to buy`)
                .addField('Usage', `\`${guildPrefix}hunt\``)
                .addField('Aliases', '`gun`, `rifle`, `huntingrifle`')
                .addField('Buying Price', `${emoji.bronzeCoin} \`20000 coins\``, true)
                .addField('Resale Price', `${emoji.bronzeCoin} \`10000 coins\``, true)
                .setTimestamp())
        } else if (items === 'coins') {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setAuthor('Tritxn Shop')
                .setTitle(":coin: ─ Coins")
                .setDescription('Type of currency in the game, there are three different types that you unlock as you progress. \nTypes: \`bronzeCoins\`, \`silverCoins\`, \`goldCoins\`')
                .addField('Usage', `\`${guildPrefix}buy [item]\``)
                .addField('Aliases', '`none`')
                .setTimestamp())
        } else if (items === 'bronzeCoins' || items === 'bcoins') {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setAuthor('Tritxn Shop')
                .setThumbnail('https://cdn.discordapp.com/emojis/791740874312122379.png')
                .setTitle(`${emoji.bronzeCoin} ─ Bronze Coins \`(${bCoin} owned)\``)
                .setDescription('Lowest type of currency unlockable')
                .addField('Usage', `\`${guildPrefix}buy [item]\``)
                .addField('Aliases', '`bronzeCoins`, `bCoins`')
                .setTimestamp())
        } else if (items === 'silverCoins' || items === 'scoins') {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setThumbnail('https://cdn.discordapp.com/emojis/791740874311598100.png')
                .setAuthor('Tritxn Shop')
                .setTitle(`${emoji.silverCoin} ─ Silver Coins \`(${sCoin} owned)\``)
                .setDescription('Mid-tier type of currency unlockable')
                .addField('Usage', `\`${guildPrefix}buy [item]\``)
                .addField('Aliases', '`silverCoins`, `sCoins`')
                .setTimestamp())
        } else if (items === 'goldCoins' || items === 'gcoins') {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setAuthor('Tritxn Shop')
                .setThumbnail('https://cdn.discordapp.com/emojis/791740874430087249.png')
                .setTitle(`${emoji.goldCoin} ─ Gold Coins \`(${gCoin} owned)\``)
                .setDescription('Highest type of currency unlockable')
                .addField('Usage', `\`${guildPrefix}buy [item]\``)
                .addField('Aliases', '`goldCoins`, `gCoins`')
                .setTimestamp())
        } else if (items === 'pickaxe' || items === 'axe' || items === 'pick') {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setAuthor('Tritxn Shop')
                .setThumbnail('https://cdn.discordapp.com/emojis/791866249419423744.png')
                .setTitle(`${emoji.pick} ─ Pickaxe \`(${Pick} owned)\``)
                .setDescription(`This item can be used to mine ores\nCosts ${emoji.bronzeCoin} **\`30000 coins\`** to buy`)
                .addField('Usage', `\`${guildPrefix}mine\``)
                .addField('Aliases', '`pickaxe`, `axe`, `pick`')
                .addField('Buying Price', `${emoji.bronzeCoin} \`30000 coins\``, true)
                .addField('Resale Price', `${emoji.bronzeCoin} \`15000 coins\``, true)
                .setTimestamp())
        } else if (items === 'raccoon' || items === 'rac') {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setAuthor('Tritxn Shop')
                .setTitle(`🦝 ─ Raccoon \`(${Raccoon} owned)\``)
                .setDescription(`This item is only a cheap collectable, nothing else`)
                .addField('Usage', `\`none\``)
                .addField('Aliases', '`rac`, `raccoon`')
                .addField('Buying Price', '\`Cant Be Bought\`', true)
                .addField('Resale Price', `${emoji.bronzeCoin} \`1000 coins\``, true)
                .setTimestamp())
        } else if (items === 'rabbit' || items === 'rab') {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setAuthor('Tritxn Shop')
                .setTitle(`🐇 ─ Rabbit \`(${Rabbit} owned)\``)
                .setDescription(`This item is only a cheap collectable, nothing else`)
                .addField('Usage', `\`none\``)
                .addField('Aliases', '`rab`, `rabbit`')
                .addField('Buying Price', '\`Cant Be Bought\`', true)
                .addField('Resale Price', `${emoji.bronzeCoin} \`500 coins\``, true)
                .setTimestamp())
        } else if (items === 'goldingot' || items === 'goldi' || items === 'gi') {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setAuthor('Tritxn Shop')
                .setThumbnail('https://cdn.discordapp.com/emojis/792149728883900466.png')
                .setTitle(`${emoji.gold} ─ Gold Ingot \`(${GoldIngot} owned)\``)
                .setDescription('This item can be used to craft objects')
                .addField('Usage', `\`none\``)
                .addField('Aliases', '`goldi`, `gi`, `goldingot`')
                .addField('Buying Price', '\`Cant Be Bought\`', true)
                .addField('Resale Price', `${emoji.silverCoin} \`2000 coins\``, true)
                .setTimestamp())
        }
        else if (items === 'silveringot' || items === 'silveri' || items === 'si') {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setAuthor('Tritxn Shop')
                .setThumbnail('https://cdn.discordapp.com/emojis/792149728199573545.png')
                .setTitle(`${emoji.silver} ─ Silver Ingot \`(${SilverIngot} owned)\``)
                .setDescription(`This item can be used to craft objects`)
                .addField('Usage', `\`none\``)
                .addField('Aliases', '`silveri`, `si`, `silveringot`')
                .addField('Buying Price', `\`Cant Be Bought\``, true)
                .addField('Resale Price', `${emoji.bronzeCoin} \`2000 coins\``, true)
                .setTimestamp())
        } else if (items === 'bronzekey' || items === 'bkey') {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setAuthor('Tritxn Shop')
                .setThumbnail('https://cdn.discordapp.com/emojis/792513887622266931.png')
                .setTitle(`${emoji.bKey} ─ Bronze Key \`(${bronzeKey} owned)\``)
                .setDescription(`This item can be used on a lock to prestige to level 1`)
                .addField('Usage', `\`${guildPrefix}use bronzekey\``)
                .addField('Aliases', '`bronzekey`, `bkey`')
                .addField('Buying Price', `\`Craftable Item \n(Cant Be Bought)\``, true)
                .addField('Resale Price', `${emoji.bronzeCoin} \`125000 coins\``, true)
                .setTimestamp())
        } else if (items === 'silverkey' || items === 'skey') {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setAuthor('Tritxn Shop')
                .setThumbnail('https://cdn.discordapp.com/emojis/792513887520948224.png')
                .setTitle(`${emoji.sKey} ─ Silver Key \`(${silverKey} owned)\``)
                .setDescription(`This item can be used on a lock to prestige to level 2`)
                .addField('Usage', `\`${guildPrefix}use silverkey\``)
                .addField('Aliases', '`silverkey`, `skey`')
                .addField('Buying Price', `\`Craftable Item \n(Cant Be Bought)\``, true)
                .addField('Resale Price', `${emoji.bronzeCoin} \`225000 coins\`\n${emoji.silverCoin} \`40000 coins\``, true)
                .setTimestamp())
        } else if (items === 'goldkey' || items === 'gkey') {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setAuthor('Tritxn Shop')
                .setThumbnail('https://cdn.discordapp.com/emojis/792513887412682762.png')
                .setTitle(`${emoji.gKey} ─ Gold Key \`(${goldKey} owned)\``)
                .setDescription(`This item can be used on a lock to prestige to level 3`)
                .addField('Usage', `\`${guildPrefix}use goldkey\``)
                .addField('Aliases', '`goldkey`, `gkey`')
                .addField('Buying Price', `\`Craftable Item \n(Cant Be Bought)\``, true)
                .addField('Resale Price', `${emoji.bronzeCoin} \`425000 coins\`\n${emoji.silverCoin} \`115000 coins\`\n${emoji.goldCoin} \`40000 coins\``, true)
                .setTimestamp())
        } else if (items === 'bronzelock' || items === 'block') {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setAuthor('Tritxn Shop')
                .setThumbnail('https://cdn.discordapp.com/emojis/792513887824117810.png')
                .setTitle(`${emoji.bLock} ─ Bronze Lock \`(${bronzeLock} owned)\``)
                .setDescription(`This item requires a key to be used.`)
                .addField('Usage', `\`none\``)
                .addField('Aliases', '`bronzelock`, `block`')
                .addField('Buying Price', `${emoji.bronzeCoin} \`100000 coins\``, true)
                .addField('Resale Price', `${emoji.bronzeCoin} \`50000 coins\``, true)
                .setTimestamp())
        } else if (items === 'silverlock' || items === 'slock') {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setAuthor('Tritxn Shop')
                .setThumbnail('https://cdn.discordapp.com/emojis/792513887630000139.png')
                .setTitle(`${emoji.sLock} ─ Silver Lock \`(${silverLock} owned)\``)
                .setDescription(`This item requires a key to be used.`)
                .addField('Usage', `\`none\``)
                .addField('Aliases', '`silverlock`, `slock`')
                .addField('Buying Price', `${emoji.silverCoin} \`100000 coins\``, true)
                .addField('Resale Price', `${emoji.silverCoin} \`50000 coins\``, true)
                .setTimestamp())
        } else if (items === 'goldlock' || items === 'glock') {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setAuthor('Tritxn Shop')
                .setThumbnail('https://cdn.discordapp.com/emojis/792513887588974613.png')
                .setTitle(`${emoji.gLock} ─ Gold Lock \`(${goldLock} owned)\``)
                .setDescription(`This item requires a key to be used.`)
                .addField('Usage', `\`none\``)
                .addField('Aliases', '`goldlock`, `glock`')
                .addField('Buying Price', `${emoji.goldCoin} \`100000 coins\``, true)
                .addField('Resale Price', `${emoji.goldCoin} \`50000 coins\``, true)
                .setTimestamp())
        } else if (items === 'trishard' || items === 'tridentshard' || items === 'tris') {
            message.channel.send(ITEM
                .setColor(message.guild.me.displayColor)
                .setAuthor('Tritxn Shop')
                .setThumbnail('https://cdn.discordapp.com/emojis/792869612831899668.png')
                .setTitle(`${emoji.trishard} ─ Trident Shard\`(${TriShard} owned)\``)
                .setDescription(`Can craft a trident with 3 of these (obtainable through prestiging)`)
                .addField('Usage', `\`none\``)
                .addField('Aliases', '`trishard`, `tridentshard`, `tris`')
                .addField('Buying Price', `\`Cant Be Bought\``, true)
                .addField('Resale Price', `${emoji.goldCoin} \`250000 coins\``, true)
                .setTimestamp())
        } else defaultHelp(client, message, guildPrefix)


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