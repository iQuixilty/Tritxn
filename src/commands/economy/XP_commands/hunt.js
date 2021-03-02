const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const economy = require('../../../../schemas/economy')

const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "hunt",
    category: "Economy",
    aliases: ['shoot', 'catch'],
    description: "Allows you to catch animals",
    usage: "\`PREFIXhunt\`",
    cooldown: 300,
    canNotSetCooldown: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const INV = new Discord.MessageEmbed()
        let userId = message.author.id

        const Rifles = await economy.getInv(userId, 'rifle')

        if (!Rifles) {
            message.channel.send(INV
                .setColor(message.guild.me.displayColor)
                .setDescription(`**You do not have any rifles**`))
            return;
        } else {

            let randomNumber = Math.floor(Math.random() * 2) + 1

            setCooldown(client, this, message);

            switch (randomNumber) {
                case 1:
                    let workpay = Math.floor(Math.random() * 4) + 1
                    const responses = [`You hunted \`${workpay} raccoon(s)\` 🦝`]

                    message.channel.send(`${message.author} **⇒**`, {
                        embed: {
                            color: message.guild.me.displayColor,
                            description: `**${responses}**`
                        }
                    })
             
                    await economy.buyItem(userId, 'raccoon', workpay)
                    await economy.buyItem(userId, 'XP', workpay * 2)
                    break;
                case 2:
                    let Workpay = Math.floor(Math.random() * 5) + 1
                    const Responses = [`You somehow caught \`${Workpay} rabbit(s)\` 🐇`]

                    message.channel.send(`${message.author} **⇒**`, {
                        embed: {
                            color: message.guild.me.displayColor,
                            description: `**${Responses}**`
                        }
                    })
                  
                    await economy.buyItem(userId, 'rabbit', Workpay)
                    await economy.buyItem(userId, 'XP', Workpay)
                    break;
            }
        }

    }
}

//, `You managed to catch a boar \`🐗\``, `You used your superior hunting skills and caught a rabbit \`🐇\``