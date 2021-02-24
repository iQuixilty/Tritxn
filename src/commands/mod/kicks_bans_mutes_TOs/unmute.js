const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const emoji = require('../../../../config/emoji.json')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "unmute",
    category: "Moderation",
    aliases: ["unm"],
    ignoreDisabledChannels: true,
    description: "Unmutes a muted user",
    usage: "\`PREFIXunmute [user]\`",
    perms: ['MANAGE_MESSAGES'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES', 'MANAGE_MESSAGES'],

    execute: async function (client, message, args) {

        const unmute = new Discord.MessageEmbed()

        let guildInfo = client.guildInfoCache.get(message.guild.id)
        let mutedRole = guildInfo.mutedRole

        if (mutedRole === undefined) {
            return message.channel.send(unmute.setColor(message.guild.me.displayColor).setDescription(`**You have not set a muted role for this server yet!**`))
        }

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!member) return message.channel.send(unmute.setColor('RED').setDescription(`**${message.author} provide someone to unmute**`))

        let role = message.guild.roles.cache.get(mutedRole);

        if (!member.roles.cache.has(role.id)) {
            return message.channel.send(unmute.setColor('RED').setDescription(`**${message.author} this user is not muted right now**`))
        }

        member.roles.remove(role.id);
        client.muted.delete(member.user.id)


        message.channel.send(unmute.setColor('GREEN')
            .setDescription(`**${member} has now been unmuted**`)
            .setFooter(`Moderator: ${message.author.tag}`))

        const unmutE = new Discord.MessageEmbed()
        member.send(unmutE.setColor(message.guild.me.displayColor).setDescription(`**You have been unmuted in ${message.guild.name}**`))
            .catch((e) => {
                console.log(`I couldnt DM the user`)
            })
    }
}