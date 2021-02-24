const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const ms = require('ms');

const emoji = require('../../../../config/emoji.json')
const modLogSchema = require('../../../../schemas/modLogSchema')

module.exports = {
    name: "timeout",
    category: "Moderation",
    aliases: ["to"],
    ignoreDisabledChannels: true,
    description: "Gives a timeout role to a user",
    usage: "\`PREFIXtimeout [user] [time] [reason]\`",
    perms: ['MANAGE_MESSAGES'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES', 'MANAGE_MESSAGES'],

    execute: async function (client, message, args) {
        const timeout = new Discord.MessageEmbed()

        let guildInfo = client.guildInfoCache.get(message.guild.id)
        let timeoutRole = guildInfo.timeoutRole



        if (timeoutRole === undefined) {
            return message.channel.send(timeout.setColor(message.guild.me.displayColor).setDescription(`**You have not set a time out role for this server yet!**`))
        }

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])


        if (!member) {
            return message.channel.send(timeout
                .setColor('RED')
                .setDescription(`**${message.author} please provide a member to time-out**`))
        }

        const guildId = message.guild.id
        const userId = member.user.id

        let role = message.guild.roles.cache.get(timeoutRole);

        let time = args[1];
        if (!time || isNaN(ms(time))) {
            return message.channel.send(timeout
                .setColor('RED')
                .setDescription(`**${message.author} please specify a time limit!**`));
        }

        let reason = args.slice(2).join(" ")
        if (!reason) {
            reason = "No Reason Given"
        }

        member.roles.add(role.id);

        client.timeout.add(member.user.id)


        message.channel.send(timeout
            .setThumbnail(`${member.user.displayAvatarURL({ dynamic: true })}`)
            .setColor('GREEN')
            .setDescription(`**Timed-out \`${member.user.tag} (${member.user.id})\` \n\nFor: \`${ms(ms(time), { long: true })}\` \n\nReason: \`${reason}\`**`)
            .setFooter(`Moderator: ${message.author.tag}`))


        member.send(timeout.setColor(message.guild.me.displayColor).setDescription(`**You have been put on time-out in ${message.guild.name} \n\nTimed Out For: \`${ms(ms(time), { long: true })}\`  \n\nReason: \`${reason}\`**`))
            .catch((e) => {
                console.log(`I couldnt DM the user`)
            })


        const modlog = {
            id: makeid(5),
            author: message.member.id,
            timestamp: new Date().getTime(),
            type: 'Timeout',
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



        const to2 = new Discord.MessageEmbed()
        setTimeout(function () {
            if (client.timeout.has(member.user.id)) {
                member.roles.remove(role.id);
                message.channel.send(to2
                    .setColor('GREEN')
                    .setDescription(`**${emoji.upvote} ${member} has been removed from timeout**`)
                    .setFooter("Automatic Removal", client.user.avatarURL()))

                const unto = new Discord.MessageEmbed()
                member.send(unto.setColor(message.guild.me.displayColor).setDescription(`**You have been removed from timeout out in ${message.guild.name}**`))
                    .catch((e) => {
                        console.log(`I couldnt DM the user`)
                    })
            } else {
                return;
            }
        }, ms(time));
    }
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}