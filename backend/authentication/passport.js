const passport = require('passport');
require('dotenv').config();

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
    function (accessToken, tokenSecret, profile, done) {
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

const DiscordStrategy = require('passport-discord').Strategy;

passport.use(
    new DiscordStrategy(
        {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/auth/discord/callback`,
        scope: ['identify', 'email', 'guilds']
        },
        async (accessToken, refreshToken, profile, done) => {
            const sessionEmail = passport.session.email;
            const profileEmail = profile.email || null;

            console.log('session:', sessionEmail, 'profile:', profile);
            console.log('accessToken:', accessToken);
            console.log('session:', sessionEmail, 'profile:', profileEmail);
    
            const user = {
                ...profile,
                accessToken,
                sessionEmail: sessionEmail,
                accountEmail: profileEmail
            };
            done(null, user);
        }
));

// Spotify strategy
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

// Google strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    const sessionEmail = passport.session.email;
    const profileEmail = profile.emails?.[0]?.value || null;

    console.log('session:', sessionEmail, 'profile:', profileEmail);
    console.log("RefreshToken: ",refreshToken)
    const user = { 
        ...profile,
        refreshToken,
        sessionEmail: sessionEmail,
        accountEmail: profileEmail
    };
    return done(null, user);
}));

