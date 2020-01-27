const express = require("express"); // we need express to use routers

const router = express.Router();

// bring in gravatar package we installed in the beginning
const gravatar = require("gravatar");

// bring in bcrypt
const bcrypt = require("bcryptjs");

// bring in json webtoken
const jwt = require("jsonwebtoken");

// bring in config so we can use the jwtSecret when we sign off on a json web token
const config = require("config");

// bring in check and validationResult from express-validator package we downloaded to enable validation
const { check, validationResult } = require("express-validator/check");

// we can do router.post() etc. depending on what kind of HTTP you need to use

// we don't need to include /api/users because we already did in server.js

// it's good practice to write these 3 @s for the routers:
// 1st the method(POST) and URL
// 2nd a description of what it's doing
// 3rd the level of access (in this case it is private because we don't want someone to be able to create a profile if they are not logged in as a user yet, which they won't be because this is the users router. They have to get past this to become a user). We can use JSON tokens for this. We can make it so that they get a JSON token when they sign up to be a user, and send the JSON token (on the request) when they try to make a profile. If they have the JSON token, (they are logged in) let them make the profile, otherwise if they don't (haven't made an account yet) do not let them have access to the making a profile feature

// go up 2 levels (or directories), go into the models folder, and then access the User.js file, which will bring in the template for a User object
const User = require("../../models/User");

// @route   POST api/users
// @desc    Register User- this route allows a user to register
// @access  Public

// you can add words to the "/"" here if you want to change the endpoint
// for example if you put "/register" instead, the endpoint will be /register
router.post(
  "/",
  [
    // run check() function to display a message when user does not enter anything for "name"
    check("name", "Name is required")
      .not()
      .isEmpty(),

    check("email", "Please include a valid email")
      .isEmail() // checks to see if what the user entered is in email format
      .not()
      .isEmpty(),

    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }) // checks to see if the password the user entered is at least 6 characters long
  ],
  // we must label this function as "async" so that we can use "async await" below
  async (req, res) => {
    const errors = validationResult(req); // we can only use validationResult if we imported it, which we did when we said this above const { check, validationResult } = require("express-validator/check");

    // if there are errors (if any of the data user enters, doesn't match), we will return an error status of 400, or bad request, (which will be shown on the webpage)
    // we will also use .json() to view all the error messages in the form of
    // an array using .array()
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // we just want the name, email and password when we call req.body
    // So set req.body equal to a const object variable
    // So now when we call req.body, we will only get name, email and password. We won't get an error even if there are other fields in the User object
    const { name, email, password } = req.body;

    try {
      // See if user exists

      // first grab the user
      // by using findOne() we can search by whatever you pass in (in this case an object containing the email, this is made possible by const { name, email, password } = req.body; ) above. We can just put in "email" b/c it's in that variable
      let user = await User.findOne({ email });

      // See if user exists already
      if (user) {
        return res // need a return here or you'll get some sort of error
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // Get user's gravatar (based on email)
      const avatar = gravatar.url(email, {
        s: "200", // size of 200
        r: "pg", // the rating
        d: "mm" // the default. mm gives you a default image
      });

      // take the user variable you have and set it to a new User object (instantiation)
      // then pass in all the fields it will take to make a User object
      // those fields come from the 2 const variables above
      // this just makes a new instance of a User object, it doesn't save it, which we will do later
      user = new User({
        name,
        email,
        avatar,
        password
      });

      // create a salt to be able to do hashing
      // bcrypt.genSalt() can return a promise so we use "await" here
      // we pass in number of rounds (10) the more you have the more secure, but it takes more time
      const salt = await bcrypt.genSalt(10);

      // Encrypt the password using bcrypt
      // access the password from User object held by user variable with user.password

      // then use bcrypt.hash(), which can return a promise so we need "await" It takes in 2 parameters, first, the original password, second, the salt used to hash it with.
      // Then it will return the hashed password
      user.password = await bcrypt.hash(password, salt);

      // Actually save the user now, after creating
      // user.save() return a promise so we use "await" here too. Without it, we'd have to write more code to do the same thing (stuff like .then(), etc.)
      await user.save();

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
// we put req.body in console.log because req.body is the object with all the info. We want to print it in the console so we see what got the right thing

// Public access means they don't need a json web token to perform this code
// Otherwise you'll get an unauthorized access message

// we have to export the router in order for server.js to pick it up
module.exports = router;

// test out this URL in the browser to see if you get the JSON message http://localhost:5000/api/users/test
