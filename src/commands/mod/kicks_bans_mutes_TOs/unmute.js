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

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!member) return message.channel.send(unmute.setColor('RED').setDescription(`**${emoji.downvote} ${message.author} provide someone to unmute**`))

        let role = message.guild.roles.cache.find(role => role.name === "Muted");

        if (!role) {
            return message.channel.send(unmute.setColor('RED').setDescription(`**${emoji.downvote} ${message.author} I couldn't find the \`muted\` role**`))
        }

        if (!member.roles.cache.has(role.id)) {
            return message.channel.send(unmute.setColor('RED').setDescription(`**${emoji.downvote} ${message.author} this user is not muted right now**`))
        }

        member.roles.remove(role.id);
        client.muted.delete(member.user.id)


        message.channel.send(unmute.setColor('GREEN').setDescription(`**${emoji.upvote} ${member} has now been unmuted**. \n\n**Moderator:** ${message.author}`))

        const unmutE = new Discord.MessageEmbed()
        member.send(unmutE.setColor(message.guild.me.displayColor).setDescription(`**You have been unmuted in ${message.guild.name}**`))
            .catch((e) => {
                console.log(`I couldnt DM the user`)
            })
    }
}