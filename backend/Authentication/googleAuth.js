const User = require("../models/Users.js");
const passport = require("passport");
const generateToken = require("../utils/generateToken.js");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();

// Define a findOrCreate function
const findOrCreate = async (profile, done) => {
  const user = await User.findOne({
    email: profile.emails[0].value,
  });

  if (user) {
    const token = await generateToken(user._id);

    return done(null, { ...user, token });
  } else {
    try {
      const newUser = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        profilePicture: profile.photos[0].value.replace("s96", "s240"),
        signupMethod: "google",
        // Add other user properties here
      });

      const savedUser = await newUser.save();
      const token = await generateToken(savedUser._id);
      return done(null, { ...savedUser, token });
    } catch (err) {
      return done(err);
    }
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
      passReqToCallback: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
      console.log("PROFILE: ", profile);
      findOrCreate(profile, done); // Call the custom findOrCreate function
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize the user object, you may want to use a unique identifier
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .exec()
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});
