const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "spam",
    category: "Misc",
    cooldown: 15,
    description: "Spams a word",
    usage: "\`PREFIXspam [word] [amount]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message);

        let Message = args[0]
        let amount = args[1]

        if (!Message) return message.reply(`What do you want to spam?`)
        if (!amount) return message.reply(`Specify an amount`)
        if (amount > 30) return message.reply(`No spamming more than 30 lines`)
        if (Message.includes('<@')) return message.reply(`Spam pinging someone isn't nice`)


        let count = amount
        while (count > 0) {
            message.channel.send(Message)
            count = count - 1
        }

    }
}
