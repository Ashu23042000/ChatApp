const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");

router.get("/", async (req, res) => {
    if (req.session.user) {
        const users = await userModel.find({ _id: { $ne: [req.session.user._id] } });
        res.render("home", { users, user: req.session.user });
    } else {
        res.redirect("/login");
    }
});



router.get("/chat/:to/:sender", async (req, res) => {
    try {
        const to = req.params.to;
        const sender = req.params.sender;
        const users = await userModel.find({});
        if (req.session.user) {

            // emitting data to server----

            const event_emitter = req.app.get("eventEmitter");
            event_emitter.emit("getId", { to, sender })
            res.render("chat", { users, user: req.session.user });
        } else {
            res.redirect("/login");
        }
    } catch (error) {
        console.log(error);
    }
});



module.exports = router;