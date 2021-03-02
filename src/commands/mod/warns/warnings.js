const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const warnSchema = require('../../../../schemas/warn-schema')

const emoji = require('../../../../config/emoji.json')
const moment = require('moment')
const { paginate } = require('../../../utils/utils')

module.exports = {
    name: "warnings",
    category: "Moderation",
    description: "Displays the warnings of a user",
    aliases: ['lw', 'listwarns', 'listwarnings'],
    usage: "\`PREFIXwarnings [user]\`",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let target =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.member;
        const guildId = message.guild.id
        const userId = target.id


        const warningE = new Discord.MessageEmbed()

        if (!target) {
            message.channel.send(warningE.setColor('RED').setDescription(`**${emoji.downvote} Please specify a user to check the warnings for**`))
            return
        }

        if (target.bot) {
            message.channel.send(warningE.setColor('RED').setDescription(`**${emoji.downvote} Bots don\'t have warnings**`))
            return
        }


        const results = await warnSchema.findOne({
            guildId,
            userId,
        })

        if (results === null) {
            message.channel.send(warningE
                .setColor('RED')
                .setDescription(`**${emoji.downvote} There are no warnings for this user**`))
            return;
        }

        let counter = 1;
        let embeds = [];

        while (results.warnings.length > 0) {
            let reply = ""
            for (let i = 0; i < 5; i++) {
                if (!results.warnings[0]) break;
                const { author, timestamp, reason } = results.warnings.shift()

                reply += `${counter}. **Warning** \nIssued By: <@${author}> **|** Issued At: **${moment(timestamp).format("MMM DD YYYY")}** \nReason: \`${reason}\`\n\n`

                counter++
            }

            let embed = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL())
                .setAuthor(`Warnings for ${target.user.username}`, target.user.displayAvatarURL())
                .setThumbnail(message.guild.iconURL())
                .setDescription(reply)

            embeds.push(embed)
        }
        
        paginate(message, embeds, { time: 1000 * 30 })
    }
}