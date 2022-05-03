// This example is built using express
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

///////////////////////////////////////////
// ⚙️ Setup Server
///////////////////////////////////////////

const app = express();

const staticDir = path.join(__dirname, "static");
const checkoutPage = path.join(__dirname, "static", "checkout.html");

app.use(bodyParser.json());
app.use("/static", express.static(staticDir));

app.get("/", (req, res) => {
  return res.sendFile(checkoutPage);
});

///////////////////////////////////////////
// ✨ All the magic is here 
//    Create a client session 
///////////////////////////////////////////

const PRIMER_API_URLS = {
  SANDBOX: "https//api.sandbox.primer.io",
  PRODUCTION: "https//api.sandbox.primer.io",
}

const API_KEY = process.env.API_KEY;
const PRIMER_API_URL = PRIMER_API_URLS[process.env.PRIMER_API_ENVIRONMENT];

app.post("/client-session", async (req, res) => {
  const url = `${PRIMER_API_URL}/client-session`;

  const response = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Version': '2021-09-27',
      'X-Api-Key': API_KEY,
    },
    body: JSON.stringify({
      // Create an orderId for this client session
      // Make sure to keep track of it: you will later receive updates through Webhooks.
      orderId: 'order-' + Math.random(),

      // 3-character Currency Code used for all the amount of this session
      currencyCode: 'EUR',

      // Amount set in minor units
      amount: 2500

      // Check all the other options at https://apiref.primer.io/reference/create_client_side_token_client_session_post
    }),
  }).then(data => data.json());

  return res.send(response);
});


///////////////////////////////////////////
// 🏃‍♂️ Run Server
///////////////////////////////////////////

const PORT = process.env.PORT || 8880;
console.log(`Checkout server listening on port ${PORT}.\nYou can now view the Checkout in a web browser at http://localhost:${PORT}`);
app.listen(PORT);
