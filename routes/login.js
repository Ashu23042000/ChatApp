const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");


router.get("/", (req, res) => {
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.render("login");
    }
});

router.post("/", async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (user) {
            if (user.password == password.trim()) {
                req.session.user = user;
                res.redirect("/");
            } else {
                res.render("login", { message: "Password is not match" });
            };
        } else {
            res.render("login", { message: "User is not found" });
        };

    } catch (error) {
        console.log(error);
    }
});

module.exports = router;