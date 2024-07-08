const db = require("./Databases")

const GetSchedules = (userID) => {
    return new Promise((resolve, reject) => {
        db.sql().query(`SELECT * FROM workshops WHERE userID = '${userID}'`, function(err, result) {
            if(err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
}

const SchedulesManager = {

}

const GetSchedulesData = {
    GetSchedules
}

module.exports = {
    SchedulesManager,
    GetSchedulesData
}