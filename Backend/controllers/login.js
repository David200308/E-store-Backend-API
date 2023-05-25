const db = require("../database");
const hat = require("hat");
const { createHash } = require('crypto');

function hash(string) {
    return createHash('sha256').update(string).digest('hex');
}

exports.userLogin = async (req, res, next) => {
    const password = req.headers['password'];
    const userName = req.params.userName;

    if (hash(password) == "null") {
        res.status(401).json({
            status: "failed",
            message: "Invalid Password"
        });
    }

    var sql = "SELECT * FROM USERINFO WHERE userName = ? AND userPassword = ? AND userStatus = 0";
    db.query(sql, [userName, hash(password)], async function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
            res.status(401).json({
                status: "failed",
                message: "Invalid Password"
            });
        } else {
            var rack = hat.rack();
            const tempToken = rack();

            var updateStatusSQL = "UPDATE USERINFO SET userStatus = 1, tempToken = ? WHERE userName = ? AND userStatus = 0";
            db.query(updateStatusSQL, [hash(tempToken), userName], function (err, result) {
                if (err) throw err;
                console.log("userStatus updated to true");
            });

            res.status(200).json({
                status: true,
                tempToken: tempToken
            });
        }
    });
};

exports.userLogout = async (req, res, next) => {
    const tempToken = req.headers['data'];
    const userName = req.params.userName;

    var sql = "SELECT * FROM USERINFO WHERE userName = ? AND userStatus = 1 AND tempToken = ?";
    db.query(sql, [userName, hash(tempToken)], async function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
            res.status(401).json({
                status: "failed",
                message: "Invalid"
            });
        } else {
            console.log("test");
            var updateStatusSQL = "UPDATE USERINFO SET userStatus = 0, tempToken = NULL WHERE userName = ? AND userStatus = 1";
            db.query(updateStatusSQL, [userName], function (err, result) {
                if (err) throw err;
                console.log("userStatus updated to false");
            });
            
            res.status(200).json({
                status: true
            });
        }
    });
};

exports.userSignup = async (req, res, next) => {
    const password = hash(req.headers['password']);
    const userName = req.params.userName;

    var getId = "SELECT COUNT(*) AS COUNT FROM USERINFO";
    db.query(getId, function (err, result) {
        if (err) throw err;
        var userId = result[0]['COUNT'] + 1;
        console.log("id: " + userId);

        var sql = "INSERT INTO USERINFO (userID, userName, userPassword, userStatus, createTime) VALUES (?, ?, ?, ?, now())";
        db.query(sql, [userId, userName, password, 0], function (err, result) {
            if (err) throw err;
            console.log("userInfo inserted");
        });
        res.status(200).json({
            status: true
        });
    });
};

// exports.deleteAPIKey = async (req, res, next) => {
//     var sql = "DELETE FROM APIDB WHERE apiToken = ?";
//     db.query(sql, [hash(req.params.apiKey)], function (err, result) {
//         if (err) {
//             res.status(401).json({
//                 status: "failed",
//                 apiKeyStatus: "Invalid API Key"
//             });
//         };

//         console.log("apikey delete");
//         res.status(200).json({
//             status: "success",
//             apiKeyStatus: "deleted"
//         });
//     });
// };
