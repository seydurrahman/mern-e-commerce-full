const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  // need paypal
  client_id:
    "AVufyXST6MPXfSX2AASabQm9E0sEkqLxMziS8iBs7Nex3lrAp81ebG6lWD4v0qJ121Jn4xGHuFjkrkIr",
  // need paypal password
  client_secret:
    "EMl2EuNn8jIbpma0ANUkiv72LfKUL4ZXvT_tz--Knkz5zkcgRUfvr475R-I8F9jAM75LKbEw-UWwlmfE",
});

module.exports = paypal;
