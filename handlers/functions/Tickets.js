const { Colors, ChannelType, MessageType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = require('../../index');
const db = require('./Databases');

const ClearTicket = async (uuid, interaction) => {
    setTimeout(() => {
        db.sql().query(`SELECT * FROM tickets WHERE uuid = '${uuid}'`, function(err, result) {
            if(!result) return;

            if(result[0].reason === null) {
                const user = interaction.guild.members.cache.get(result[0].userID);
                console.log(user);
            }
        })
    }, 3600000)
}

const SaveTicket = async (interaction) => {
    console.log(interaction)
    interaction.channel.messages.fetch({ limit: 100 }).then(messages => {
        interaction.reply({
            content: `Sauvegarde de **${messages.size}** message(s).`
        }).then(async (msg) => {
            messages.forEach(message => {
                
            })
        })
    })
}

const LockTicket = async (interaction) => {
    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId('Tickets.Panel.Unlock')
        .setLabel("Débloquer le ticket")
        .setStyle(ButtonStyle.Secondary)
    )

    interaction.reply({
        content: `Bloquage du ticket.`,
        components: [ row ]
    }).then(async () => {
        const uuid = interaction.message.embeds[0].data.footer.text;

        db.sql().query(`SELECT * FROM tickets WHERE uuid = '${uuid}'`, function(err, result) {
            const user = client.users.cache.get(result[0].userID);

            interaction.channel.permissionOverwrites.edit(user.id, { SendMessages: false })
        })
    })
}

const UnlockTicket = async (interaction) => {
    interaction.reply({
        content: `Bloquage du ticket.`
    }).then(async () => {
        const uuid = interaction.message.embeds[0].data.footer.text;

        db.sql().query(`SELECT * FROM tickets WHERE uuid = '${uuid}'`, function(err, result) {
            const user = client.users.cache.get(result[0].userID);

            interaction.channel.permissionOverwrites.edit(user.id, { SendMessages: true })
        })
    })
}

const CloseTicket = async (interaction) => {
    interaction.reply({
        content: `Suppression du ticket dans **5 secondes**.`
    }).then(async () => {
        const uuid = interaction.message.embeds[0].data.footer.text;

        db.sql().query(`SELECT * FROM tickets WHERE uuid = '${uuid}'`, function(err, result) {
            const user = client.users.cache.get(result[0].userID);
            const date = Date.now();
            console.log(date)

            db.sql().query(`UPDATE tickets SET closedAt = CURRENT_TIMESTAMP() WHERE uuid = '${uuid}'`, function(err, result) {
                interaction.channel.delete();

                user.send({
                    embeds: [{
                        color: Colors.Blue,
                        title: `Tickets`,
                        description: `Votre ticket vient d'être fermer par : ${interaction.user} \`${interaction.user.username}\`.`
                    }]
                })
            })
        })
    })
}

const TicketProcess = {
    ClearTicket,
}

const TicketManager = {
    SaveTicket,
    LockTicket,
    UnlockTicket,
    CloseTicket
}

module.exports = {
    TicketProcess,
    TicketManager
};