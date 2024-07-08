const express = require('express');
const checkAuth = require('../functions/CheckAuth');

const client = require('../../../index');
const db = require('../../../handlers/functions/Databases');
const { GetTicketData } = require('../../../handlers/functions/Tickets');
const { GetSchedulesData } = require('../../../handlers/functions/Schedules');

const router = express.Router();

router.get('/', async (req, res) => {
    res.render('Welcome', {
        user: req.user,
        bot: client,
    })
});

router.get('/home', async (req, res) => {
    res.render('Welcome', {
        user: req.user,
        bot: client,
    })
});

router.get('/dashboard', checkAuth, async (req, res) => {
    console.log(await GetTicketData.GetAllTicket(req.user.id));

    res.render('Dashboard/Main', {
        user: req.user || null,
        bot: client,
        events: {
            open: await GetSchedulesData.GetSchedules(req.user.id)
        },
        tickets: {
            ticketsClosed: await GetTicketData.GetClosedTicket(req.user.id),
            ticketsOpened: await GetTicketData.GetOpenedTicket(req.user.id),
        }
    })
});

module.exports = router;