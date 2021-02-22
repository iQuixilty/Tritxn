////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor;
const { MessageEmbed, Collection } = require('discord.js')
const { setCooldown } = require('../../../utils/utils')

/**
 * @type {import('../../../typings.d').Command}
 */
module.exports = {
    name: "alias",
    category: "Utility",
    aliases: ['ali'],
    canNotDisable: true,
    ignoreDisabledChannels: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    description: "Allows the server owner to add custom aliases to your server",
    usage: "- \`PREFIXalias\` to display all custom aliases\n- \`PREFIXalias [set/remove] [new alias] [command name]\` to set/remove aliases.",
    serverOwnerOnly: true,

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let guildInfo = client.guildInfoCache.get(message.guild.id)
        let commandAlias = guildInfo.commandAlias ? Object.entries(guildInfo.commandAlias) : []
        let commands = new Collection();
        const embed = new MessageEmbed()
            .setTitle('Custom command aliases')
            .setTimestamp()
            .setColor(message.guild.me.displayColor)

        if (!args[0]) {
            if (commandAlias.length === 0) {
                embed.setDescription('There are no custom aliases for this server set yet.')
            } else {
                for ([alias, command] of commandAlias) {
                    let aliases = commands.get(command)
                    if (!aliases || aliases[1].length === 0) aliases = [command, [alias]]
                    else aliases[1].push(alias)

                    commands.set(command, aliases)
                }

                let text = ""
                for (const a of commands.array()) {
                    text += `**${a[0]}**\n\`${a[1].join('`, `')}\`\n`
                }
                embed.setDescription(text)
            }
        } else {
            let action = args[0].toLowerCase()
            args.shift()

            let aliasAlreadyExists, command;
            switch (action) {
                case 'set':
                    if (args.length < 2) {
                        embed.setDescription(`${message.author}, please check the usage of the command.`)
                        break;
                    }

                    aliasAlreadyExists = client.commands.get(args[0]) || (guildInfo.commandAlias ? guildInfo.commandAlias[args[0]] : false)
                    command = client.commands.get(args[1])

                    if (aliasAlreadyExists) {
                        embed.setDescription(`${message.author}, this alias is already in use for the command: \`${aliasAlreadyExists.name ? aliasAlreadyExists.name : aliasAlreadyExists}\``)
                        break;
                    }

                    if (command.canNotAddAlias) {
                        embed.setDescription(`${message.author}, you can not add aliases to the command \`${args[1]}\`.`)
                    }

                    if (!command) {
                        embed.setDescription(`${message.author}, the command \`${args[1]}\` doesn't exist.`)
                        break;
                    }

                    if (!guildInfo.commandAlias) guildInfo.commandAlias = {}

                    guildInfo.commandAlias[args[0]] = command.name
                    guildInfo = await client.DBGuild.findByIdAndUpdate(message.guild.id, { $set: { commandAlias: guildInfo.commandAlias } }, { new: true, upsert: true, setDefaultsOnInsert: true })

                    embed.setDescription(`${message.author}, the command \`${command.name}\` has been given the new alias \`${args[0]}\``)
                    break;
                case 'remove':
                    if (args.length < 1) {
                        embed.setDescription(`${message.author}, please check the usage of the command.`)
                        break;
                    }

                    aliasAlreadyExists = guildInfo.commandAlias[args[0]]
                    if (!aliasAlreadyExists) {
                        embed.setDescription(`${message.author}, that alias doesn't exist yet.`)
                        break;
                    }

                    delete guildInfo.commandAlias[args[0]]
                    guildInfo = await client.DBGuild.findByIdAndUpdate(message.guild.id, { $set: { commandAlias: guildInfo.commandAlias } }, { new: true, upsert: true, setDefaultsOnInsert: true })

                    embed.setDescription(`${message.author}, the alias \`${args[0]}\` has been removed.`)
                    break;
            }
            client.guildInfoCache.set(message.guild.id, guildInfo)
        }
        message.channel.send(embed)
    }
}