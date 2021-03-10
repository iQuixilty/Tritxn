const { Guild, Client, MessageEmbed } = require('discord.js')
const PREFIX = require('../../config/config.json').PREFIX;
// const message.guild.me.displayColor = require('../../config/config.json').message.guild.me.displayColor

const getDefaultChannel = (guild) => {
    let channel;
    // Get "original" default channel
    if (guild.channels.cache.has(guild.id)) {
        channel = guild.channels.cache.get(guild.id)
        if (channel.permissionsFor(guild.client.user).has("SEND_MESSAGES")) {
            return guild.channels.cache.get(guild.id)
        }
    }

    // Check for a "general" channel, which is often default chat
    channel = guild.channels.cache.find(channel => channel.name === "general" && channel.permissionsFor(guild.client.user).has("SEND_MESSAGES"));
    if (channel) return channel;

    // Now we get into the heavy stuff: first channel in order where the bot can speak
    return guild.channels.cache
        .filter(c => c.type === "text" &&
            c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
        .sort((a, b) => a.position - b.position)
        .first();
}


module.exports = async (client, guild) => {
    const Invite = new MessageEmbed()
        .setTitle(`Thank you for inviting me to \`\`${guild.name}\`\`!`)
        .setColor('RED')
        .setThumbnail(guild.iconURL())
        .addFields(
            {
                name: `My default prefix is`,
                value: `\`\`${PREFIX}\`\` To change it, use \`${PREFIX}setprefix [New prefix]\`!`,
            },
            {
                name: `For a list of commands`,
                value: `I would recomend typing \`${PREFIX}help\``,
            },
            {
                name: `If you have any problems with me ,please join the support server!`,
                value: `[Support Server Link](https://discord.gg/2CGSnFhxVy)`,// This is optional if you have a support server
                inline: true,
            },
            {
                name: `If you want to invite me to your server please click below!`,
                value: `[Invite me!](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)`,
            },
        )
        .setFooter(`And a special thanks from the creator of ${client.user.username}`)

    if (guild.available) {
        const channel = getDefaultChannel(guild);
        if (!channel) return;
        channel.send(Invite)
    }

    const channelId = '784592088729255946';
    const channel = client.channels.cache.get(channelId);
    const invChannel = getDefaultChannel(guild);
    invChannel.createInvite()
        .then(invite => {
            if (!channel) return;

            const embed = new MessageEmbed()
                .setTitle('I Joined A Guild!')
                .setDescription(`**Guild Name:** ${guild.name} (${guild.id})\n**Members:** ${guild.memberCount}\n**Owner:** ${guild.owner}\n**Invite Link:** [Click Here!](${invite.url})`)
                .setTimestamp()
                .setColor('GREEN')
                .setFooter(`I'm In ${client.guilds.cache.size} Guilds Now!`);
            channel.send(embed);
        })


}
