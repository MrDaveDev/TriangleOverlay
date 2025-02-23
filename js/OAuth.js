const clientId = 'mdvx1f5go1vufb6ilzl43eu4o67onp';
const clientSecret = '7ceixtxr6mcr7h0kqvhnn3skneczps';
const redirectUri = 'https://mrdavedev.github.io/TriangleOverlay/'; // Match this with your Twitch App's redirect URI
const authorizationUrl = 'https://id.twitch.tv/oauth2/authorize';
const tokenUrl = 'https://id.twitch.tv/oauth2/token';

function startOAuthFlow() {
    // Construct the Twitch OAuth authorization URL
    const authUrl = `${authorizationUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=user:read:email`;

    // Redirect the user to Twitch's OAuth authorization page
    window.location.href = authUrl;
}

function exchangeCodeForAccessToken(code) {
    // Send the authorization code to Twitch to exchange it for an access token
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', redirectUri);

    fetch(tokenUrl, {
        method: 'POST',
        body: params
    })
        .then(response => response.json())
        .then(data => {
            console.log("Access Token Data: ", data);

            if (data.access_token) {
                // Store the access token in local storage or use it directly
                localStorage.setItem('twitch_access_token', data.access_token);

                // Call function to get the user's Twitch data (username, etc.)
                getUserData(data.access_token);
            } else {
                console.error('No access token received.');
            }
        })
        .catch(error => {
            console.error('Error exchanging code for token:', error);
        });
}

function getUserData(accessToken) {
    // Use the access token to get user data from Twitch API
    fetch('https://api.twitch.tv/helix/users', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Client-Id': clientId
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log("Twitch User Data:", data);

            // Now that we have the user's Twitch data, use it to apply the hat to the right character
            const username = data.data[0].login; // Twitch username

            // Pass the username to your Unity app (or backend) to apply the correct hat
            applyHatToCharacter(username);
        })
        .catch(error => {
            console.error('Error fetching user data from Twitch:', error);
        });
}

function applyHatToCharacter(username) {
    // You can now send this username to your Unity app or backend to apply the hat.
    // This could be done via an HTTP request or WebSocket, depending on your backend.
    console.log("Applying hat to character:", username);

    // For example, you can send a request to your Unity app like this:
    // fetch('http://localhost:8080/hat', { method: 'POST', body: JSON.stringify({ viewer: username, hat: 'red' }) });
}

// Check if there's an authorization code in the URL (from the redirect)
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        console.log("OAuth code received: ", code);
        // Now exchange the code for the access token
        exchangeCodeForAccessToken(code);
    } else {
        // If there's no code, start the OAuth flow (e.g., via a login button)
        startOAuthFlow();
    }
};
