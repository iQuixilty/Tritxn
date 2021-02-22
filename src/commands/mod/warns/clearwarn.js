const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const mongo = require('../../../../schemas/mongo')
const warnSchema = require('../../../../schemas/warn-schema')

const emoji = require('../../../../config/emoji.json')

module.exports = {
    name: "clearwarn",
    category: "Moderation",
    description: "Clears the warnings of a user",
    aliases: ['clearw', 'rmwarn', 'clw'],
    usage: "\`PREFIXclearwarn [user]\`",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let target =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0])

        const guildId = message.guild.id


        const warningE = new Discord.MessageEmbed()

        if (!target) {
            message.channel.send(warningE.setColor('RED').setDescription(`**${emoji.downvote} Please specify a user to clear the warnings for**`))
            return
        }

        if (target.bot) {
            message.channel.send(warningE.setColor('RED').setDescription(`**${emoji.downvote} Bots don\'t have warnings**`))
            return
        }

        const userId = target.id

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

        await warnSchema.findOneAndDelete({
            guildId,
            userId
        })

        message.channel.send(warningE
            .setColor(message.guild.me.displayColor)
            .setDescription(`**Warnings for <@${userId}> have been cleared**`)
            .setFooter(`Moderator Responsible: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true })))


    }
}