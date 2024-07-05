const Airtable = require('airtable');
const mysql = require('mysql2');

const config = require('../../config.json');

const airtable = () => {
    const base = new Airtable({
        apiKey: config.airtable.api_key
    }).base(config.airtable.base_id)

    return base;
}

const sql = () => {
    const con = mysql.createConnection({
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database,
    });

    return con;
}

const db = {
    airtable,
    sql,
}

module.exports = db;