const PREFIX = require('../../../../config/config.json').PREFIX;

const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');

module.exports = {
    name: "sudo",
    category: "Misc",
    description: "Make anyone say anything",
    usage: "\`PREFIXsudo [user] [text]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        if (!args[0]) return message.reply('Mention someone you doofus!')
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return message.reply(`Couldn't find this user!`)

        message.delete()

        message.channel.createWebhook(member.user.username, {
            avatar: member.user.displayAvatarURL({ dynamic: true })
        }).then(webhook => {
            webhook.send(args.slice(1).join(' '))
            setTimeout(() => {
                webhook.delete()
            }, 3000)
        })
    }
}