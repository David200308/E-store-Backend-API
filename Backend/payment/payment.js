const express = require('express');
const { createHash } = require('crypto');
var cors = require('cors');
const stripe = require('stripe')(process.env.paymentAPI) // api key need to write in here

function hash(string) {
    return createHash('sha256').update(string).digest('hex');
}

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.post("/checkout", async(req, res) => {
    // console.log(req.body);
    const items = req.body.items;
    let lineItems = [];

    const datetime = new Date();
    const userName = req.headers['userName'];
    const tempToken = req.headers['tempToken'];

    const orderID = hash(datetime.toString() + userName + tempToken);

    const paymentValue = 0;

    items.forEach((item) => {
        const productID = item.id;
        const quantity = item.quantity;

        const cartURL = 'http://127.0.0.1:3001/cart'
        fetch(cartURL, {
            method: 'GET',
            headers: {
                'userName': userName,
                'tempToken': tempToken,
                'orderID': orderID,
                'productID': productID,
                'quantity': quantity
            }
        })
        .then(res => res.json())

        lineItems.push(
            {
                price: item.id,
                quantity: item.quantity
            }
        )

        // paymentValue = 
    });

    const paymentURL = 'http://127.0.0.1:3001/payment/' + orderID;
    fetch(paymentURL, {
        method: 'GET',
        headers: {
            'userName': userName,
            'tempToken': tempToken,
            'paymentValue': paymentValue
        }
    })
    .then(res => res.json())

    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel"
    });

    res.send(JSON.stringify({
        url: session.url
    }));

});

app.listen(4000, () => console.log("Listening on port 4000"));