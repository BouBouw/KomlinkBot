const express = require('express');
const path = require('path');
const session = require('express-session')
const ejs = require('ejs');
const passport = require('passport');
const { Strategy } = require('passport-discord');
const cors = require('cors');

const app = express();

const config = require('../../config.json');

async function load (client, connection) {
    app.use(express.json())
    app.use(cors());
    app.engine('html', ejs.renderFile);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../web/views'));
    app.use(express.static(path.join(__dirname, '../web/public')));
    app.use(session({
        secret: config.client.secret,
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
        clientID : client.user.id,
        clientSecret: config.client.secret,
        callbackURL: config.client.callback_url,
        scope: ['identify', 'email', 'guilds']
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    }));

    app.get('/', require('./routes/global'));
    app.get('/home', require('./routes/global'));
    app.get('/dashboard', require('./routes/global'));
    app.get('/documentation', require('./routes/global'));

    app.get('/login', require('./routes/Auth/login'));
    app.get('/logout', require('./routes/Auth/logout'));
    
    app.listen(90, () => console.log(`[WEB] `.bold.blue + `Web server has been started.`.bold.white + ` (http://localhost:90/)`.bold.blue ));
}

module.exports = {
    load
}