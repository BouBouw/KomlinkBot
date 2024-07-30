const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, Colors, GuildScheduledEventManager, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType, PermissionsBitField, Collection, ChannelType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

const Utils = require("../../../handlers/functions/Utils");
const Tickets = require("../../../handlers/functions/Tickets");
const { EmbedManager } = require("../../../handlers/functions/Embeds");

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
            case 'verification': {
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
                        entityType: GuildScheduledEventEntityType.StageInstance,
                        description: description,
                        channel: '1257001511058276442',
                        image: null,
                        reason: `Créer par ${interaction.guild.members.cache.get(userID).username}`,
                    }).then(async (schedule) => {
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
    
                            const channelPlanning = interaction.guild.channels.cache.get('1257001432826253425');
    
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
    
                            const row_1 = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setURL(`https://discord.com/events/${interaction.guild.id}/${schedule.id}`)
                                .setLabel("Page d'évènement")
                                .setStyle(ButtonStyle.Link)
                            )

                            channelPlanning.send({
                                embeds: [{
                                    color: Colors.Yellow,
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
                                components: [ row_1 ]
                            })
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

            case 'create_ticket': {
                con.query(`SELECT * FROM tickets WHERE userID = '${interaction.user.id}' AND closedAt IS NULL`, function(err, result) {
                    if(!result[0]) {
                        const uuid = Utils.GenerateUUID();

                        interaction.guild.channels.create({
                            name: `ticket-${interaction.user.username}`,
                            type: ChannelType.GuildText,
                            parent: '1256983288333996143'
                        }).then(async (channel) => {
                            const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId('Tickets.confirm')
                                .setLabel("Confirmer le ticket")
                                .setStyle(ButtonStyle.Secondary),
                                new ButtonBuilder()
                                .setCustomId('Tickets.cancel')
                                .setLabel("Annuler le ticket")
                                .setStyle(ButtonStyle.Danger),
                            )
    
                            channel.send({
                                embeds: [{
                                    color: Colors.Blue,
                                    title: `Tickets :`,
                                    description: `Confirmer votre ticket avant : **1 heure** afin de l'ouvrir.`,
                                    footer: {
                                        text: `${uuid}`
                                    }
                                }],
                                components: [ row ]
                            }).then(async (msg) => {
                                interaction.reply({
                                    content: `Votre ticket vient d'être créer : https://discord.com/channels/${interaction.guild.id}/${channel.id}`,
                                    ephemeral: true
                                })
    
                                con.query(`INSERT INTO tickets (uuid, userID) VALUES ('${uuid}', '${interaction.user.id}')`, function(err, result) {
                                    if(err) throw err;
    
                                    Tickets.TicketProcess.ClearTicket(uuid, interaction)
                                })
                            })
                        })
                    } else {
                        return interaction.reply({
                            content: `Vous avez déjà un ticket d'ouvert.`,
                            ephemeral: true
                        });
                    }
                })
                break;
            }

            case 'Tickets.confirm': {
                const modal = new ModalBuilder()
                .setCustomId('Tickets.Reason')
                .setTitle('Raison du ticket');

                const reason = new TextInputBuilder()
                .setCustomId('Tickets.Reason.Text')
                .setLabel("Expliquez votre demande d'ouverture de ticket")
                .setStyle(TextInputStyle.Paragraph);

                const row = new ActionRowBuilder().addComponents(reason);
                
                modal.addComponents(row);
                interaction.showModal(modal);

                break;
            }

            case 'Tickets.cancel': {
                Tickets.TicketManager.CloseTicket(interaction);
                break;
            }

            case 'Tickets.Panel.Save': {
                Tickets.TicketManager.SaveTicket(interaction);
                break;
            }

            case 'Tickets.Panel.Lock': {
                Tickets.TicketManager.LockTicket(interaction);
                break;
            }

            case 'Tickets.Panel.Unlock': {
                Tickets.TicketManager.UnlockTicket(interaction);
                break;
            }

            case 'Tickets.Panel.Close': {
                Tickets.TicketManager.CloseTicket(interaction)
                break;
            }

            case 'Suggest.Vote.For': {
                con.query(`SELECT * FROM suggestions WHERE userID = '${interaction.user.id}' AND messageID = '${interaction.message.id}'`, function(err, result) {
                    if(!result[0]) {
                        con.query(`INSERT INTO suggestions (userID, messageID, typeInt) VALUES ('${interaction.user.id}', '${interaction.message.id}', '0')`, function(err, result) {
                            interaction.reply({
                                content: `Vous venez de voter **Pour** à cette suggestion.`,
                                ephemeral: true
                            });

                            return SuggestEmbedMessage(interaction)
                        })
                    } else {
                        if(result[0].typeInt === 0) {
                            interaction.reply({
                                content: `Vous avez déjà voter **Pour** à cette suggestion.`,
                                ephemeral: true
                            })
                        } else { 
                            con.query(`UPDATE suggestions SET typeInt = '0' WHERE userID = '${interaction.user.id}' AND messageID = '${interaction.message.id}'`, function(err, result) {
                                interaction.reply({
                                    content: `Vous venez de changer à **Pour** à cette suggestion.`,
                                    ephemeral: true
                                });

                                return SuggestEmbedMessage(interaction)
                            })
                        }
                    }
                })
                break;
            }

            case 'Suggest.Vote.Neutral': {
                con.query(`SELECT * FROM suggestions WHERE userID = '${interaction.user.id}' AND messageID = '${interaction.message.id}'`, function(err, result) {
                    if(!result[0]) {
                        con.query(`INSERT INTO suggestions (userID, messageID, typeInt) VALUES ('${interaction.user.id}', '${interaction.message.id}', '1')`, function(err, result) {
                            interaction.reply({
                                content: `Vous venez de voter **Pour** à cette suggestion.`,
                                ephemeral: true
                            });

                            return SuggestEmbedMessage(interaction)
                        })
                    } else {
                        if(result[0].typeInt === 1) {
                            interaction.reply({
                                content: `Vous avez déjà voter **Pour** à cette suggestion.`,
                                ephemeral: true
                            })
                        } else { 
                            con.query(`UPDATE suggestions SET typeInt = '1' WHERE userID = '${interaction.user.id}' AND messageID = '${interaction.message.id}'`, function(err, result) {
                                interaction.reply({
                                    content: `Vous venez de changer à **Pour** à cette suggestion.`,
                                    ephemeral: true
                                });

                                return SuggestEmbedMessage(interaction)
                            })
                        }
                    }
                })
                break;
            }

            case 'Suggest.Vote.Against': {
                con.query(`SELECT * FROM suggestions WHERE userID = '${interaction.user.id}' AND messageID = '${interaction.message.id}'`, function(err, result) {
                    if(!result[0]) {
                        con.query(`INSERT INTO suggestions (userID, messageID, typeInt) VALUES ('${interaction.user.id}', '${interaction.message.id}', '2')`, function(err, result) {
                            interaction.reply({
                                content: `Vous venez de voter **Pour** à cette suggestion.`,
                                ephemeral: true
                            });

                            return SuggestEmbedMessage(interaction)
                        })
                    } else {
                        if(result[0].typeInt === 2) {
                            interaction.reply({
                                content: `Vous avez déjà voter **Pour** à cette suggestion.`,
                                ephemeral: true
                            })
                        } else { 
                            con.query(`UPDATE suggestions SET typeInt = '2' WHERE userID = '${interaction.user.id}' AND messageID = '${interaction.message.id}'`, function(err, result) {
                                interaction.reply({
                                    content: `Vous venez de changer à **Pour** à cette suggestion.`,
                                    ephemeral: true
                                });

                                return SuggestEmbedMessage(interaction)
                            })
                        }
                    }
                })
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
                    con.query(`INSERT INTO users (userID, fullName, email, phone, jobs) VALUES ('${interaction.member.id}', '${first_name} ${last_name}', '${email}', '${number}', '${job}')`, function(err, result) {
                        if(err) throw err;

                        interaction.reply({
                            content: `Vous êtes désormais autoriser à rejoindre le serveur.`,
                            ephemeral: true
                        }).then(async () => {
                            interaction.channel.edit({
                                permissionOverwrites: [
                                    {
                                        id: interaction.member.id,
                                        deny: [ PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory ]
                                    }
                                ]
                            })

                            interaction.member.roles.add('1256989282078560406');
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

                const uuid = Utils.GenerateUUID();

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

                const channel = interaction.guild.channels.cache.get('1256986610944442480');
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
                    .setCustomId('Suggest.Vote.For')
                    .setEmoji('👍')
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId('Suggest.Vote.Neutral')
                    .setEmoji('😐')
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId('Suggest.Vote.Against')
                    .setEmoji('👎')
                    .setStyle(ButtonStyle.Secondary),
                )

                const channel = interaction.guild.channels.cache.get('1256986902108704931');

                interaction.reply({
                    content: `Votre suggestion vient d'être postée.`,
                    ephemeral: true
                })

                channel.send({
                    content: `➡️ [Revenir au bouton **__"Proposer une idée"__**](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.message.id})`,
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

            case 'verfication_message': {
                const text = interaction.fields.getTextInputValue('config.verfication_text');

                const row = new ActionRowBuilder() 
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('verification')
                        .setLabel("Vérification")
                        .setStyle(ButtonStyle.Primary)
                )

                interaction.reply({
                    content: `Le message de **vérification** vient d'être posté.`,
                    ephemeral: true
                })
    
                interaction.channel.send({
                    embeds: [{
                        color: Colors.Blue,
                        title: `Vérification`,
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

            case 'support_message': {
                const text = interaction.fields.getTextInputValue('config.support_text');

                const row = new ActionRowBuilder() 
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('create_ticket')
                        .setLabel("Créer un ticket")
                        .setStyle(ButtonStyle.Primary)
                )

                interaction.reply({
                    content: `Le message de **support** vient d'être posté.`,
                    ephemeral: true
                })
    
                interaction.channel.send({
                    embeds: [{
                        color: Colors.Blue,
                        title: `Créer un ticket`,
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

            case 'Tickets.Reason': {
                const reason = interaction.fields.getTextInputValue('Tickets.Reason.Text');
                const uuid = interaction.message.embeds[0].data.footer.text;

                con.query(`SELECT * FROM tickets WHERE uuid = '${uuid}'`, function(err, result) {
                    const date = result[0].createdAt;
                    console.log(date);

                    if(result[0].userID === interaction.user.id) {
                        con.query(`UPDATE tickets SET reason = '${reason}' WHERE uuid = '${uuid}' AND userID = '${interaction.user.id}'`, function(err, result) {
                            // create tickets process

                            const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId('Tickets.Panel.Save')
                                .setLabel('Sauvegarder le ticket')
                                .setStyle(ButtonStyle.Secondary),
                                new ButtonBuilder()
                                .setCustomId('Tickets.Panel.Lock')
                                .setLabel('Bloquer le ticket')
                                .setStyle(ButtonStyle.Secondary),
                                new ButtonBuilder()
                                .setCustomId('Tickets.Panel.Close')
                                .setLabel('Fermer le ticket')
                                .setStyle(ButtonStyle.Danger),
                            )

                            interaction.message.edit({
                                embeds: [{
                                    color: Colors.Blue,
                                    author: {
                                        name: `${interaction.user.username}`,
                                        icon_url: interaction.user.avatarURL()
                                    },
                                    description: `Ouvert le : **00/00/0000** à **00:00**.`,
                                    fields: [
                                        {
                                            name: `Raison :`,
                                            value: `\`\`\`${reason}\`\`\``
                                        }
                                    ],
                                    footer: {
                                        text: `${uuid}`
                                    }
                                }],
                                components: [ row ]
                            });

                            interaction.reply({
                                content: `Votre ticket vient d'être ouvert, un modérateur / administrateur va venir vous aider.`,
                                ephemeral: true
                            })
                        })
                    } else {
                        interaction.reply({
                            content: `Vous n'êtes pas le créateur du ticket.`,
                            ephemeral: true
                        })
                    }
                })
                break;
            }

            case 'Embeds.SetUrl': {
                EmbedManager.GetURL(interaction);
                break;
            }

            case 'Embeds.SetAuthor': {
                EmbedManager.GetAuthor(interaction);
                break;
            }

            case 'Embeds.SetTitle': {
                EmbedManager.GetTitle(interaction);
                EmbedManager.
                break;
            }

            case 'Embeds.SetDescription': {
                EmbedManager.GetDescription(interaction);
                break;
            }

            case 'Embeds.AddFields': {
                EmbedManager.GetFields(interaction);
                break;
            }

            case 'Embeds.SetThumbnail': {
                EmbedManager.GetThumbnail(interaction);
                break;
            }

            case 'Embeds.SetImage': {
                EmbedManager.GetImage(interaction);
                break;
            }

            case 'Embeds.SetFooter': {
                EmbedManager.GetFooter(interaction);
                break;
            }

            case 'Embeds.SetColor.Custom': {
                EmbedManager.GetColor(interaction);
                break;
            }
        }
    }

    async function Selects() {
        if(!interaction.isStringSelectMenu()) return;
    }

    
    async function SuggestEmbedMessage(int) {
        const votes = await GetVotes(int.message.id);
        con.query(`SELECT * FROM suggestions WHERE messageID = '${int.message.id}'`, function(err, result) {
            console.log(votes);

            interaction.message.edit({
                content: `${int.message.content}`,
                embeds: [{
                    color: int.message.embeds[0].data.color,
                    author: {
                        name: int.message.embeds[0].data.author.name,
                        icon_url: int.message.embeds[0].data.author.icon_url
                    },
                    fields: [
                        {
                            name: `${int.message.embeds[0].data.fields[0].name}`,
                            value: `${int.message.embeds[0].data.fields[0].value}`,
                            inline: false
                        },
                        {
                            name: `Pour`,
                            value: `${0 || votes.For}`,
                            inline: true
                        },
                        {
                            name: `Neutre`,
                            value: `${0 || votes.Neutral}`,
                            inline: true
                        },
                        {
                            name: `Contre`,
                            value: `${0 || votes.Against}`,
                            inline: true
                        },
                    ]
                }]
            })
        })
    }

    async function GetVotes(messageID) {
        let votes = {
            For: 0,
            Neutral: 0,
            Against: 0
        };


        con.query(`SELECT * FROM suggestions WHERE messageID = '${messageID}' AND typeInt = '0'`, function(err, result) {
            if(err) throw err;
            votes.For = Number(result.length);
            con.query(`SELECT * FROM suggestions WHERE messageID = '${messageID}' AND typeInt = '1'`, function(err, result) {
                if(err) throw err;
                votes.Neutral = Number(result.length);
                con.query(`SELECT * FROM suggestions WHERE messageID = '${messageID}' AND typeInt = '2'`, function(err, result) {
                    if(err) throw err;
                    votes.Against = Number(result.length);
                });
            });
        });

        return await votes;
    }

    }
}