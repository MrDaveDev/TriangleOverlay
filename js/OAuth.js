// Step 1: Redirect the user to the Twitch authorization page
function loginWithTwitch() {
    const clientId = 'mdvx1f5go1vufb6ilzl43eu4o67onp';
    const redirectUri = 'https://mrdavedev.github.io/TriangleOverlay/'; // e.g., http://localhost
    const responseType = 'token'; // You can use 'code' for Authorization Code flow, or 'token' for Implicit Flow
    const scope = 'user:read:email'; // This scope is needed to access the username.

    const url = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

    window.location.href = url; // Redirect to Twitch login page
}

// Step 2: Once the user authenticates, Twitch will redirect to your site with the token
function handleAuthRedirect() {
    const hash = window.location.hash.substring(1); // Remove the "#" from the URL
    const params = new URLSearchParams(hash);

    const accessToken = params.get('access_token');

    if (accessToken) {
        // Successfully authenticated, now we can fetch the user's info
        getUserInfo(accessToken);
    }
}

// Step 3: Fetch user information (e.g., username) using the access token
function getUserInfo(accessToken) {
    const url = 'https://api.twitch.tv/helix/users';

    fetch(url, {
        headers: {
            'Client-ID': 'mdvx1f5go1vufb6ilzl43eu4o67onp',
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then(response => response.json())
        .then(data => {
            const username = data.data[0].login; // Extract username from the response
            console.log('Authenticated as:', username);

            // Now send the username and selected hat to your Unity app (via your HTTP server)
            applyHatToCharacter(username, selectedHat);
        })
        .catch(error => console.error('Error fetching user info:', error));
}

// Call this function when the page loads
handleAuthRedirect();

function applyHatToCharacter(username, hat) {
    const data = {
        viewer: username,
        hat: hat
    };

    fetch('http://localhost:8080/', {  // Adjust the URL to your Unity app's listener URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data)
    })
        .then(response => response.text())
        .then(responseText => {
            console.log(responseText);
        })
        .catch(error => console.error('Error applying hat:', error));
}
