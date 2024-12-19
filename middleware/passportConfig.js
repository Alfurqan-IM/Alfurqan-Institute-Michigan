const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { users: USERS } = require("../models");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLOUD_API_SECRET,
      callbackURL:
        "http://localhost:5005/api/v1/authentication/google/callback", 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user is already registered
        // console.log(profile);
        const { name, email, picture, email_verified, sub } = profile._json;
        const { familyName, givenName } = profile.name;
        let user = await USERS.findOne({ where: { email } });
        if (!user) {
          // If the user is not registered, create a new user
          const userObject = {
            first_name: givenName,
            last_name: familyName,
            user_name: profile.displayName,
            password: `${sub + process.env.CLIENT_PASS}`,
            email,
            image: picture,
            isVerified: email_verified,
            emailNotification: true,
            phone: `+234${sub}`,
            verified: Date.now(),
            // Set other properties as needed from the Google profile
          };
          user = await USERS.create(userObject);
        }
        // Return the authenticated user
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // const user = await db.User.findByPk(id);
    const user = await USERS.findOne({ where: { user_id: user.user_id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

