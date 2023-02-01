// This example is built using express
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

///////////////////////////////////////////
// ⚙️ Setup Server
///////////////////////////////////////////

const app = express();

const staticDir = path.join(__dirname, 'static');
const checkoutPage = path.join(__dirname, 'static', 'checkout.html');

app.use(bodyParser.json());
app.use('/static', express.static(staticDir));

app.get('/', (req, res) => {
  return res.sendFile(checkoutPage);
});

///////////////////////////////////////////
// ✨ All the magic is here 
//    Create a client session 
///////////////////////////////////////////

const PRIMER_API_URLS = {
  SANDBOX: 'https://api.sandbox.primer.io',
  PRODUCTION: 'https://api.primer.io',
}

const API_KEY = process.env.API_KEY;
const PRIMER_API_URL = PRIMER_API_URLS[process.env.PRIMER_API_ENVIRONMENT];

app.post('/client-session', async (req, res) => {
  const url = `${PRIMER_API_URL}/client-session`;

  const response = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Version': '2.2',
      'X-Api-Key': API_KEY,
    },
    body: JSON.stringify({
      // Create an orderId for this client session
      // Make sure to keep track of it: you will later receive updates through Webhooks.
      orderId: 'order-' + Math.random(),

      // 3-character Currency Code used for all the amount of this session
      currencyCode: 'EUR',

      // emailAddress and billingAddress are required for 3DS
      customer: {
        emailAddress: "test@test.com",
        mobileNumber: "+6588889999",
        firstName: "John",
        lastName: "Smith",
        billingAddress: {
          firstName: "John",
          lastName: "Smith",
          postalCode: "CB94BQ",
          addressLine1: "47A",
          countryCode: "CL",
          city: "Cambridge",
          state: "Cambridgeshire"
        }
      },

      order: {
        // Line items for this session
        // If your checkout does not have line items:
        //  > Pass a single line item with the total amount!
        lineItems: [
          {
            itemId: 'shoes-123',
            description: 'Some nice shoes!',
            amount: 2500, // Amount should be in minor units!
            quantity: 1,
          },
        ],
      }

      // Check all the other options at https://apiref.primer.io/v2/reference/create_client_side_token_client_session_post
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
