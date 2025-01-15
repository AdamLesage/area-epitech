const { google } = require('googleapis');

async function initializeGmailClient(refreshToken) {

    // Initialize the OAuth2 client with your credentials
    const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );

    // Set the refresh token
    auth.setCredentials({ refresh_token: refreshToken });

    // Ensure the access token is fetched using the refresh token
    const { token } = await auth.getAccessToken();

    // Set the access token explicitly (optional, as `auth` will manage it)
    auth.setCredentials({ access_token: token });

    // Create the Gmail API client
    const gmail = google.gmail({ version: 'v1', auth });

    return gmail;
}

module.exports = { initializeGmailClient };