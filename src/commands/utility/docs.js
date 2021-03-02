const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const fetch = require('node-fetch')

/**
 * @type {import('../../typings.d').Command}
 */


module.exports = {
    name: "docs",
    category: "Utility",
    description: "Fetches documentation of a string",
    usage: "\`PREFIXdocs\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const query = args.join(" ")

        const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(query)}`;

        const docFetch = await fetch(url);
        const embed = await docFetch.json();

        if (!embed || embed.error) {
            return message.reply(`"${query}" couldn't be located within the discord.js documentation (<https://discord.js.org/>).`)
        }

        if (!message.guild) {
            return message.channel.send({ embed })
        }

        const msg = await message.channel.send({ embed })
        msg.react('🗑')

        let react;

        try {
            react = await msg.awaitReactions(
                (reaction, user) => reaction.emoji.name === `🗑` && user.id === message.author.id,
                { max: 1, time: 10000, errors: ['time'] }
            )
        } catch (error) {
            msg.reactions.removeAll().catch((e) => { return; })
        }

        if (react && react.first()) {
            msg.delete()
        }

        return message;
    }
}