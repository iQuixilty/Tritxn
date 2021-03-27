// ////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor;
const { msToTime, setCooldown } = require('../../utils/utils');
const { MessageEmbed, Message, Collection } = require("discord.js");

const replacePrefix = (string, guildPrefix) => {
    return string.replace(/PREFIX/g, guildPrefix);
};

module.exports = {
    name: "help",
    category: "Misc",
    aliases: ["h"],
    description: "Get help on commands.",
    usage: "To get help on a specific command, use \`PREFIXhelp [command name]\` (without the [ ]).\nFor a full list of all commands, simply use \`PREFIXhelp\`.",
    examples: "\`PREFIXhelp ping\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let guildInfo = client.guildInfoCache.get(message.guild.id)
        let guildPrefix = guildInfo.prefix

        if (!args.length) {
            return defaultHelp(client, message, guildPrefix);
        }

        const queryName = args.join(' ').toLowerCase();
        const command = client.commands.get(queryName) || (guildInfo.commandAlias ? client.commands.get(guildInfo.commandAlias[queryName]) : false)

        const category = client.categories.get(queryName)

        if (command && !command.hideCommand) {
            let hEmbed = new MessageEmbed()
                .setTitle(`${command.name}`)
                .setAuthor(command.category ? command.category : 'No category')
                .setColor(message.guild.me.displayColor)
                .setTimestamp();

            if (command.description) hEmbed.setDescription(replacePrefix(command.description, guildPrefix))

            if (command.usage) hEmbed.addField("Usage", replacePrefix(command.usage, guildPrefix))

            let customAliases = getCommandAliases(client, message.guild.id, command.name)
            let aliases = []
            if (command.aliases && command.aliases.length !== 0) aliases = aliases.concat(command.aliases)
            if (customAliases && customAliases.length !== 0) aliases = aliases.concat(customAliases)
            if (aliases.length > 0) hEmbed.addField('Aliases', '`' + aliases.join('`, `') + '`')


            if (command.examples) hEmbed.addField("Examples", replacePrefix(command.examples, guildPrefix))

            let cd;
            let savedCD;
            if (command.savedCooldown) savedCD = command.savedCooldown
            if (command.cooldown) cd = command.cooldown
            if (guildInfo.commandCooldowns && guildInfo.commandCooldowns[command.name]) {
                let roles = Object.keys(guildInfo.commandCooldowns[command.name])
                let highestRole = message.member.roles.cache.filter(role => roles.includes(role.id)).sort((a, b) => b.position - a.position).first()
                if (highestRole) cd = guildInfo.commandCooldowns[command.name][highestRole.id]
            }
            if (cd) hEmbed.addField("Cooldown", `${msToTime(cd * 1000)}`)
            if (savedCD) hEmbed.addField("Cooldown", `${msToTime(savedCD * 1000)}`)

            if (client.guildInfoCache.get(message.guild.id).disabledCommands.includes(command.name)) hEmbed.setAuthor('This command is currently disabled in this server.')

            message.channel.send(hEmbed);
        } else if (category) {
            let hEmbed = new MessageEmbed()
                .setTitle(category[0])
                .setColor(message.guild.me.displayColor)
                .setTimestamp()
                .setFooter(`${category.length - 1} commands!`)
                .setDescription('`' + category.slice(1).join('`, `') + '`')

            message.channel.send(hEmbed)
        } else defaultHelp(client, message, guildPrefix)
    }
}

function defaultHelp(client, message, guildPrefix) {
    let hEmbed = new MessageEmbed()
        .setTitle("Command Categories")
        .setColor(message.guild.me.displayColor)
        .setDescription(`Use \`${guildPrefix}help [category]\` to get more info on a category, for example: \`${guildPrefix}help misc\``)
        .setTimestamp()
        .setThumbnail(client.user.displayAvatarURL())
        .addField('Categories', `🕹  **  -  Games** \n\n🎉  **  -  Giveaways**\n\n🛠  **  -  Moderation**\n\n✨  **  -  Misc**\n\n📷  **  -  Images**\n\n🎼  **  -  Music**\n\n🔧  **  -  Utility**\n\n💰  **  -  Economy**\n\n🎇  **  -  Levels**`)

    message.channel.send(hEmbed);
}

//client.categories.map(c => '**-** ' + c[0]).join('\n\n')

function getCommandAliases(client, guildId, commandName) {
    let guildInfo = client.guildInfoCache.get(guildId)
    let commandAlias = guildInfo.commandAlias ? Object.entries(guildInfo.commandAlias) : []

    let commands = new Collection();
    for ([alias, command] of commandAlias) {
        let aliases = commands.get(command)
        if (!aliases || aliases.length === 0) aliases = [alias]
        else aliases.push(alias)

        commands.set(command, aliases)
    }
    return commands.get(commandName)
}