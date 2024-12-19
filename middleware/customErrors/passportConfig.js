const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { users: USERS } = require("../../models");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLOUD_API_SECRET,
      // callbackURL: "http://localhost:5003/api/v1/authflow/google/callback",
      callbackURL:
        "https://apiariessixteen.onrender.com/api/v1/authflow/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user is already registered
        // console.log(profile);
        const { name, email, picture, email_verified, sub } = profile._json;
        const user = await USERS.findOne({ where: { email } });
        if (!user) {
          // If the user is not registered, create a new user
          const userObject = {
            fullname: name,
            password: `${sub + process.env.CLIENT_PASS}`,
            email,
            image: picture,
            isVerified: email_verified,
            emailNotification: true,
            phone: `+234${sub}`,
            // Set other properties as needed from the Google profile
          };
          await USERS.create(userObject);
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
