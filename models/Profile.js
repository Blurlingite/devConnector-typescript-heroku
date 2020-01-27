const mongoose = require("mongoose");

// make a schema for Profile object using mongoose
const ProfileSchema = new mongoose.Schema({
  // profiles are linked to users, every user has a profile, so we need a field that represents the User object in the Profile object
  // What this is doing is making the type of this field equal to the ObjectId (user ID)
  // ObjectId is a field in your database that gets created when a user is created (our code doesn't make the ObjectId, mongoose does it for us)
  // Since mongoose is doing that for us we have to use "mongoose"
  // Since we are trying to access another object (User) we use ".Schema"
  // Since we are trying to access an individual property on that object (ObjectId) we use ".Types"
  // Since we are trying to the ObjectId ".ObjectId"
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user" // need a ref to the object we are talking about
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    // stuff like Teacher, Student, etc.
    type: String,
    required: true
  },
  skills: {
    type: [String], // an array of strings, because a user can have more than 1 skill
    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  experience: [
    // an array of fields holding the user's experiences
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],

  education: [
    // an array of fields holding the user's education
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  social: {
    // an object of objects for the user's social media links
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now // put in current date by default
  }
});

// package all the code in this file (the const ProfileSchema) and add it to the model object (which you use in files outside this one just like with JSPs & Controllers in Java)
// whenever you want to access the ProfileSchema (the Profile object), to plug in it's values for example, you will use "profile" NOT "Profile"
// I guess the "Profile" is used when you declare a const variable in other file and make it that name. So in another file, you would have a variable called "const Profile"
module.exports = Profile = mongoose.model("profile", ProfileSchema);
