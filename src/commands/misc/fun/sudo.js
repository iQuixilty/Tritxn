const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js');

/**
 * @type {import('../../../typings.d').Command}
 */

module.exports = {
    name: "sudo",
    category: "Misc",
    description: "Make anyone say anything, (they didn't actually say it)",
    usage: "\`PREFIXsudo [user] [text]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function(client, message, args) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return message.reply(`Couldn't find this user!`)

        let msg = args.slice(1).join(' ')
        if (!msg) return message.reply(`Provide some text to say`)

        message.delete()

        let username = member.nickname === null ? member.displayName : member.nickname

        message.channel.createWebhook(username, {
            avatar: member.user.displayAvatarURL({ dynamic: true })
        }).then(webhook => {
            webhook.send(msg)
            setTimeout(() => {
                webhook.delete()
            }, 3000)
        })
    }
}