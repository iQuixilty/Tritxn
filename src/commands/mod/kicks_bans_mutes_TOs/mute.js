const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const modLogSchema = require('../../../../schemas/modLogSchema')

const ms = require('ms');
const emoji = require('../../../../config/emoji.json')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "mute",
    category: "Moderation",
    description: "Mute any user in the server that has a role lower than the bots. The bot will need to be able to manage roles for the command to be run. (If the mute doesnt work, go to settings then roles and move the muted role above every role)",
    usage: `\`PREFIXmute [user] [time] [reason]\``,
    perms: ['MANAGE_ROLES'],
    ignoreDisabledChannels: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],

    execute: async function (client, message, args) {
        const tempmute = new Discord.MessageEmbed()

        let guildInfo = client.guildInfoCache.get(message.guild.id)
        let mutedRole = guildInfo.mutedRole

        if (mutedRole === undefined) {
            return message.channel.send(tempmute.setColor(message.guild.me.displayColor).setDescription(`**You have not set a muted role for this server yet!**`))
        }

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])



        if (!member) return message.channel.send(tempmute
            .setColor('RED')
            .setDescription(`**${message.author} please provide a member to mute**`))

        const guildId = message.guild.id
        const userId = member.user.id

        let role = message.guild.roles.cache.get(mutedRole);

        let time = args[1];
        if (!time || isNaN(ms(time))) {
            return message.channel.send(tempmute
                .setColor('RED')
                .setDescription(`**${message.author} please specify a valid time limit!**`));
        }

        let reason = args.slice(2).join(" ")
        if (!reason) {
            reason = 'No Reason Given'
        }


        client.muted.add(member.user.id)
        member.roles.add(role.id);


        message.channel.send(tempmute
            .setColor('GREEN')
            .setDescription(`**Muted \`${member.user.tag} (${member.user.id})\` \n\nFor: \`${ms(ms(time), { long: true })}\` \n\nReason: \`${reason}\`**`)
            .setThumbnail(`${member.user.displayAvatarURL({ dynamic: true })}`)
            .setFooter(`Moderator: ${message.author.tag}`))


        member.send(tempmute.setColor(message.guild.me.displayColor).setDescription(`**You have been muted in ${message.guild.name} \n\nMuted For: \`${ms(ms(time), { long: true })}\`  \n\nReason: \`${reason}\`**`))
            .catch((e) => {
                return;
            })

        const modlog = {
            author: message.member.id,
            timestamp: new Date().getTime(),
            type: 'Mute',
            reason
        }

        await modLogSchema.findOneAndUpdate({
            guildId,
            userId
        }, {
            guildId,
            userId,
            $push: {
                modlogs: modlog
            }
        }, {
            upsert: true,
        })

        setTimeout(async () => {
            if (client.muted.has(member.user.id)) {
                member.roles.remove(role.id);

                const tempmute2 = new Discord.MessageEmbed()
                message.channel.send(tempmute2
                    .setColor('GREEN')
                    .setDescription(`**${emoji.upvote} ${member} has been unmuted.**`)
                    .setFooter("Automatic Unmute", client.user.avatarURL()))

                const unmute = new Discord.MessageEmbed()
                member.send(unmute.setColor(message.guild.me.displayColor).setDescription(`**You have been unmuted in ${message.guild.name}**`))
                    .catch((e) => {
                        console.log(`I couldnt DM the user`)
                    })
            } else {
                return;
            }
        }, ms(time));

    }
}