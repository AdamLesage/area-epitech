const passport = require('passport');
require('dotenv').config();

// Google strategy

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/auth/google/redirect`,
        },

        function (accessToken, refreshToken, profile, done) {
            // User find or create to db
            // console.log('Profile:', profile);
            // console.log('Access token:', accessToken);
            // console.log('Refresh token:', refreshToken);
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
            callbackURL: `${process.env.BACKEND_URL}/auth/github/redirect`,
            scope: ['user:email', 'repo']
        },
        async (accessToken, refreshToken, profile, done) => {
            const sessionEmail = passport.session.email;
            const profileEmail = profile.emails?.[0]?.value || null;

            console.log('session:', sessionEmail, 'profile:', profileEmail);

            const user = { 
                ...profile,
                accessToken,
                sessionEmail: sessionEmail,
                accountEmail: profileEmail
            };
            done(null, user);
        }
    )
);

// Dropbox strategy
const DropboxStrategy = require('passport-dropbox-oauth2').Strategy;

passport.use(new DropboxStrategy({
    apiVersion: '2',
    clientID: process.env.DROPBOX_APP_KEY,
    clientSecret: process.env.DROPBOX_APP_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/dropbox/callback`,
    scope: "account_info.read account_info.write files.metadata.write files.metadata.read files.content.write files.content.read sharing.write sharing.read file_requests.write file_requests.read contacts.write contacts.read"
  },
  function(token, tokenSecret, profile, cb) {
    console.log("Dropbox Callback");

    const email = profile.emails?.[0]?.value || null;
    const displayName = profile.displayName || '';
    const username = profile.username || 'Username not found';

    // Pass token, tokenSecret, and derived properties into the callback
    cb(null, { 
        ...profile, 
        token, 
        tokenSecret, 
        email, 
        displayName, 
        username 
    });
  }
));

const SpotifyStrategy = require('passport-spotify').Strategy;

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/spotify/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
        const sessionEmail = passport.session.email;
        const profileEmail = profile.emails?.[0]?.value || null;

        console.log('session:', sessionEmail, 'profile:', profileEmail);

        const user = { 
            ...profile,
            accessToken,
            sessionEmail: sessionEmail,
            accountEmail: profileEmail
        };
        done(null, user);
    }
  )
);