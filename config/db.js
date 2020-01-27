// bring in mongoose, since that is what we will use it for object data modeling (ODM)
const mongoose = require("mongoose");

// bring in the config package (one of the dependencies we downloaded)
//lets us be able to grab the connection string in default.json
const config = require("config");

// actually grabs the connection string in default.json by passing in mongoURI (which is in default.json)
const db = config.get("mongoURI");

// connect to mongoose db
// this is an asynchronous arrow function
// put it in a try-catch block so if we fail to connect, we can see the error
// most of the times in async await, we will use a try catch block
const connectDB = async () => {
  try {
    // we put "await" here b/c mongoose.connect returns a promise
    // we pass in the variable db, which holds our connection string
    // the current string parser is outdated so we pass in { useNewUrlParser: true } as the second parameter
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true, // gets rid of deprecation warning
      useFindAndModify: false // gets rid of findOne() deprecation warning
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    // use console.error and pass in err.message to get the error message and then print it out
    console.error(err.message);

    //escape from the process with failure, make the application fail if it enters this catch block
    process.exit(1);
  }
};

// export the code (all the necessary parts of the code are in the connectDB variable) in this file so it can be used in other files in your application. (Similar to how in HTML we link the css and js files with tags)
module.exports = connectDB;
