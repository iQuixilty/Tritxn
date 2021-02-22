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

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!member) return message.channel.send(unTO
            .setColor('RED')
            .setDescription(`**${emoji.downvote} ${message.author} please provide someone to remove from time-out**`))

        let role1 = message.guild.roles.cache.find(role => role.name === "Time-out");

        if (!role1) return message.channel.send(unTO
            .setColor('RED')
            .setDescription(`**${emoji.downvote} ${message.author} I couldn't find the \`Time-out\` role**`))

        if (!member.roles.cache.has(role1.id)) {
            return message.channel.send(unTO
                .setColor('RED')
                .setDescription(`**${emoji.downvote} ${message.author} this user is on time-out right now.**`))
        }

        member.roles.remove(role1.id);
        client.timeout.delete(member.user.id)

        message.channel.send(unTO
            .setColor('GREEN')
            .setDescription(`**${emoji.upvote} ${member} has now been removed from time-out.** \n\n**Moderator:** ${message.author}`))

        const unTo = new Discord.MessageEmbed()
        member.send(unTo.setColor(message.guild.me.displayColor).setDescription(`**You have been removed from time-out in ${message.guild.name}**`))
            .catch((e) => {
                console.log(`I couldnt DM the user`)
            })
    }
}