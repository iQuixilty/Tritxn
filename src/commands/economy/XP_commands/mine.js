const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const economy = require('../../../../schemas/economy')
const emoji = require('../../../../config/emoji.json')

const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "mine",
    category: "Economy",
    aliases: ['dig'],
    description: "Allows you to mine for ores",
    usage: "\`PREFIXmine\`",
    cooldown: 300,
    canNotSetCooldown: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const INV = new Discord.MessageEmbed()
        let userId = message.author.id



        const Pickaxes = await economy.getInv(userId, 'pickaxe')

        if (!Pickaxes) {
            message.channel.send(INV
                .setColor(message.guild.me.displayColor)
                .setDescription(`**${message.author}, you do not have any pickaxe(s)**`))
            return;
        } else {

            let randomNumber = Math.floor(Math.random() * 2) + 1

            setCooldown(client, this, message);

            switch (randomNumber) {
                case 1:
                    let workpay = Math.floor(Math.random() * 5) + 1
                    const responses = [`You mined \`${workpay} silver ingot(s)\` ${emoji.silver}`]

                    message.channel.send(`${message.author} **⇒**`, {
                        embed: {
                            color: message.guild.me.displayColor,
                            description: `**${responses}**`
                        }
                    })
             
                    await economy.buyItem(userId, 'silverIngot', workpay)
                    await economy.buyItem(userId, 'XP', workpay)
                    break;
                case 2:
                    let Workpay = Math.floor(Math.random() * 3) + 1
                    const Responses = [`You somehow managed to mine \`${Workpay} gold ingot(s)\` ${emoji.gold}`]

                    message.channel.send(`${message.author} **⇒**`, {
                        embed: {
                            color: message.guild.me.displayColor,
                            description: `**${Responses}**`
                        }
                    })

                    await economy.buyItem(userId, 'goldIngot', Workpay)
                    await economy.buyItem(userId, 'XP', Workpay * 2)
                    break;
            }
        }

    }
}

