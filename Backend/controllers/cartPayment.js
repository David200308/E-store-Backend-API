const db = require("../database");
const hat = require("hat");

exports.paying = async (req, res, next) => {
    const orderID = req.params.orderID;

    var sql = "SELECT * FROM PAYMENT WHERE paymentID = ? AND paymentStatus = 0";
    db.query(sql, [orderID], async function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
            res.status(401).json({
                status: "failed",
                message: "Invalid"
            });
        } else {
            var updateStatusSQL = "UPDATE PAYMENT SET paymentStatus = 1 WHERE paymentID = ? AND userStatus = 0";
            db.query(updateStatusSQL, [orderID], function (err, result) {
                if (err) throw err;
                console.log("Payment Status updated to true");
                res.status(200).json({
                    result: "Payment Successful"
                });
            });
        }
    });
};


exports.insertPaymentInfo = async (req, res, next) => {
    const orderID = req.params.orderID;
    const paymentValue = req.headers['paymentValue'];
    const userName = req.headers['userName'];
    const tempToken = req.headers['tempToken'];

    var searchUserIDSQL = "SELECT userID FROM USERINFO WHERE userName = ? AND tempToken = ?"
    db.query(searchUserIDSQL, [userName, hash(tempToken)], async function (err, result) {
        if (err) throw err;
        const userID = result[0].userID;

        var sql = "INSERT INTO PAYMENT (paymentID, userID, paymentValue, paymentCreationTime, paymentStatus) VALUES (?, ?, ?, now(), 0)";
        db.query(sql, [orderID, userID, paymentValue], async function (err, result) {
            if (err) throw err;
            res.status(401).json({
                status: "success"
            });
        });

    });
};