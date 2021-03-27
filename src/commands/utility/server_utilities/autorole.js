const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "autorole",
    category: "Utility",
    aliases: ["autor", "joinrole"],
    description: "Sets a auto role for your server when a member joins",
    usage: "- \`PREFIXautorole\` to display the current autorole\n- \`PREFIXautorole [role] [set/remove]\` to set/remove the autorole.",
    perms: ['ADMINISTRATOR'],
    canNotDisable: true,
    ignoreDisabledChannels: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
    execute: async function (client, message, args) {
        const autoRE = new Discord.MessageEmbed()

        let guildSettings = client.guildSettingsCache.get(message.guild.id);

        let autoRole = guildSettings.autoRoleId

        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
      
        if (!role) {
            return message.channel.send(autoRE
                .setTimestamp()
                .setColor(message.guild.me.displayColor)
                .setTitle('Autorole')
                .setDescription(autoRole === undefined ? 'You have not set an autorole for this server!' : `${message.guild.roles.cache.get(autoRole)}`))
        }


        switch (args[1]) {
            case 'set':
                if (autoRole === role.id) return message.channel.send(autoRE.setColor(message.guild.me.displayColor).setDescription(`**This role is already the autorole**`))

                await client.DBSettings.findByIdAndUpdate(message.guild.id, { $set: { autoRoleId: role.id } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                guildSettings.autoRoleId = role.id
                client.guildSettingsCache.set(message.guild.id, guildSettings)


                message.channel.send(autoRE
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**${role} will now be given to members that join**`)
                    .setTimestamp());

                break;
            case 'remove':
                if (autoRole !== role.id) return message.channel.send(autoRE.setColor(message.guild.me.displayColor).setDescription(`**This role is already not the autorole**`))

                guildSettings = await client.DBSettings.findByIdAndUpdate(message.guild.id, { $unset: { autoRoleId: role.id } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                client.guildSettingsCache.set(message.guild.id, guildSettings)


                message.channel.send(autoRE
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**${role} will now not be given to members that join**`)
                    .setTimestamp());
                break;
            default:
                message.channel.send(autoRE.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                break;
        }


    }
}
