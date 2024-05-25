const express = require('express');
const { client, connection } = require('../../../index');

const router = express.Router();

router.get('/', async (req, res) => {
    res.render('Welcome', {
        user: req.user,
        client: client,
        con: connection
    })
});

module.exports = router;