const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");


router.get("/", (req, res) => {
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.render("register");
    }
});


function randomNo() {
    no = (Math.random() * 100) + (Math.random() * 100);
    return no;
}
randomNo()

router.post("/", async (req, res) => {

    try {
        const { username, email, password, confirmPassword } = req.body;

        if (password.trim() == confirmPassword.trim()) {
            const newUser = new userModel({
                name: username.trim(),
                email: email.trim(),
                password: password.trim(),
                uniqueNo: randomNo()
            });

            await newUser.save();

            res.render("login");
        } else {
            res.render("login", { message: "Password does not match" });
        };


    } catch (error) {
        console.log(error);
    };
});

module.exports = router;