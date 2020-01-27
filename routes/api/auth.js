const express = require("express"); // we need express to use routers

const router = express.Router();

// getting code from middleware folder's auth.js file
// we can now use this auth middleware by passing in this variable
const auth = require("../../middleware/auth");

// bring in json webtoken
const jwt = require("jsonwebtoken");

// bring in config so we can use the jwtSecret when we sign off on a json web token
const config = require("config");

// bring in bcrypt
const bcrypt = require("bcryptjs");

// bring in check and validationResult from express-validator package we downloaded to enable validation
const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");
// @route   GET api/auth
// @desc    Test route
// @access  Public

// we passed in the "auth" as the 2nd parameter so we can use the middleware. Always pass it in as the 2nd parameter. Just doing that will make this rout e protected
// This will allow you to get the user data as long as you have the right token (sent in on the request's header)
router.get("/", auth, async (req, res) => {
  try {
    // the req.user comes from the auth.js file in the middleware folder
    // in that file we set req.user equal to decode.user (the User object), so we can access the id value of that User object with req.user.id
    // we can access req.user anywhere in a protected route (like this one)
    // the .select("-password") will exclude the password field in the User object from being returned (which we don't want)
    const user = await User.findById(req.user.id).select("-password");
    res.json(user); // send the User object (and all it's values) in JSON format (this is how it prints out the User data in Postman after hitting "SEND")
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// we put req.body in console.log because req.body is the object with all the info. We want to print it in the console so we see what got the right thing

// Public access means they don't need a json web token to perform this code
// Otherwise you'll get an unauthorized access message

// @route   POST api/auth
// @desc    Authenticate User & get token
// @access  Public (b/c the purpose of this route is to get the token, which you'll need to access private routes)

// you can add words to the "/"" here if you want to change the endpoint
// for example if you put "/register" instead, the endpoint will be /register
router.post(
  "/",
  [
    // run check() function to display a message when user does not enter a valid email

    check("email", "Please include a valid email").isEmail(), // checks to see if what the user entered is in email format

    check("password", "Password is required").exists() // checks to see if the password exists (since we are validating an existing user when they attempt to login, we don't need to check the size of the password)
  ],
  // we must label this function as "async" so that we can use "async await" below
  // this will check for errors in the body of the request
  async (req, res) => {
    const errors = validationResult(req); // we can only use validationResult if we imported it, which we did when we said this above const { check, validationResult } = require("express-validator/check");

    // if there are errors (if any of the data user enters, doesn't match), we will return an error status of 400, or bad request, (which will be shown on the webpage)
    // we will also use .json() to view all the error messages in the form of
    // an array using .array()
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // we just want the email and password when we call req.body (I removed "name" because we don't need it to authenticate a user, usually when you authentiate a user you just need their email and password)
    // So set req.body equal to a const object variable
    // So now when we call req.body, we will only get email and password. We won't get an error even if there are other fields in the User object
    const { email, password } = req.body;

    try {
      // See if user exists

      // first grab the user
      // by using findOne() we can search by whatever you pass in (in this case an object containing the email, this is made possible by const { name, email, password } = req.body; ) above. We can just put in "email" b/c it's in that variable
      let user = await User.findOne({ email });

      // See if there is not a user that matches a user in our database (the user entered the wrong email or password)
      if (!user) {
        return res // need a return here or you'll get some sort of error
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // make sure the password matches (make sure to bring in bcrypt at the top b/c you need it to check passwords)
      // bcrypt has a method that takes a plain text password and an encrypted password and tells you if they are a match or not. And since this compare() method returns a promise, the function should have the async keyword or it won't work

      // the "password" is the plain text password (Ex. blueViolin) comes from const { email, password }
      // the user.password is the encrypted password (Ex. ey.HJHSNIE@JSMJDS) that is on the User object which we get from let user = await User.findOne({ email }); above. The password on the User object should already be encrypted when the user was registered
      const isMatch = await bcrypt.compare(password, user.password);

      // If the password did not match, return a 400 error stating "Invalid Credentials"
      // It is good to keep your messages as general and genric as possible so hackers can't be aware of what's going on. Don't put "Password is invalid" or they'll know that this part of the code works with passwords
      if (!isMatch) {
        return res // need a return here or you'll get some sort of error
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // return the json web token so that in the front end when the user registers, we want them to be logged in right away, and in order to be logged in, you have to have that json web token
      // without the token, the user cannot be authenticated

      // create our payload. Payload is the data that uniqulely identifies the User object, which is the id in this case

      // the payload will be an object    user:   ----> This comes from the user variable above, which eventually gets saved with user.save()

      // that object has an id field (which was made for us even though it is not a field in User.js)      id:
      // that id field needs to be given the id value that MongoDB gave it with user.id
      const payload = {
        user: {
          id: user.id // even though the id field is _id in the online database, mongoose lets us just use ".id" instead of "._id"
        }
      };

      // in order to use json web tokens we must sign off with jwt.sign
      // it takes 2 required parameters and 2 optional parameter:
      // 1) the payload (contained by our variable)
      // 2) the secret
      // 3) a set of options, in this case, an expiration
      // 4) a callback
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 }, // 3600 seconds, which is 1 hour is the expiration
        (err, token) => {
          // this callback takes in a possible error (err) and the json webtoken itself (token), but this code block won't fail if only 1 of the parameters gets an argument

          if (err) throw err; // if there's an error, throw it
          res.json({ token }); // if there is no error, send this data (the token, back to the client (web browser). You could send some other data like the id but it's not necessary)
        }
      );
    } catch (err) {
      // the error will most likely be a server error
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// we have to export the router in order for server.js to pick it up
module.exports = router;

// test out this URL in the browser to see if you get the JSON message http://localhost:5000/api/users/test
