const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const economy = require('../../../../schemas/economy')

const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "fish",
    category: "Economy",
    description: "Allows you to catch fish",
    usage: "\`PREFIXfish\`",
    cooldown: 300,
    canNotSetCooldown: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const INV = new Discord.MessageEmbed()
        let userId = message.author.id


        const Rods = await economy.getInv(userId, 'fishingRod')

        if (!Rods) {
            message.channel.send(INV
                .setColor(message.guild.me.displayColor)
                .setDescription(`**You do not have any fishing rods**`))
            return;
        } else {
            setCooldown(client, this, message);

            let workpay = Math.floor(Math.random() * 5) + 1

            const responses = [`You fished up ${workpay} fishes \`🐟\``, `You fished up ${workpay} fish \`🐟\``, `You fished up ${workpay} fish \`🐟\``]

            const respond = responses[Math.floor(Math.random() * responses.length)]

            message.channel.send(`${message.author} **⇒**`)
            message.channel.send(INV.setColor(message.guild.me.displayColor).setDescription(`**${respond}**`))

            if (workpay) {
                await economy.buyItem(userId, 'fish', workpay)
                 await economy.buyItem(userId, 'XP', workpay)
            } else {
                return;
            }
        }

    }
}