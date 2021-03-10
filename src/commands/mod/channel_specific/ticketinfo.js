const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { MessageAttachment } = require('discord.js')

const fs = require('fs');
const fetchAll = require('discord-fetch-all');

/**
 * @type {import('../../../typings.d').Command}
 */

module.exports = {
    name: "ticketinfo",
    category: "Moderation",
    aliases: ["ti"],
    description: "Shows some info about a ticket",
    usage: "\`PREFIXticketinfo\`",
    perms: ['ADMINISTRATOR'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],

    execute: async function (client, message, args) {

        const ct = new Discord.MessageEmbed()
       
        if (!message.channel.name.includes('ticket')) {
            return message.channel.send(ct.setColor(message.guild.me.displayColor).setTitle("This message needs to be sent in a open ticket."))
        }

        const l = await message.channel.send(ct.setColor(message.guild.me.displayColor).setTitle("Here is some info on the ticket").setDescription(`React with ⛔ if you want to close the ticket! \n\nReact with 🎫 if you want to save the transcript of this channel! \n\n React with ✅ to do nothing!`).setAuthor(message.member.displayName, message.member.user.displayAvatarURL()))
        await l.react('⛔')
        await l.react('🎫')
        await l.react('✅')

        const ct2 = new Discord.MessageEmbed()

        const filter = (reaction, user) => ['⛔', '🎫', '✅'].includes(reaction.emoji.name) && user.id === message.author.id
        const response = await l.awaitReactions(filter, {
            max: 1,
            time: 8.64e+7
        });
        if (!response.size) {
            return undefined;
        }
        const emoji = response.first().emoji.name;

        if (emoji === '✅') {
            message.channel.bulkDelete(2, true)
            message.channel.send(ct2.setColor(message.guild.me.displayColor).setDescription("**Ok nevermind**"))
        }

        if (emoji === '⛔') {
            message.channel.bulkDelete(2, true)
            message.channel.send(ct2.setColor(message.guild.me.displayColor).setDescription("**Ok deleting this channel in 10 seconds...**"))
            setTimeout(async () => {
                await message.channel.delete()
            }, 10000)
        }

        if (emoji === '🎫') {
            message.channel.send(ct2.setColor(message.guild.me.displayColor).setDescription("**Generating transcript...**"))

            const msgs = await fetchAll.messages(message.channel, {
                reverseArray: true
            })
            

            const content = msgs.map(m => `${m.author.tag} - ${m.content}`)

            fs.writeFileSync('transcript.txt', content.join('\n'), error => {
                if (error) throw error
            })

            message.channel.send(new MessageAttachment('transcript.txt', 'transcript.txt'))
        }
    }
}