const User = require("../models/user");

// render profile page
exports.profile = function (req, res) {
    return res.render("user_profile", {
        title: "User Profile",
        profile_user: req.user,
    });
};

// update user Details
exports.updateUser = async function (req, res) {
    try {
        const user = await User.findById(req.user.id);
        const { username, password, confirm_password } = req.body;

        if (password != confirm_password) {
            console.log("Passwords don't match");
            return res.redirect("back");
        }

        if (!user) {
            console.log("User not found");
            return res.redirect("back");
        }

        user.username = username;
        user.password = password;

        await user.save();
        console.log('Details updated successfully');
        return res.redirect("back");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

// render the Sign In page
exports.signIn = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/profile");
    }
    return res.render("signin.ejs");
};

// render the Sign Up page
exports.signUp = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/profile");
    }
    return res.render("signup.ejs");
};

// creating up a new user
exports.create = async (req, res) => {
    try {
        const { username, email, password, confirm_password } = req.body;

        // if password doesn't match
        if (password != confirm_password) {
            console.log("Passwords don't match");
            return res.redirect("back");
        }

        // check if user already exist
        const user = await User.findOne({ email });

        if (!user) {
            await User.create({
                email,
                password,
                username,
            });
        
            return res.redirect("/");
        } else {
            console.log("Email already registered!");
            return res.redirect("back");
        }
        
    } catch (err) {
        console.log(err, "Error in creating new user");
        return res.redirect("back");
    }
};


// sign in and create a session for the user
exports.createSession = (req, res) => {
    return res.redirect("/dashboard");
};

// clears the cookie
exports.destroySession = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        return res.redirect("/");
    });
};
