const express = require("express");
const loginControllers = require("../controllers/login");
const paymentControllers = require("../controllers/cartPayment");
const cartControllers = require("../controllers/cart");
const productControllers = require("../controllers/product");
const router = express.Router();

// Router for get & insert information from the user
router.route("/login/:userName").get(loginControllers.userLogin);
router.route("/logout/:userName").get(loginControllers.userLogout);
router.route("/signup/:userName").get(loginControllers.userSignup);

// Router for get & insert information for cart and payment
router.route("/paying/:orderID").get(paymentControllers.paying);
router.route("/payment/:orderID").get(paymentControllers.insertPaymentInfo);
router.route("/cart").get(cartControllers.insertCartInfo);

// Router for product
router.route("/getAllProducts").get(productControllers.getAllProducts);
router.route("/getProduct/:productID").get(productControllers.getProductById);
router.route("/getProduct/:title").get(productControllers.getProductByTitle);


module.exports = router;