const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const economy = require('../../../schemas/economy')
const emoji = require('../../../config/emoji.json')

const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "recipes",
    category: "Economy",
    aliases: ['recipe', 'rec'],
    description: "Gives a list of recipes",
    usage: "\`PREFIXrecipes [item]\`",
    cooldown: 5,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const recipe = new Discord.MessageEmbed()
        let userId = message.author.id


        const bCoin = await economy.getInv(userId, 'bronzeCoins')
        const sCoin = await economy.getInv(userId, 'silverCoins')
        const gCoin = await economy.getInv(userId, 'goldCoins')

        const SilverIngot = await economy.getInv(userId, 'silverIngot')
        const GoldIngot = await economy.getInv(userId, 'goldIngot')

        const TriShard = await economy.getInv(userId, 'trishard')

        const xp = await economy.getInv(userId, 'XP')

        const guildInfo = client.guildInfoCache.get(message.guild.id)

        let item = args[0]

        setCooldown(client, this, message);

        if (!item) {
            message.channel.send(recipe
                .setColor(message.guild.me.displayColor)
                .setTitle("List Of Craftable Items")
                .addField(`${emoji.bKey} ─ Bronze Key`, 'Used to prestige to level 1')
                .addField(`${emoji.sKey} ─ Silver Key`, 'Used to prestige to level 2 **(Useless Unless Already Level 1)**')
                .addField(`${emoji.gKey} ─ Gold Key`, 'Used to prestige to the highest level, 3 **(Useless Unless Already Level 2)**')
                .addField(`${emoji.tri} ─ Trident`, `Used To Flex On Others **(also sellable)**`)
                .setFooter(`Use ${guildInfo.prefix}recipes [item] to see the exact recipe for the item`)
                .setThumbnail(client.user.displayAvatarURL()))
            return
        }

        if (item.toLowerCase() === 'bronzekey' || item.toLowerCase() === 'bkey') {
            message.channel.send(recipe
                .setColor(message.guild.me.displayColor)
                .setTitle(`Recipe For Bronze Key ${emoji.bKey}`)
                .addField('Items Needed', `${emoji.bronzeCoin} ─ **100000 bronze coins \`(${bCoin} owned)\`\n\n${emoji.silver} ─ 10 silver ingots \`(${SilverIngot} owned)\`\n\n${emoji.gold} ─ 3 gold ingots \`(${GoldIngot} owned)\`**`)
                .setFooter(`⭐ XP Required: ${xp}/100`))
        } else if (item.toLowerCase() === 'silverkey' || item.toLowerCase() === 'skey') {
            message.channel.send(recipe
                .setColor(message.guild.me.displayColor)
                .setTitle(`Recipe For Silver Key ${emoji.sKey}`)
                .addField('Items Needed', `${emoji.bronzeCoin} ─ **200000 bronze coins \`(${bCoin} owned)\`\n\n${emoji.silverCoin} ─ 50000 silver coins \`(${sCoin} owned)\`\n\n${emoji.silver} ─ 20 silver ingots \`(${SilverIngot} owned)\`\n\n${emoji.gold} ─ 6 gold ingots \`(${GoldIngot} owned)\`**`)
                .setFooter(`⭐ XP Required: ${xp}/300`))
        } else if (item.toLowerCase() === 'goldkey' || item.toLowerCase() === 'gkey') {
            message.channel.send(recipe
                .setColor(message.guild.me.displayColor)
                .setTitle(`Recipe For Gold Key ${emoji.gKey}`)
                .addField('Items Needed', `${emoji.bronzeCoin} ─ **400000 bronze coins \`(${bCoin} owned)\`\n\n${emoji.silverCoin} ─ 125000 silver coins \`(${sCoin} owned)\`\n\n${emoji.goldCoin} ─ 50000 gold coins \`(${gCoin} owned)\`\n\n${emoji.silver} ─ 40 silver ingots \`(${SilverIngot} owned)\`\n\n${emoji.gold} ─ 12 gold ingots \`(${GoldIngot} owned)\`**`)
                .setFooter(`⭐ XP Required: ${xp}/600`))
        } else if (item.toLowerCase() === 'trid' || item.toLowerCase() === 'trident') {
            message.channel.send(recipe
                .setColor(message.guild.me.displayColor)
                .setTitle(`Recipe For Trident ${emoji.tri}`)
                .addField(`Item Needed`, `${emoji.trishard} ─ **3 trident shards \`(${TriShard} owned)\`**`)
                .setFooter(`⭐ XP Required: ${xp}/150`))
        } else {
            message.channel.send(recipe
                .setColor(message.guild.me.displayColor)
                .setDescription(`**${message.author} that is not a valid item you can craft or does not exist**`))
        }



    }
}
