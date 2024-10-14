const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");
const path = require("path")

const app = express(); //iniciando express

//Models
const Tought = require("./models/Tought");
const User = require("./models/User");

//Import routes
const toughtRoutes = require("./routes/toughtRoutes");
const authRoutes = require("./routes/authRoutes");

//import controller
const ToughtController = require("./controllers/ToughtController");

//impostando handlebars-engine
app.engine("handlebars", exphbs());
app.set("view engine", path.join(__dirname, "handlebars"));
app.set("view engine", "handlebars");

//recebendo body
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

//session middleware
app.use(
  session({
    name: "session",
    secret: "nosso_secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
  })
);

//Flash msg
app.use(flash());

//public
app.use(express.static(path.join(__dirname + "/public")));

//Session to res
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  }
  next();
});

//Routes
app.use("/toughts", toughtRoutes);
app.use("/", authRoutes);

app.get("/", ToughtController.showToughts);

const conn = require("./db/conn"); //chamando conn.js

conn
  .sync(/* {force:true} */)
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
