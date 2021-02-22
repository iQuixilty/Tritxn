const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const { setCooldown } = require('../../../utils/utils')

const emoji = require('../../../../config/emoji.json')

module.exports = {
    name: "ticket",
    category: "Moderation",
    description: "Opens up a ticket",
    usage: "\`PREFIXticket\`",
    cooldown: 300,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],

    execute: async function (client, message, args) {

        const ticketEmbed = new Discord.MessageEmbed()

        const user = message.author.id;
        const user2 = message.author.username

        const name = user2 + "s-ticket";

        if (message.guild.channels.cache.find(ch => ch.name == name)) {
            message.channel.send(ticketEmbed
                .setColor('RED')
                .setTitle(`${emoji.downvote} You have already opened a ticket`))
        } else {
            setCooldown(client, this, message);
            
            message.guild.channels.create(name).then(async (chan) => {
                chan.updateOverwrite(message.guild.roles.everyone, {
                    SEND_MESSAGES: false,
                    VIEW_CHANNEL: false
                })
                chan.updateOverwrite(user, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true
                })
                message.channel.send(ticketEmbed
                    .setColor('GREEN')
                    .setTitle(`${emoji.upvote} I have created a ticket for you`));

                await chan.send(ticketEmbed
                    .setColor(message.guild.me.displayColor)
                    .setAuthor(`Hello ${message.author.username}, thank you for opening a ticket`)
                    .setTitle("New Ticket!").setFooter(`${chan.name} | Use r!ticketinfo for more help`)
                    .setDescription(`Thanks for opening a ticket.  Please let us know why you have opened a ticket and a mod will get to you as fast as possible. 📌`)
                    .setThumbnail(client.user.displayAvatarURL()))
                    .then((m) => { m.pin() })
            })
        }
    }
}