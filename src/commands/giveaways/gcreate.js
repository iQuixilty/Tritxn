const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const ms = require('ms')

/** 
 * @type {import('../../typings.d').Command}
*/

module.exports = {
    name: "gcreate",
    category: "Giveaways",
    aliases: ['gcre', 'creategaw', `gstart`],
    description: "Starts a giveaway",
    usage: "To start a giveaway use: \`PREFIXgcreate [duration] [winners] [prize]\` Giveways will be deleted from the database after 60 minutes",
    perms: ['MANAGE_GUILD'],
    examples: "\`PREFIXgcreate 10s 2 My Respect\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const giveembed = new Discord.MessageEmbed();

        let channel = message.channel

        let giveawayDuration = args[0];

        if (!giveawayDuration || isNaN(ms(giveawayDuration))) return message.channel.send(giveembed.setColor(message.guild.me.displayColor).setDescription('**Please provide a valid duration**'));

        let giveawayWinners = args[1];

        if (isNaN(giveawayWinners) || (parseInt(giveawayWinners) <= 0)) return message.channel.send(giveembed.setColor(message.guild.me.displayColor).setDescription('**Please provide a valid number of winners!**'));

        let giveawayPrize = args.slice(2).join(" ");

        if (!giveawayPrize) return message.channel.send(giveembed.setColor(message.guild.me.displayColor).setDescription('**What prize do you wanna give?**'));
        client.giveaways.start(channel, {
            time: ms(giveawayDuration),
            prize: giveawayPrize,
            winnerCount: giveawayWinners,
            hostedBy: message.author,
            messages: {
                giveaway: "",
                giveawayEnded: "",
                timeRemaining: "Time remaining: **{duration}**",
                inviteToParticipate: "React with <a:tada:811787239494516767> to enter",
                winMessage: "Congrats {winners}, you won **{prize}**",
                embedFooter: "Giveaway time!",
                noWinner: "Couldn't determine a winner",
                hostedBy: "Hosted by {user}",
                winners: "winner(s)",
                endedAt: "Ends at",
                units: {
                    seconds: "seconds",
                    minutes: "minutes",
                    hours: "hours",
                    days: "days",
                    pluralS: false
                }
            }
        });

    }
}