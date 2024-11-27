const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

require('dotenv').config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `http://localhost:3000/auth/google/redirect`,
        },

        function (accessToken, refreshToken, profile, done) {
            // User find or create to db 
            console.log('Profile:', profile);
            console.log('Access token:', accessToken);
            console.log('Refresh token:', refreshToken);
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
}); 
