// require("dotenv").config();
// const express = require("express");
// const passport = require("passport");
// const session = require("express-session");
// const app = express.Router();
// const GoogleStrategy = require("passport-google-oauth20").Strategy;


// // Session Configuration
// app.use(
//   session({
//     secret: "your-secret-key",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// // Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());

// // Google OAuth Strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:3000/auth/google/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       return done(null, profile);
//     }
//   )
// );

// // Serialize & Deserialize User
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// // ✅ Correct Route for Google Sign-In
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// // ✅ Correct Callback Route for Google Auth
// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   (req, res) => {
//     res.json({ user: req.user, token: "dummy_token_123" }); // Return user data
//   }
// );

// // ✅ Check Auth Status
// app.get("/auth/status", (req, res) => {
//   if (req.user) {
//     res.json({ user: req.user });
//   } else {
//     res.status(401).json({ message: "Not Authenticated" });
//   }
// });

// // ✅ Logout Route
// app.get("/logout", (req, res) => {
//   req.logout(() => {
//     res.redirect("/");
//   });
// });

 

// module.exports = app;