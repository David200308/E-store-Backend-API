const db = require("../database");
const hat = require("hat");
const { createHash } = require('crypto');
const jwt = require('jsonwebtoken');

function hash(string) {
    return createHash('sha256').update(string).digest('hex');
}

exports.userLogin = async (req, res, next) => {
    const token = req.body.token || req.headers["x-access-token"];
    const userName = req.body['userName'];

    if (!token) {
        const password = req.body['password'];

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

                const authToken = jwt.sign(
                    { userName, password },
                    tempToken,
                    {
                        expiresIn: "7200000",
                    }
                );

                var updateStatusSQL = "UPDATE USERINFO SET userStatus = 1, tempToken = ? WHERE userName = ? AND userStatus = 0";
                db.query(updateStatusSQL, [tempToken, userName], function (err, result) {
                    if (err) throw err;
                    console.log("userStatus updated to true");
                });

                res.status(200).json({
                    status: true,
                    tempToken: authToken,
                    maxAge: 7200000
                });
            }
        });
    }
    try {
        var sql = "SELECT tempToken FROM USERINFO WHERE userName = ? AND userStatus = 1";
        db.query(updateStatusSQL, [tempToken, userName], function (err, result) {
            if (err) throw err;
            tempToken = result[0]['tempToken'];
            const decoded = jwt.verify(token, tempToken);

            res.status(200).json({
                status: true,
                message: "Valid Token"
            });
        });
    } catch (err) {
        return res.status(401).json({
            status: false,
            message: "Invalid Token"
        });
    }
};

exports.userLogout = async (req, res, next) => {
    const tempToken = req.body.token || req.headers["x-access-token"];
    const userName = req.body["userName"];

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
    const password = hash(req.body['password']);
    const userName = req.body["userName"];

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
