const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const emoji = require('../../../../config/emoji.json')
const ms = require('ms')

module.exports = {
    name: "slowmode",
    category: "Moderation",
    aliases: ["sm"],
    description: "Sets slowmode to a channel",
    usage: "\`PREFIXslowmode [time]\` This time is in seconds.",
    perms: ['MANAGE_CHANNELS'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],

    execute: async function (client, message, args) {
        const slowmodeE = new Discord.MessageEmbed()

        const { channel } = message

        let duration = args[0]


        if (isNaN(ms(duration))) {
            if (duration === 'off') {
                duration = 0
            } else {
                return message.reply(slowmodeE
                    .setColor('RED')
                    .setDescription(`**${message.author} please provide a valid time that is less than 6 hours or the word \`off\`**`))
            }
        }

        if (duration < 1) {
            duration = 0
        }

        if (ms(duration) >= 1000 * 60 * 60 * 6 ) {
            return message.reply(slowmodeE
                .setColor('RED')
                .setDescription(`**${message.author} please provide either a valid time that is less than 6 hours or the word \`off\`**`))
        }

        channel.setRateLimitPerUser(ms(duration) / 1000)
        message.reply(slowmodeE
            .setColor('GREEN')
            .setDescription(`**${emoji.upvote} ${message.author} the slowmode for this channel has been set to ${ms(ms(duration), { long: true })}**`))
    }
}