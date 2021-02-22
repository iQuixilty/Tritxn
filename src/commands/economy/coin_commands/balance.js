const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const economy = require('../../../../schemas/economy')
const emoji = require('../../../../config/emoji.json')


const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "balance",
    category: "Economy",
    aliases: ["bal", 'money'],
    description: "Displays the amount of coins a user has",
    usage: "\`PREFIXbal [user]\`",
    cooldown: 5,
    canNotSetCooldown: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const target = message.mentions.users.first() || message.author

        const Coins = new Discord.MessageEmbed()

        const userId = target.id

        setCooldown(client, this, message);

        const bronzeCoins = await economy.getInv(userId, 'bronzeCoins')
        const silverCoins = await economy.getInv(userId, 'silverCoins')
        const goldCoins = await economy.getInv(userId, 'goldCoins')

        message.channel.send(Coins
            .setColor(message.guild.me.displayColor)
            .setFooter(`${message.guild.name}`, client.user.displayAvatarURL())
            .setTitle(`${target.username}'s Wallet`)
            .addField(`Balance:`, `${emoji.bronzeCoin} \`${Math.round(bronzeCoins)} coins\`\n\n${emoji.silverCoin} \`${Math.round(silverCoins)} coins\`\n\n${emoji.goldCoin} \`${Math.round(goldCoins)} coins\``))

    }
}