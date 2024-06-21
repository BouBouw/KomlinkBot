const Airtable = require('airtable');
const base = new Airtable({
    apiKey: "patGNyQjKCqBoll1W.c9957d9d8d7f9e30fdcba867f6ee171909c466a546b81854f22242420b5909ca"
}).base('appXV94VIeX9IEHYg')

module.exports = base;