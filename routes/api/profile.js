const express = require("express"); // we need express to use routers

// used when trying to get github repos (towards end of this page)
const request = require("request");

const config = require("config");

const router = express.Router();

// get code from auth.js in middleware folder so we can perform authentication
const auth = require("../../middleware/auth");

const { check, validationResult } = require("express-validator/check");

const Profile = require("../../models/Profile");

const User = require("../../models/User");

const Post = require("../../models/Post");

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private (b/c the user needs to have the token when they are logged in. Everything here assumes the user has logged in already)

// we use "async" b/c we are usimg mongoose here, which returns a promise
// the /me is the endpoint as shown here:  @route   GET api/profile/me
router.get("/me", auth, async (req, res) => {
  try {
    // the "user:" is the user field in ProfileSchema in Profile.js in the models folder. And that has a type of ObjectId. We set the ObjectId to the user ID that comes in with the token on the request with req.user.id
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user", // the 1st parameter is the object you want to get data from. We use "user" (with a lowercase u) b/c in User.js's module.exports statement we added the UserSchema (object) to the model under that name (user)
      [
        // the 2nd parameter is an array of fields from that object you want
        "name",
        "avatar"
      ]
    );

    // if there's no profile for the user, return a 400 error
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/profile
// @desc    Create/Update a user profile
// @access  Private (b/c the user needs to have the token when they are logged in. Everything here assumes the user has logged in already)

// the endpoint is '/' because there is nothing after api/profile in the URL
router.post(
  "/",

  [
    //  everything in this purple square bracket are the 2 middlewares (check & validationResult) we are using for validation (brought in by this variable: const { check, validationResult } = require("express-validator/check");
    auth,
    [
      // we check for status and skills because those are the only fields that are marked as "required" in the ProfileSchema
      check("status", "Status is required")
        .not()
        .isEmpty(),
      check("skills", "Skills is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    // validationResult takes in the request (req) and return any errors, which are then assigned to the const errord variable
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // errors.array is the array of all the errors, which we assign to a field called "errors" and we use .json to print it out in a console (on Postman)
      return res.status(400).json({ errors: errors.array });
    }

    // this pulls all these fields from the req.body (the body of the request)
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // Build Profile object

    const profileFields = {}; // initialize to an empty Profile object that you will fill up with the following code

    // we can set the user field of the ProfileSchema (Profile object) to the ObjectId of the user that got sent in with the request with req.user.id
    // Request (req) -> User object (user) -> ID field on the User object (id)
    profileFields.user = req.user.id; // it will know this just by the token that was sent in with the request

    // if there was a company, set the company field of the Profile object(profileFields), profileFields.company equal to that company
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    // Since skills is an array we have to split each item by the comma ","
    // Then we can use the map() function to declare a variable (skill) and trim the whitespace from each skill with the trim() function
    // The map() performs an action (the removing whitespace) on each element in the skill array
    // after the map() function is done, the split() function returns the new array (of skills without whitespace) to profileFields.skills, which is the skills field of the ProfileSchema (Profile object) in Profile.js in the models folder
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    // Build social object

    // now set the social field to an empty object, if you don't do this, you'll get an "undefined" error, it needs some value, so let it be an empty object for now
    profileFields.social = {};

    // The social field is an object made up of objects (youtube, twitter, etc.)
    // This is slightly different than what we did with the skills field which is an array of objects(strings)
    // So we, can't the youtube object with profileFields.youtube, we have to use profileFields.social.youtube
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      // findOne() & findOneAndUpdate are monggose methods() so we need to use "await"
      // findOne() is a function available to all objects.
      // Our object is called "Profile" b/c that is what we exported it as in Profile.js in the models folder
      // We pass in the Profile object's user field (which will just hold the user's ID, not the whole user) and assign it req.user.id, which just grabs the user ID (user.id) from the request (req)
      let profile = await Profile.findOne({ user: req.user.id });

      // if the profile is found
      if (profile) {
        // Update the profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id }, // User's ID
          { $set: profileFields }, // uses the values in profileFields to update the profile by setting all the fields in the Profile object ("profile") with the fields in profileFields
          { new: true } // to show that we are making changes to the profile???
        );

        // return the whole profile
        return res.json(profile);
      }

      // if you could not find a profile, create it
      profile = new Profile(profileFields);
      // we save the Profile object using lowercase "profile", not uppercase "Profile" because is the model (for an object) and we need to save it on the instance of the model (profile)
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// access Public

router.get("/", async (req, res) => {
  try {
    // we want the name and avatar too (they are part of a profile) which are part of the user model so we use populate("NAMEOFMODEL", ["fieldName1", "fieldName2", etc.])
    // the find() method finds all of the model you specify (Profile)
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// NOTICE: we put a : before user_id because user_id is a placeholder we made up, that will be passed a value (the user's ID)
// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID (not profile ID)
// access Public

router.get("/user/:user_id", async (req, res) => {
  try {
    // we want the name and avatar too (they are part of a profile) which are part of the user model so we use populate("NAMEOFMODEL", ["fieldName1", "fieldName2", etc.])
    // we access the user ID from the URL sent by the request so we use "req.params.user_id" (user_id is what is in the URL)
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    // if there is no profile for that userID, return a 400 error
    if (!profile) return res.status(400).json({ msg: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error(err.message);

    // if the user ID is too long to be a user ID, we don't want to say "Server Error" we want it to say "Profile not found"
    // err.kind is assigned the ObjectId type so if the error has something to do with the ObjectId it will go into this if statement. It's the "kind" of error, an ObjectId error
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// access Private

// we need "auth" because we have a json webtoken coming in with the request
// json webtokens are used in updates and deletes
router.delete("/", auth, async (req, res) => {
  try {
    // Remove user's posts

    // use deleteMany() to delete all the posts by the user, and there might be hundreds, thousands, etc.
    await Post.deleteMany({ user: req.user.id });

    // remove profile
    // the "user.id" comes from the json webtoken that was sent in with the request. Part of json webtoken id the ObjectId (user ID)
    await Profile.findOneAndRemove({ user: req.user.id });

    // remove user
    // NOTICE: we use "_id" because that is the field in the User object
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// we use PUT instead of POST b/c we are updating a part of the profile object that is not a required field (the experience)
// @route   PUT api/profile/experience
// @desc    Add profile experience
// access Private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // take all these fields from the request's body
    // now any const that uses all these fields will get the values we got from the request's body and assign them to these fields (title, company, etc.)
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    // uses the above const to fill in fields in this newExp object
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      // find the profile by user ID from request's json webtoken
      const profile = await Profile.findOne({ user: req.user.id });

      // "profile.experience" is the array of experiences
      // unshift() will add the new experiences from "newExp" to the beginning rather than push() which adds it to the end
      // this way, the most recent experiences are first
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// access Private

// "exp_id" is a just a placeholder so we need the ":"
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    // get profile by user ID
    const profile = await Profile.findOne({ user: req.user.id });
    // get the remove index (the ID of the experience you want to remove)
    const removeIndex = profile.experience // target the expeience section of Profile object
      .map(item => item.id) // go through all the experiences and return the id BUT...
      .indexOf(req.params.exp_id); // only pick the experience with the experience ID that came in with the request (and there should be one because in router.delete we have "exp_id" in there)

    // we want to splice out the experience by using it's ID (now stored in removeIndex)
    // We want to remove just that 1 experience so we put "1"
    profile.experience.splice(removeIndex, 1);

    // save the profile (if you don't, the experience won't be removed)
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// we use PUT instead of POST b/c we are updating a part of the profile object that is not a required field (the education)
// @route   PUT api/profile/education
// @desc    Add profile education
// access Private

router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required")
        .not()
        .isEmpty(),
      check("degree", "Degree is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "Field of study is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // take all these fields from the request's body
    // now any const that uses all these fields will get the values we got from the request's body and assign them to these fields (title, company, etc.)
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    // uses the above const to fill in fields in this newExp object
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      // find the profile by user ID from request's json webtoken
      const profile = await Profile.findOne({ user: req.user.id });

      // "profile.education" is the array of experiences
      // unshift() will add the new experiences from "newExp" to the beginning rather than push() which adds it to the end
      // this way, the most recent experiences are first
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// access Private

// "edu_id" is a just a placeholder so we need the ":"
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    // get profile by user ID
    const profile = await Profile.findOne({ user: req.user.id });
    // get the remove index (the ID of the education you want to remove)
    const removeIndex = profile.education // target the education section of Profile object
      .map(item => item.id) // go through all the educations and return the id BUT...
      .indexOf(req.params.edu_id); // only pick the education with the education ID that came in with the request (and there should be one because in router.delete we have "edu_id" in there)

    // we want to splice out the education by using it's ID (now stored in removeIndex)
    // We want to remove just that 1 education so we put "1"
    profile.education.splice(removeIndex, 1);

    // save the profile (if you don't, the education won't be removed)
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/github/:username
// @desc    Get user's repos from Github
// access Public  // is public b/c viewing a profile is a public thing, it should not be private

router.get("/github/:username", (req, res) => {
  try {
    // an object with a uri field
    const options = {
      // make sure you use a backtick (`), not a quotation mark (' or "). Backticks let you plug in variables with ${}
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" }

      // ABOUT THE uri:
      // In req.params.username, "username" is a field that the github object uses for the username of a user. It's not something you define in your code
      // The "?" separates the URL from the parameters that come after it
      // The "per_page=5" limits the amount of repos that appear on each page to 5.        "per_page" is the key. "5" is the value
      // The "&" is used to separate parameters in the URL
      // "sort=created:asc" sorts the repos in ascending order.         "sort" is the key. "created:asc" has a key (created) and a value (asc) that both become the value for the outer key (sort)
      // In "client_id=${config.get("githubClientId")"  client_id is another field github uses for the client ID.  We put a field for client ID in our default.json file in the config folder. So we use config.get() and plug in the name of the field we use to represent client ID (githubClientId) to get the client ID. We had to register this application at https://github.com/settings/developers/ to get the client ID and client secret values we put in default.json
      // Same thing with client_secret=${config.get("githubSecret")}

      // We have the method set to "GET" b/c we are getting repos from github
      // we have headers that github requires us to have. We must say which technology we are using to access github's API, which is Node.js. We must assign that to the field github uses (user-agent)
    };

    // make the request
    // 1st parameter is the options object we just made
    // 2nd parameter is a callback that contains error(s), a response, and a body (data you get back from request)
    request(options, (error, response, body) => {
      if (error) console.error(error);

      // if the response is not 200 (success) return a 404 error
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No Github profile found" });
      }

      // we use JSON.parse on the body so that it formats the data neatly into JSON format (instead of 1 super long string on a single line)
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// we have to export the router in order for server.js to pick it up
module.exports = router;

// test out this URL in the browser to see if you get the JSON message http://localhost:5000/api/users/test
