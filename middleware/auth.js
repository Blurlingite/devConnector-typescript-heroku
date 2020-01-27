// bring in json webtoken
const jwt = require("jsonwebtoken");

// bring in config
const config = require("config");

// request, response, and next
// next us a callback that we have to run once we're done so it moves on to the next piece of middleware
// This entire module.exports will allow this code to be accessible by other files that call it: take in a json webtoken and validate it
module.exports = function(req, res, next) {
  // get the token from the header (b/c when we send a request to a protected route, we need to send the token within the header)

  // since a request has a header we can access the header with req.header
  // req is in the function as a parameter
  // x-auth-token is the key that we want to send the token in with
  const token = req.header("x-auth-token");

  // check if there is no token snd return a 401 error if so
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    // decode the token with jwt.verify() which takes in 2 parameters:
    // 1) the token sent in with the header
    // 2) the jwt secret, which we can get with config.get("nameOfSecret"). It gets the secret from default.json which is in the config folder

    // keep in mind that once we decode the token, we'll have access to the payload, which contains the user object under the field name "user" as seen in the const payload variable in users.js
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    // take the request object and assign the value to user
    // we can say decoded.user b/c when we decoded the token, we got access to it's info, which was an object with the field name of "user" as seen in the const payload variable in users.js
    req.user = decoded.user;

    // we call next() in any middleware at the end (kind of like how a return statement is at the end)
    next();
  } catch (err) {
    // when the token is invalid
    res.status(401).json({ msg: "Token is not valid" });
  }
};
