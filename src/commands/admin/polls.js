const { ApplicationCommandType } = require("discord.js");

module.exports = {
    name: 'polls',
    description: '(⚙️) Admin',
    type: ApplicationCommandType.ChatInput,
execute: async (client, interaction, args, con) => {
    interaction.reply({
        poll: {
            question: {
                text: "What's your favorite color ?"
            },
            answers: [
                {
                    text: "Red",
                    emoji: '🟥'
                },
                {
                    text: "Green",
                    emoji: '🟩'
                },
                {
                    text: "Blue",
                    emoji: '🟦'
                },
            ]
        }
    })
    }
}