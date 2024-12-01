const passport = require('passport');
require('dotenv').config();

// Google strategy

const GoogleStrategy = require('passport-google-oauth20').Strategy;

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


// Github strategy

const GitHubStrategy = require('passport-github2').Strategy;

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/github/redirect',
            scope: ['user:email'], // Demander l'accès à l'email
        },
        async (accessToken, refreshToken, profile, done) => {
            // console.log('GitHub Profile:', profile);
            // GitHub n'inclut pas toujours l'email par défaut, il faut le chercher dans profile.emails
            const email = profile.emails?.[0]?.value || null;
            done(null, { ...profile, accessToken, email });
        }
    )
);
