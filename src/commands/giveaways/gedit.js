const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const ms = require('ms')

module.exports = {
    name: "gedit",
    category: "Giveaways",
    aliases: ['ged', 'editgaw'],
    description: "Edits a existing giveaway",
    usage: "To edit a giveaway use: \`PREFIXgdelete [messageid] [time] [winners] [prize]\` Giveways will be deleted from the database after 60 minutes",
    perms: ['MANAGE_GUILD'],
    examples: "\`PREFIXgedit 791130961475141642 20s 4 More of my respect\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const GIVEEMBED = new Discord.MessageEmbed()
        let messageID = args[0];

        let giveawayDuration = args[1];

        if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
            return message.channel.send(GIVEEMBED.setColor(message.guild.me.displayColor).setDescription('**Please provide a valid duration**'));
        }

        let giveawayWinners = args[2];

        if (isNaN(giveawayWinners) || (parseInt(giveawayWinners) <= 0)) {
            return message.channel.send(GIVEEMBED.setColor(message.guild.me.displayColor).setDescription('**Please provide a valid number of winners!**'))
        }

        let giveawayPrize = args.slice(3).join(" ");

        if (!messageID) {
            return message.channel.send(GIVEEMBED.setColor(message.guild.me.displayColor).setDescription('**Please provide a message ID.**'))
        }

        client.giveaways.edit(messageID, {
            newWinnerCount: giveawayWinners,
            newPrize: giveawayPrize,
            addTime: ms(giveawayDuration)
        }).then(() => {

            message.channel.send(GIVEEMBED.setColor(message.guild.me.displayColor).setDescription("**Success! Giveaway will updated very soon.**"));
        }).catch((_err) => {

            message.channel.send(GIVEEMBED.setColor(message.guild.me.displayColor).setDescription("**No giveaway found for " + messageID + ", please check and try again**"));
        });
    }
}