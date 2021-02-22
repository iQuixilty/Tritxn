////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor;
const { MessageEmbed, DiscordAPIError } = require('discord.js')
const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "commands",
    category: "Utility",
    aliases: ["com"],
    usage: "- \`PREFIXcommands\` to display all currently disabled commands\n- \`PREFIXcommands [command] [disable/enable]\` to disable/enable commands.",
    canNotDisable: true,
    ignoreDisabledChannels: true,
    description: "Allows you to disable and enable commands",
    perms: ['ADMINISTRATOR'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let guildInfo = client.guildInfoCache.get(message.guild.id);
        let disabledCommands = guildInfo.disabledCommands;

        const comE = new MessageEmbed()

        if (!args[0]) {
            const embed = new MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setTimestamp()
                .setTitle('Disabled Commands')
                .setDescription(disabledCommands.length === 0 ? 'There are no disabled commands in this server!' : '\`' + disabledCommands.join('\`, \`') + '\`')

            message.channel.send(embed)
        } else {
            if (!args[0]) return message.channel.send(comE.setColor(message.guild.me.displayColor).setDescription('**Please specify a command**'));

            const command = client.commands.get(args[0].toLowerCase())
            if (!command) return message.channel.send(comE.setColor(message.guild.me.displayColor).setDescription(`**The command \`${args[0]}\` does not exist**`))

            if (command.canNotDisable) return message.channel.send(comE.setColor(message.guild.me.displayColor).setDescription(`**The command \`${command.name}\` can not be disabled/enabled**`))

            setCooldown(client, this, message);
            switch (args[1]) {
                case 'disable':
                    if (disabledCommands.includes(command.name)) return message.channel.send(comE.setColor(message.guild.me.displayColor).setDescription(`**The command \`${command.name}\` is already disabled**`))

                    await client.DBGuild.findByIdAndUpdate(message.guild.id, { $push: { disabledCommands: command.name } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildInfo.disabledCommands.push(command.name)
                    client.guildInfoCache.set(message.guild.id, guildInfo)

                    message.channel.send(comE.setColor(message.guild.me.displayColor).setDescription(`**The command \`${command.name}\` has been disabled**`))
                    break;
                case 'enable':
                    if (!disabledCommands.includes(command.name)) return message.channel.send(comE.setColor(message.guild.me.displayColor).setDescription(`**The command \`${command.name}\` is already enabled**`))

                    guildInfo = await client.DBGuild.findByIdAndUpdate(message.guild.id, { $pull: { disabledCommands: command.name } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    client.guildInfoCache.set(message.guild.id, guildInfo)

                    message.channel.send(comE.setColor(message.guild.me.displayColor).setDescription(`**The command \`${command.name}\` has been enabled**`))
                    break;
            }
        }
    }
}
