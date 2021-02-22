const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const emoji = require('../../../../config/emoji.json')

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
        if (duration === 'off') {
            duration = 0
        }

        if (isNaN(duration)) {
            message.reply(slowmodeE
                .setColor('RED')
                .setDescription(`**${emoji.downvote} ${message.author} please provide either a number of seconds (greater than 1) or the word \`off\`**`))
            return;
        }

        if (duration < 1) {
           duration = 0
        }

        channel.setRateLimitPerUser(duration)
        message.reply(slowmodeE
            .setColor('GREEN')
            .setDescription(`**${emoji.upvote} ${message.author} the slowmode for this channel has been set to ${duration} second(s)**`))
    }
}