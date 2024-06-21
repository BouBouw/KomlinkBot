const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, Colors, GuildScheduledEventManager, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType, PermissionsBitField, Collection } = require("discord.js");

const GenerateUUID = require('../../../handlers/functions/GenerateUUID');
const base = require("../../../handlers/airtable");

module.exports = {
	name: 'interactionCreate',
	once: false,
execute: async (interaction, client, con) => {
    await Buttons();
    await Modals();
    await Selects();

    async function Buttons() {
        if(!interaction.isButton()) return;

        switch(interaction.customId) {
            case 'accept_rules': {
                const modal = new ModalBuilder()
                    .setCustomId('modal')
                    .setTitle("Informations :")

                const row = new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('first_name')
                            .setLabel("Prénom :")
                            .setPlaceholder('Ex : Jean')
                            .setMinLength(3)
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )

                const row_1 = new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('last_name')
                            .setLabel("Nom :")
                            .setPlaceholder('Ex : Carl')
                            .setMinLength(3)
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )

                const row_2 = new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('email')
                            .setLabel("E-mail :")
                            .setPlaceholder('Ex : jean.carl@gmail.com')
                            .setMinLength(5)
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )

                const row_3 = new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('phone_number')
                            .setLabel("Numéro de téléphone :")
                            .setPlaceholder('Ex : +33 6 12 34 56 78')
                            .setMinLength(5)
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )

                const row_4 = new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('jobs')
                            .setLabel("Profession / LinkeldIn")
                            .setPlaceholder('Ex : Professeur')
                            .setMinLength(3)
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )

                modal.addComponents(row, row_1, row_2, row_3, row_4);
                interaction.showModal(modal);

                break;
            }

            case 'new_event': {
                const modal = new ModalBuilder()
                    .setCustomId('new_event')
                    .setTitle("Nouveau Atelier :")
                
                const row = new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('title')
                        .setLabel("Titre de l'atelier")
                        .setPlaceholder('Ex : Conférence de presse')
                        .setMinLength(6)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                )

                const row_1 = new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('description')
                        .setLabel("Description de l'atelier")
                        .setPlaceholder("Ex: L'IA et ses défauts")
                        .setMinLength(24)
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                )

                const row_2 = new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('date')
                        .setLabel("Date")
                        .setPlaceholder("Ex: 2025/12/01")
                        .setMinLength(5)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                )

                const row_3 = new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('hour')
                        .setLabel("Date")
                        .setPlaceholder("Ex: 16:30")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                )

                const row_4 = new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('animators')
                        .setLabel("Animateurs (supplémentaire)")
                        .setPlaceholder("Ex: @bouubouw")
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(false)
                )

                modal.addComponents(row, row_1, row_2, row_3, row_4);
                interaction.showModal(modal);

                break;
            }

            case 'event_contact': {
                con.query(`SELECT * FROM workshops WHERE uuid = '${interaction.message.embeds[0].data.footer.text}'`, function(err, result) {
                    interaction.channel.threads.create({
                        name: `${result[0].title}`
                    }).then(async (thread) => {
                        thread.send({
                            content: `${interaction.guild.members.cache.get(result[0].userID)} ${interaction.user}`
                        })
                    })
                })
                break;
            }

            case 'event_decline': {
                con.query(`DELETE FROM workshops WHERE uuid = '${interaction.message.embeds[0].data.footer.text}'`, function(err, result) {
                    interaction.reply({
                        content: `L'atelier de ${interaction.guild.members.cache.get(result[0].userID)} (\`${result[0].title}\`) vient d'être supprimé.`
                    });
                })
                break;
            }

            case 'event_accept': {
                interaction.deferUpdate();

                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('placeholder_msg')
                        .setLabel("Ajouter une image ?")
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('EventsCreate_Image_yes')
                        .setLabel("Oui")
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('EventsCreate_Image_no')
                        .setLabel("Non")
                        .setStyle(ButtonStyle.Danger)
                )

                interaction.message.edit({
                    components: [ row ]
                })
                break;
            }

            case 'EventsCreate_Image_yes': {
                break;
            }

            case 'EventsCreate_Image_no': {
                con.query(`SELECT * FROM workshops WHERE uuid = '${interaction.message.embeds[0].data.footer.text}'`, function(err, result) {
                    const userID = result[0].userID;
                    const title = result[0].title;
                    const description = result[0].description;
                    
                    const isoDate = new Date(result[0].date);
                    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

                    const event_manager = new GuildScheduledEventManager(interaction.guild);
                    event_manager.create({
                        name: title,
                        scheduledStartTime: new Date(result[0].date),
                        privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
                        entityType: GuildScheduledEventEntityType.Voice,
                        description: description,
                        channel: '1235930371452047420',
                        image: null,
                        reason: `Créer par ${interaction.guild.members.cache.get(userID).username}`,
                    })

                    con.query(`UPDATE workshops SET state = '1' WHERE uuid = '${interaction.message.embeds[0].data.footer.text}'`, function(err, result) {
                        const user = client.users.cache.get(userID);

                        interaction.reply({
                            content: `L'évènement de ${user} vient d'être créer.`
                        })

                        const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('placeholder_msg')
                                .setDisabled(true)
                                .setLabel(`Confirmer par ${interaction.user.username}`)
                                .setStyle(ButtonStyle.Secondary)
                        )

                        interaction.message.edit({
                            embeds: [{
                                color: Colors.Green,
                                author: {
                                    name: user.username,
                                    icon_url: user.avatarURL(),
                                },
                                title: title,
                                description: description,
                                fields: [
                                    {
                                        name: `Créneau :`,
                                        value: `\`${isoDate.toLocaleDateString(undefined, options)}\` à \`${isoDate.toLocaleTimeString(undefined, timeOptions)}\``
                                    },
                                ],
                                footer: {
                                    text: interaction.message.embeds[0].data.footer.text
                                }
                            }],
                            components: [ row ]
                        })

                        user.send({
                            embeds: [{
                                color: Colors.Blue,
                                title: `Evènement confirmer !`,
                                description: `Votre évènement vient d'être confirmer par ${interaction.user}.`,
                                fields: [
                                    {
                                        name: `${title}`,
                                        value: `${description}`
                                    }
                                ]
                            }]
                        })
                    })
                })
                // create directly event
                break;
            }

            case 'new_suggestion': {
                const modal = new ModalBuilder()
                    .setCustomId('new_suggestion')
                    .setTitle("Nouvelle Suggestion :")
                
                const row = new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('title')
                        .setLabel("Titre de la suggestion")
                        .setPlaceholder('Ex : Nouveau salon')
                        .setMinLength(6)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                )

                const row_1 = new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('description')
                        .setLabel("Description de la suggestion")
                        .setPlaceholder("Ex: Un salon pour des rencontres")
                        .setMinLength(24)
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                )

                modal.addComponents(row, row_1);
                interaction.showModal(modal);

                break;
            }
        }
    }

    async function Modals() {
        if(!interaction.isModalSubmit()) return;

        switch(interaction.customId) {
            case 'modal': {
                const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

                const first_name = interaction.fields.getTextInputValue('first_name');
                const last_name = interaction.fields.getTextInputValue('last_name');
                const email = interaction.fields.getTextInputValue('email');
                if(!email.includes('@')) return interaction.reply({ content: `Veuillez fournir une adresse-mail valide.` });
                const phone_number = interaction.fields.getTextInputValue('phone_number');
                if(!phone_number.match(regex)) return interaction.reply({ content: `Veuillez fournir un numéro de téléphone valide.` });
                const jobs = interaction.fields.getTextInputValue('jobs');

                let number;
                if(phone_number  === '') {
                    number = false;
                } else {
                    number = phone_number
                }

                let job;
                if(jobs === '') {
                    job = false;
                } else {
                    job = jobs;
                }

                try {
                    await base('guild_members').create([
                        {
                            fields: {
                                "userID": `${interaction.member.id}`,
                                "username": `${interaction.user.tag}`,
                                "first_name": `${first_name}`,
                                "last_name": `${last_name}`,
                                "email": `${email}`,
                                "phone_number": `${number}`,
                                "jobs": `${job}`,
                            }
                        }
                    ], function(err, records) {
                        if(err) console.log(err)

                        con.query(`SELECT * FROM welcome_config WHERE guildID = '${interaction.guild.id}'`, function(err, result) {
                            if(!result) {
                                interaction.reply({
                                    embeds: [{
                                        color: Colors.Green,
                                        title: `Vérification :`,
                                        fields: [
                                            {
                                                name: `Enregistrement :`,
                                                value: `Vous êtes désormais autoriser à rejoindre le serveur.`
                                            }
                                        ]
                                    }],
                                    ephemeral: true
                                }).then(async () => {
                                    // interaction.message.delete();
    
                                    interaction.channel.edit({
                                        permissionOverwrites: [
                                            {
                                                id: interaction.member.id,
                                                deny: [ PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory ]
                                            }
                                        ]
                                    })
                                })
                            } else {
                                if(!result[0]) {
                                    interaction.reply({
                                        embeds: [{
                                            color: Colors.Green,
                                            title: `Vérification :`,
                                            fields: [
                                                {
                                                    name: `Enregistrement :`,
                                                    value: `Vous êtes désormais autoriser à rejoindre le serveur.`
                                                }
                                            ]
                                        }],
                                        ephemeral: true
                                    }).then(async () => {
                                        interaction.message.delete();
        
                                        interaction.channel.edit({
                                            permissionOverwrites: [
                                                {
                                                    id: interaction.member.id,
                                                    deny: [ PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory ]
                                                }
                                            ]
                                        })
                                    })
                                } else {
                                    const role = interaction.guild.roles.cache.get(result[0].roleID);
                                    if(!role) return;

                                    interaction.member.roles.add(role).then(async () => {
                                        interaction.reply({
                                            embeds: [{
                                                color: Colors.Green,
                                                title: `Vérification :`,
                                                fields: [
                                                    {
                                                        name: `Enregistrement :`,
                                                        value: `Vous êtes désormais autoriser à rejoindre le serveur.`
                                                    }
                                                ]
                                            }],
                                            ephemeral: true
                                        }).then(async () => {
                                            interaction.message.delete();
            
                                            interaction.channel.edit({
                                                permissionOverwrites: [
                                                    {
                                                        id: interaction.member.id,
                                                        deny: [ PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory ]
                                                    }
                                                ]
                                            })
                                        })
                                    })
                                }
                            }
                        })
                    })
                } catch(err) {
                    console.log(err);
                }
                break;
            }

            case 'new_event': {
                const title = interaction.fields.getTextInputValue('title');
                const description = interaction.fields.getTextInputValue('description');
                const date = interaction.fields.getTextInputValue('date');
                const hour = interaction.fields.getTextInputValue('hour');
                const animators = interaction.fields.getTextInputValue('animators');

                const uuid = GenerateUUID();

                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('event_contact')
                        .setLabel("Contacter l'utilisateur")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('event_decline')
                        .setLabel("Annuler l'évènement")
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('event_accept')
                        .setLabel("Créer l'évènement")
                        .setStyle(ButtonStyle.Success)
                )

                const channel = interaction.guild.channels.cache.get('1219281785918193735');
                channel.send({
                    embeds: [{
                        color: Colors.Yellow,
                        author: {
                            name: interaction.user.username,
                            icon_url: interaction.user.avatarURL(),
                        },
                        title: title,
                        description: description,
                        fields: [
                            {
                                name: `Créneau :`,
                                value: `\`${date}\` à \`${hour}\``
                            },
                            {
                                name: `Animateur(s) :`,
                                value: `${ !animators || animators === '' ? 'Aucun animateur' : animators}`
                            }
                        ],
                        footer: {
                            text: uuid
                        }
                    }],
                    components: [ row ]
                }).then(async () => {
                    con.query(`INSERT INTO workshops (uuid, userID, title, description, date) VALUES ('${uuid}', '${interaction.user.id}', '${title}', '${description}', '${date.replace(/\//g, '-')} ${hour}:00')`, function(err, result) {
                        if(err) throw err;
                        
                        interaction.reply({
                            content: `Votre atelier est en cours de vérification.`,
                            ephemeral: true
                        });
                    })
                })
                break;
            }

            case 'new_suggestion': {
                const title = interaction.fields.getTextInputValue('title');
                const description = interaction.fields.getTextInputValue('description');

                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('Suggest.for')
                    .setEmoji('👍')
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId('Suggest.neutral')
                    .setEmoji('😐')
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId('Suggest.against')
                    .setEmoji('👎')
                    .setStyle(ButtonStyle.Secondary),
                )

                const channel = interaction.guild.channels.cache.get('1206980082435100672');
                interaction.reply({
                    content: `Votre suggestion vient d'être postée.`,
                    ephemeral: true
                })

                channel.send({
                    embeds: [{
                        color: Colors.Yellow,
                        author: {
                            name: interaction.user.username,
                            icon_url: interaction.user.avatarURL(),
                        },
                        fields: [
                            {
                                name: `${title}`,
                                value: `${description}`,
                                inline: false
                            },
                            {
                                name: `Pour`,
                                value: `0`,
                                inline: true
                            },
                            {
                                name: `Neutre`,
                                value: `0`,
                                inline: true
                            },
                            {
                                name: `Contre`,
                                value: `0`,
                                inline: true
                            },
                        ]
                    }],
                    components: [ row ]
                }).then(async (msg) => {
                    await msg.channel.threads.create({
                        name: `${title}`
                    })
                })
                break;
            }

            case 'workshops_message': {
                const text = interaction.fields.getTextInputValue('config.workshops_text');

                const row = new ActionRowBuilder() 
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('new_event')
                        .setLabel("Nouveau atelier")
                        .setStyle(ButtonStyle.Primary)
                )

                interaction.reply({
                    content: `Le message de **création d'ateliers** vient d'être posté.`,
                    ephemeral: true
                })
    
                interaction.channel.send({
                    embeds: [{
                        color: Colors.Blue,
                        title: `Ateliers`,
                        fields: [
                            {
                                name: `\u200b`,
                                value: `${text}`
                            }
                        ]
                    }],
                    components: [ row ]
                })

                break;
            }

            case 'suggestions_message': {
                const text = interaction.fields.getTextInputValue('config.suggestions_text');

                const row = new ActionRowBuilder() 
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('new_suggestion')
                        .setLabel("Proposer une idée")
                        .setStyle(ButtonStyle.Primary)
                )

                interaction.reply({
                    content: `Le message de **proposition de suggestions** vient d'être posté.`,
                    ephemeral: true
                })
    
                interaction.channel.send({
                    embeds: [{
                        color: Colors.Blue,
                        title: `Suggestions`,
                        fields: [
                            {
                                name: `\u200b`,
                                value: `${text}`
                            }
                        ]
                    }],
                    components: [ row ]
                })

                break;
            }
        }
    }

    async function Selects() {
        if(!interaction.isStringSelectMenu()) return;
    }

    
    }
}