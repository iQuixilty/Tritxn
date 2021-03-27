const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const emoji = require('../../../../config/emoji.json')
const { setCooldown } = require('../../../utils/utils')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "clear",
    category: "Moderation",
    aliases: ['purge'],
    ignoreDisabledChannels: true,
    cooldown: 5,
    description: "Purges a number of messages",
    usage: "\`PREFIXclear [amount]\`",
    perms: ['MANAGE_MESSAGES'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES'],

    execute: async function (client, message, args) {
        const clearCommand = new Discord.MessageEmbed

        let deleteAmount;

        try {
            if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
                return await message.channel.send(clearCommand
                    .setColor('RED')
                    .setDescription(`**${emoji.downvote} ${message.author} please only put a number!**`))
            }

            if (parseInt(args[0]) >= 100) {
                await message.channel.send(clearCommand
                    .setColor('RED')
                    .setDescription(`**${emoji.downvote} ${message.author} you can only delete 99 messages with one command!**`))
                return;
            } else {
                deleteAmount = await parseInt(args[0])
            }

            setCooldown(client, this, message);
            message.delete()

            let rounded = Math.floor(deleteAmount / 100) * 100;
            const diff = deleteAmount - rounded
            let deletedMsgs = [];
            let notPinneda = [];


            const notify = await message.channel.send(clearCommand
                .setColor('GREEN')
                .setDescription(`**${emoji.upvote} Deleting messages...**`))

            const fetcheda = await message.channel.messages.fetch({
                limit: diff,
                before: message.id
            });

            fetcheda.forEach(m => {
                if (!m.pinned) notPinneda.push(m);
            });
            const deleted = await message.channel.bulkDelete(notPinneda, {
                filterOld: true
            });

            await deleted.tap(m => deletedMsgs.push(m));

            while (rounded > 0) {
                let notPinned = [];
                const fetched = await message.channel.messages.fetch({
                    limit: 100,
                    before: message.id
                });
                fetched.forEach(m => {
                    if (!m.pinned) notPinned.push(m);
                });
                const deleted = await message.channel.bulkDelete(notPinned, {
                    filterOld: true
                });
                await deleted.tap(m => deletedMsgs.push(m));
                rounded -= 100;
            }

            try {
                const msg = await notify.edit(clearCommand
                    .setColor('GREEN')
                    .setDescription(`**${emoji.upvote} Successfully Deleted ${deleteAmount} Messages**`))
                await msg.delete({ timeout: 2000 })

            } catch (e) {
                return;
            }
        } catch (e) {
            return;
        }
    }

}
