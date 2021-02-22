const { canModifyQueue } = require("../../utils/vcUtil");
const PREFIX = require('../../../config/config.json').PREFIX;
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const { MessageEmbed } = require("discord.js");

const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "queue",
    category: "Music",
    aliases: ["q"],
    cooldown: 5,
    description: "Shows the music queue and now playing",
    usage: "\`PREFIXqueue\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],

    execute: async function (client, message, args) {
        
        setCooldown(client, this, message);
        const qu = new MessageEmbed()

        const permissions = message.channel.permissionsFor(message.client.user);
        if (!permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"]))
            return message.reply(qu.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, missing permission to manage messages or add reactions**`));

        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send(qu.setColor(message.guild.me.displayColor).setDescription("❌ **Nothing playing in this server**"));

        let currentPage = 0;
        const embeds = generateQueueEmbed(message, queue.songs);

        const queueEmbed = await message.channel.send(
            `**Current Page - ${currentPage + 1}/${embeds.length}**`,
            embeds[currentPage]
        );

        try {
            await queueEmbed.react("⬅️");
            await queueEmbed.react("⏹");
            await queueEmbed.react("➡️");
        } catch (error) {
            console.error(error);
            message.channel.send(error.message).catch(console.error);
        }

        const filter = (reaction, user) =>
            ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name) && message.author.id === user.id;
        const collector = queueEmbed.createReactionCollector(filter, { time: 60000 });

        collector.on("collect", async (reaction, user) => {
            try {
                if (reaction.emoji.name === "➡️") {
                    if (currentPage < embeds.length - 1) {
                        currentPage++;
                        queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                    }
                } else if (reaction.emoji.name === "⬅️") {
                    if (currentPage !== 0) {
                        --currentPage;
                        queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                    }
                } else {
                    collector.stop();
                    reaction.message.reactions.removeAll();
                }
                await reaction.users.remove(message.author.id);
            } catch (error) {
                console.error(error);
                return message.channel.send(error.message).catch(console.error);
            }
        });
    }
};

function generateQueueEmbed(message, queue) {
    let embeds = [];
    let k = 10;

    for (let i = 0; i < queue.length; i += 10) {
        const current = queue.slice(i, k);
        let j = i;
        k += 10;

        const info = current.map((track) => `${++j} - [${track.title}](${track.url})`).join("\n");

        const embed = new MessageEmbed()
            .setTitle("Song Queue\n")
            .setThumbnail(message.guild.iconURL())
            .setColor(message.guild.me.displayColor)
            .setDescription(`**Current Song - [${queue[0].title}](${queue[0].url})**\n\n${info}`)
            .setTimestamp();
        embeds.push(embed);
    }

    return embeds;

};
