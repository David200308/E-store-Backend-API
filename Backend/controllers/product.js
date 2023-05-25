const db = require("../database");

exports.getAllProducts = async (req, res, next) => {
    var sql = "SELECT * FROM PRODUCT"
    db.query(sql, async function (err, result) {
        if (err) throw err;
        res.status(200).json({
            status: "success",
            data: result
        });
    });
};

exports.getProductById = async (req, res, next) => {
    const productID = req.params.productID;

    var sql = "SELECT * FROM PRODUCT WHERE productID = ?"
    db.query(sql, [productID], async function (err, result) {
        if (err) throw err;
        res.status(200).json({
            status: "success",
            data: result
        });
    });
};

exports.getProductByTitle = async (req, res, next) => {
    const title = req.params.title;

    var sql = "SELECT * FROM PRODUCT WHERE title = ?"
    db.query(sql, [title], async function (err, result) {
        if (err) throw err;
        res.status(200).json({
            status: "success",
            data: result
        });
    });
};