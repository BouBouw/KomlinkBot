const express = require('express');
const path = require('path');
const session = require('express-session')
const ejs = require('ejs');
const passport = require('passport');
const { Strategy } = require('passport-discord');
const cors = require('cors');

const app = express();

async function load (client, connection) {
    app.use(express.json())
    app.use(cors());
    app.engine('html', ejs.renderFile);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../web/views'));
    app.use(express.static(path.join(__dirname, '../web/public')));
    app.use(session({
        secret: "CHZYqVTyyPF19SeMhkT5dLF9RPwfs91T",
        resave: false,
        saveUninitialized: false
    }))

    app.use(async function(req, res, next) {
        req.client = client;
        req.db = connection;
        next()
    })

    app.use(passport.initialize())
    app.use(passport.session())

    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser((obj, done) => {
        done(null, obj)
    })

    passport.use(new Strategy({
        clientID : "1162391417352634408",
        clientSecret: 'nLuZjyZ0oV_uNrhneQk283v5Vu1Ef4YR',
        callbackURL: 'http://localhost:90/login',
        scope: ['identify', 'email', 'guilds']
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    }));

    app.get('/', require('./routes/global'));
    
    app.listen(90, () => console.log(`[WEB] `.bold.green + `Web server has been started.`.bold.white ));
}

module.exports = {
    load
}