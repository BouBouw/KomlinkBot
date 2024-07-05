const { Colors } = require('discord.js');
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

const SaveTicket = async (uuid, interaction) => {

}

const LockTicket = async (uuid, interaction) => {

}

const CloseTicket = async (interaction) => {
    interaction.reply({
        content: `Suppression du ticket dans **5 secondes**.`
    }).then(async () => {
        const uuid = interaction.message.embeds[0].data.footer.text;

        db.sql().query(`SELECT * FROM tickets WHERE uuid = '${uuid}'`, function(err, result) {
            const user = client.users.cache.get(result[0].userID);

            db.sql().query(`DELETE FROM tickets WHERE uuid = '${uuid}'`, function(err, result) {
                setTimeout(() => {
                    interaction.channel.delete();

                    user.send({
                        embeds: [{
                            color: Colors.Blue,
                            title: `Tickets`,
                            description: `Votre ticket vient d'être fermer par : ${interaction.user} \`${interaction.user.username}\`.`
                        }]
                    })
                }, 5000)
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
    CloseTicket
}

module.exports = {
    TicketProcess,
    TicketManager
};