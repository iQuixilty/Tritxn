const PREFIX = require('../../../../config/config.json').PREFIX;

const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');

/**
 * @type {import('../../../typings.d').Command}
 */

module.exports = {
    name: "sudo",
    category: "Misc",
    description: "Make anyone say anything",
    usage: "\`PREFIXsudo [user] [text]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function(client, message, args) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(n => n.user.username === args[0])

        if (!member) return message.reply(`Couldn't find this user!`)

        let msg = args.slice(1).join(' ')
        if (!msg) return message.reply(`Provide some text to say`)

        message.delete()

        message.channel.createWebhook(member.nickname, {
            avatar: member.user.displayAvatarURL({ dynamic: true })
        }).then(webhook => {
            webhook.send(msg)
            setTimeout(() => {
                webhook.delete()
            }, 3000)
        })
    }
}