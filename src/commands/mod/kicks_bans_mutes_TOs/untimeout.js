const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const emoji = require('../../../../config/emoji.json')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "untimeout",
    category: "Moderation",
    aliases: ["unTO", 'unto'],
    description: "Removes a user from a timeout role",
    usage: "\`PREFIXuntimeout [user]\`",
    perms: ['MANAGE_MESSAGES'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES', 'MANAGE_MESSAGES'],

    execute: async function (client, message, args) {

        const unTO = new Discord.MessageEmbed()


        let guildInfo = client.guildInfoCache.get(message.guild.id)
        let timeoutRole = guildInfo.timeoutRole


        if (timeoutRole === undefined) {
            return message.channel.send(unTO.setColor(message.guild.me.displayColor).setDescription(`**You have not set a time out role for this server yet!**`))
        }

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!member) return message.channel.send(unTO
            .setColor('RED')
            .setDescription(`**${message.author} please provide someone to remove from time-out**`))

        let role = message.guild.roles.cache.get(timeoutRole);

        if (!member.roles.cache.has(role.id)) {
            return message.channel.send(unTO
                .setColor('RED')
                .setDescription(`**${message.author} this user is on time-out right now.**`))
        }

        member.roles.remove(role.id);
        client.timeout.delete(member.user.id)

        message.channel.send(unTO
            .setColor('GREEN')
            .setDescription(`**${member} has now been removed from time-out.**`)
            .setFooter(`Moderator: ${message.author.tag}`))

        const unTo = new Discord.MessageEmbed()
        member.send(unTo.setColor(message.guild.me.displayColor).setDescription(`**You have been removed from time-out in ${message.guild.name}**`))
            .catch((e) => {
                console.log(`I couldnt DM the user`)
            })
    }
}