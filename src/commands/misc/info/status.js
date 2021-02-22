const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

module.exports = {
    name: "status",
    category: "Misc",
    description: "Sets the status of me",
    usage: "\`PREFIXstatus [status]\` This command is only for developers.",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const { channel, author } = message;

        const stat = new Discord.MessageEmbed()

        if (message.author.id !== '751606134938402866') {
            message.channel.send(stat
                    .setColor(message.guild.me.displayColor)
                    .setTitle(`${author.username} you don't have permission to use this!`))
            return;
        }

        function ifInvalidStatusType(statusType) {

            const types = ['online', 'invisible', 'dnd', 'idle'];

            if (types.includes(statusType)) {
                client.user.setStatus(statusType);

                channel.send(stat
                        .setColor(message.guild.me.displayColor)
                        .setTitle(`${author.username} I changed my status to \`${statusType}\`!`))
                return
            }
            else {
                channel.send(stat
                        .setColor(message.guild.me.displayColor)
                        .setTitle(`${author.username} invalid status type!`))
                return
            }
        }


        if (!args[0]) {
            channel.send(stat
                    .setColor(message.guild.me.displayColor)
                    .setDescription("\nPrefix: `r!status <status>`\t\n\n**Statuses to choose between:**\n\n:green_circle: **`Online`**\n\n👤 **`Invisible`**\n\n🔴 **`Dnd`**\n\n:waxing_crescent_moon: **`Idle`**\n\n")
                    .setFooter(`|Please write the status types all lowercase|`)
                    .setTimestamp()
            ).catch(err => console.error(err));
            return;
        }

        if (args[0]) {
            ifInvalidStatusType(args[0]);
            return;
        }
    }
}