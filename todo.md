# 12/29/2020

    - [x] Add `addrole` and `deleteroles` to moderation commands
    - [x] Add `daily` command to economy commands
    - [x] Add `trade` command (*all items*)
    - [x] Add `level` command to check XP and levels of a user

# 12/30/2020

    - [ ] Add `duel` command to economy **see 1/3/201 for completion**

# 12/31/2020

    - [x] Add `diceroll` command to economy
    - [-] Add `blackjack` command to economy

# 1/1/2021

    - [x] Finish `blackjack` command (added variety)

# 1/2/2021

    - [x] Made `slots` command for economy  
    - [x] Made `drake, blur, clyde, beautiful, bed, distracted,` commands for images  
    - [x] Made `note, twitter, brightness, darkness, america, delete, fuse, surprised` commands  for images  

# 1/3/2021

    - [x] Make `tableflip` command for fun
    - [x] Made `emojify` command for fun
    - [x] Made `shorten` command for info
    - [x] Finished `duel` command for economy

# 1/4/2021

    - [x] Try to make `channel` disable command
    - [x] Finished `autorole` command for utility

# 1/18/2021

    - [x] Rework of emojis for all moderation commands
    - [x] Better `ban`, `mute`, `timeout`, `kicks`, and `nick`
    - [x] Made `akinator` in misc 
    - [x] Ignoring pinned messages in `purge` command
    - [x] Fixed `cannot send undefined` bug in welcome

# 2/7/2021

    - [x] Reworked Channel Lock
    - [x] Added settings command
    - [x] Added leave message for guilds
    - [x] Added `guildSettingsCache` and `guildSettingSchema` to store leave/welcome channels/ghost ping detection/decancering/autoroles
    - [x] Fixed welcome channel `guild timeout` and `send to undefined` bugs
    - [x] Added `autoroles` to cache and cleaned up command
    - [x] Removed `autorole schema` and `welcome schema`
    - [x] Changed EMBED_COLOR to `message.guild.me.displayColor`

# 2/8/2021

    - [x] Used reply feature
    - [x] `schedule` command for school
    - [x] Added audit log toggling
    - [x] Blacklisting words
    - [x] Fixed various different `message` errors
    - [x] Reworked `lockdown` and `addtoginored` commands

# 2/9/2021

    - [x] Added `logsettings` command for utility 
    - [x] Added `sudo` command for misce
    - [x] Added audit logging for edits, deletes, and bulkDelete
    - [x] Fixed various different `message` errors

# 2/10/2021

    - [x] Finished making all the audit logs; see (src\commands\utility\server utilities\auditLogSettings.js) for more finished looks
    - [x] Added highlighting

    - [ ] Add guild member add in audit log settings 

# 2/11/2021

    - [x] Make spam command
    - [x] Fixed DM errors
    - [x] Added modlogs
    - [x] Added admin bypass on ignored channels

# 2/14/2021
 
    - [x] Rewrote coin commands folder (every command in the folder)

# 2/15/2021

    - [x] Rewrote all econ utilities (every command in the folder)
    - [x] Rewrote all xp commands (every command in the folder)
        - Added minor bug fixes in blackjack and slots commands, deleted gamble command
    - [x] Paginated `shop` command
    - [x] Fixed leaderboard so its not global

# 2/19/2021

    - [x] Added afk command

# 2/21/2021

    - [x] Reworked settings paged
    - [x] Made mute/timeout roles customizable
    - [x] Changed audit log workings
    - [x] Changed atig workings
    - [x] Change autorole workings 
    - [x] File and files command

# 2/22/2021

    - [x] Created website dashboard

# 2/23/2021

    - [x] Uploaded dashboard and bot to github
    - [x] Fixed mobile glitches on dashboard
    - [x] Added more variable support to welcome/leave
    - [x] sim(join/leave) command to simulate joins and leaves
    - [x] Fixed unmute/to command

# 2/25/201 - 2/29/2021

    - [x] Added leveling commands, fixed minor bugs, changed when bot leaves voice chanel
    - [x] Fixed command menu on site
    - [x] Add role multipliers
    - [x] Add channel multipliers
    - [x] Add guild multiplier
    - [x] Add settings menu for XP
    - [x] Add role levels 
    - [x] Add announce settings

# 3/6/2021

    - [x] Fixed unban bug
    - [x] Make settings changes
    - [x] Make level settings changes
    - [x] Fixed unknown message error

# 3/7/2021  
    - [x] Started automoderation
    - [x] Finished auto-mod for warns
    - [x] Added antispam settings

# 3/10/2021
    - [x] Finished automoderaton
    - [x] Fixed a ton of bugs and added nsfwOnly to prefab to handler
    - [x] Added replay and clear-queue commands to music

# 3/11/2021
    - [x] Added fast forward to music
    - [x] Fixed now playing

# 3/12/2021
    
    - [x] Added role commands

# 3/13/2021

    - [x] Add-emoji command **Removed**
    - [x] Added eval
    - [x] Added filter function
    - [x] Added so you cant swear after editing messages

# 3/15/2021 - 3/16/2021

    - [x] Added custom playlists
    - [x] Fixed music bugs and added move

# 3/17/2021
 
    - [x] Aded getGuild[Info, Settings, Levels, Audit] methods to utils.js and updated every event
    - [x] Fixed ecolb bug
    - [x] Saved cooldowns
    - [x] Added global cooldowns

# 3/24/2021

    - [x] Added highlight DM cooldown

# 3/25/2021 - 3/26/2021

    - [x] Added SunTzu command, per request
    - [x] Fixed bugs in music players
    - [x] Added reload feature
    - [x] Added isMuted
