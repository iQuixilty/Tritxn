const { Channel, MessageEmbed } = require('discord.js');
const { log } = require('../utils/utils')
const { getGuildAudit, getGuildInfo, getGuildSettings, getGuildLevels } = require('../utils/utils')

/**
 * ready event
 * @param {import('../typings.d').myClient} client 
 */

module.exports = async (client) => {
    client.user.setActivity(`with my economy`, { type: 'PLAYING' }).catch((e) => console.log(e));

    //TODO: Fetch all data and save to cache (delete data if neccessary)
    try {
        client.guilds.cache.forEach(async (guild) => {
            let guildInfo = await getGuildInfo(client, guild.id);
            let guildSettings = await getGuildSettings(client, guild.id)
            let guildAudit = await getGuildAudit(client, guild.id)
            let guildLevels = await getGuildLevels(client, guild.id)

            let a = 0;
            for (a = 0; a < guildLevels.blacklistedChannels.length; a++) {
                let chan = client.channels.cache.get(guildLevels.blacklistedChannels[a])
                if (chan === undefined) {
                    guildLevels = await client.DBLevels.findByIdAndUpdate(guild.id, { $pull: { blacklistedChannels: guildLevels.blacklistedChannels[a] } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    client.guildLevelsCache.set(guild.id, guildLevels)
                }
            }

            for (a = 0; a < guildLevels.blacklistedRoles.length; a++) {
                let role = guild.roles.cache.get(guildLevels.blacklistedRoles[a])
                if (role === undefined) {
                    guildLevels = await client.DBLevels.findByIdAndUpdate(guild.id, { $pull: { blacklistedRoles: guildLevels.blacklistedRoles[a] } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    client.guildLevelsCache.set(guild.id, guildLevels)
                }
            }

        })
        log('SUCCESS', 'src/eventHandlers/ready.js', 'TODO: Delete Unnecessary Data')

    } catch (err) {
        log("ERROR", "src/eventHandlers/ready.js", err.message)
    }
}