const { ActivityType, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors} = require('discord.js');

module.exports = {
	name: 'ready',
	once: false,
execute: async (client, connection) => {    
    console.log('[API] '.bold.green + `Connected to Discord.`.bold.white)

    client.user.setPresence({
        activities: [
            {
                name: "https://komlink.com/",
                type: ActivityType.Watching
            }
        ],
        status: "dnd"
    })

    }
}