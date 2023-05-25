const db = require("../database");
const hat = require("hat");
const { createHash } = require('crypto');

function hash(string) {
    return createHash('sha256').update(string).digest('hex');
}

exports.insertCartInfo = async (req, res, next) => {

    const userName = req.headers['userName'];
    const tempToken = req.headers['tempToken'];
    const productID = req.headers['productID'];
    const quantity = req.headers['quantity'];
    var rack = hat.rack();
    const orderID = rack();
    const price = req.headers['price'];

    var searchUserIDSQL = "SELECT userID FROM USERINFO WHERE userName = ? AND tempToken = ?"
    db.query(searchUserIDSQL, [userName, hash(tempToken)], async function (err, result) {
        if (err) throw err;
        const userID = result[0].userID;

        var sql = "INSERT INTO CART (userID, productID, orderID, quantity) VALUES (?, ?, ?, ?, ?)"

        db.query(sql, [userID, productID, orderID, quantity], async function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                res.status(401).json({
                    status: "failed",
                    message: "Invalid"
                });
            } else {
                res.status(200).json({
                    result: "Product Insert Successfully"
                });
            }
        });
    });

    
};