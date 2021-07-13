require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const ejs = require("ejs");
const db = require("./db");
db();
const session = require("express-session");
const flash = require("express-flash");
const mongoDbStore = require("connect-mongo");
const Emitter = require("events")


// session config-----

app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    store: mongoDbStore.create({ mongoUrl: process.env.DB_URL, collectionName: "sessions" }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.use(flash());



// event emitter config----

const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);


// server listening-----

http.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
});

// view engine config---------------------

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// routes----

const home = require("./routes/home");
app.use("/", home);

const register = require("./routes/register");
app.use("/register", register);

const login = require("./routes/login");
const { send } = require("process");
app.use("/login", login);




// Socket.io connection----

const io = require("socket.io")(http);

let to;
let sender;

eventEmitter.on("getId", (data) => {
    to = data.to;
    sender = data.sender;
});

io.on("connection", (socket) => {
    // socket.on("user_connect", (username) => {

    //     // another user connected----

    //     socket.broadcast.emit("another_user_connected", username);

    //     // sending message to another users---

    //     socket.on("user_message_server", (data) => {
    //         socket.broadcast.emit("user_message_clients", data);
    //     });


    //     // sending other user id to client------------

    //     // getting id from home.js----

    // });

    let mul = sender * to;

    let room = `${mul}`;


    socket.join(room);


    socket.on("user_message_server", (data) => {
        //    send to user---
        send(data, room);
    })

    function send(data) {
        socket.to(room).emit("userMessage", data);
    };
});


