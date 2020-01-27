const express = require("express");

// the config package(dependency we downloaded) stores the variables that are accessible by all your program's files
// "db" is another one of your js files and is in the config folder
// so the file path is ./config/db
// the ./ returns you to the devconnector folder (the root, the beginning)
const connectDB = require("./config/db");

// path is a core node module used to manipulate file paths. We are using it so we can deploy this application to heroku.
const path = require("path");

const app = express();

// connect database
// looks like it takes the const connectDB variable and uses it to connect to the database. That variable does lead you to the db.js file where you setup how you connect to the database, and then export at the end with modeule.exports
connectDB();

// Init Middleware (included with Express)
// So we can just use express.json()
// This allos us to get the data in req.body in users.js in the router.post()
app.use(express.json({ extended: false }));

// Use routes
// what this will do is make the endpoint you passed in (the first string) pertain to the '/' in the router.get() in users.js as dictated by the second parameter you passed in here. You don't need to put the ".js" extension on users here.
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

// Server static assets in production (deploying to heroku)
if (process.env.NODE_ENV === "production") {
  // Set static folder using express. With express, you can set a specific folder to be your public/static folder
  // When we deploy to heroku, a "build" folder will be created in our "client" folder. So, we set that "build" folder as the static folder that heroku will use to build our application on their site
  app.use(express.static("client/build"));

  // Serve the index.html file
  // Also, an "index.html" file will be in the "build" folder. That file is super important, it's the gateway to everything in your application, which heroku obviously needs
  // The "*" will allow it to get anything except for the 4 api routes above
  app.get("*", (req, res) => {
    // sendFile() will let us load that index.html file
    // We will use the path modules from above in path.resolves()
    // resolves() is just a cleaner way of loading the index.html file
    // __dirname is the current directory (which we are going from)
    // We put "client" b/c we want to go into the client folder
    // We put "build" b/c we want to go into the build folder in the client folder
    // We put "index.html" b/c that is the file we want to load (that is in the build folder which is in the client folder.)

    res.sendFile(path.resolves(__dirname, "client", "build", "index.html"));
  });
}

// when we deploy to heroku, this is where it gets the port number
// locally, if there is no default environment set, it defaults to localhost:5000
const PORT = process.env.PORT || 5000;

// when you connect to the server, this will print out this message
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
