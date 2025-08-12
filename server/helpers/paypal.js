const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  // need paypal
  client_id: process.env.PAYPAL_CLIENT_ID,
  // need paypal password
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

module.exports = paypal;
