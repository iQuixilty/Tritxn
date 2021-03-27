const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const economy = require('../../../../schemas/economy')
const emoji = require('../../../../config/emoji.json')

const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "level",
    category: "Economy",
    aliases: ["lvl", 'xp', 'profile', 'prof'],
    description: "Displays the amount of XP a user has and what level they are",
    usage: "\`PREFIXbal [user]\`",
    cooldown: 3,
    canNotSetCooldown: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const target = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.member

        const Levels = new Discord.MessageEmbed()

        const userId = target.id


        setCooldown(client, this, message);
        const level = await economy.getInv(userId, 'level')
        const XP = await economy.getInv(userId, 'XP')
        const bronzeCoins = await economy.getInv(userId, 'bronzeCoins')
        const silverCoins = await economy.getInv(userId, 'silverCoins')
        const goldCoins = await economy.getInv(userId, 'goldCoins')

        message.channel.send(Levels
            .setColor(message.guild.me.displayColor)
            .setFooter(`${message.guild.name}`, client.user.displayAvatarURL())
            .setTitle(`${target.user.username}'s Profile`)
            .addField(`Level:`, `\`${level}\``, true)
            .addField(`Experience:`, `\`${XP}\``, true)
            .addField(`Balance:`, `${emoji.bronzeCoin} \`${bronzeCoins} coins\`\n${emoji.silverCoin} \`${silverCoins} coins\`\n${emoji.goldCoin} \`${goldCoins} coins\``))


    }
}