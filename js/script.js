const clientId = 'mdvx1f5go1vufb6ilzl43eu4o67onp';  // Replace with your actual client ID
const clientSecret = '7ceixtxr6mcr7h0kqvhnn3skneczps';  // Replace with your actual client secret
const redirectUri = 'https://mrdavedev.github.io/TriangleOverlay/redirect.html'; // Make sure this matches your redirect URI
let userName = ''; // Variable to store the Twitch username

// Function to start the OAuth login
function startOAuthLogin() {
    console.log('Starting OAuth login...');
    const url = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=user:read:email`;
    window.location.href = url; // Redirect to Twitch login page
}

// Check for the OAuth token in the URL after redirect
function checkForToken() {
    const hash = window.location.hash.substring(1);  // Get everything after the "#"
    const params = new URLSearchParams(hash);         // Parse the hash part of the URL
    const accessToken = params.get('access_token');  // Extract the access_token parameter

    if (accessToken) {
        console.log("Access Token:", accessToken);  // Log the access token for debugging
        fetchUserData(accessToken);  // Proceed with fetching user data
    } else {
        console.error("No access token found");
    }
}

// Fetch user data from Twitch API
function fetchUserData(accessToken) {
    fetch('https://api.twitch.tv/helix/users', {
        method: 'GET',
        headers: {
            'Client-ID': 'your-client-id',                   // Use your Twitch Client ID
            'Authorization': `Bearer ${accessToken}`,        // Use the OAuth Access Token
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.length > 0) {
                const username = data.data[0].login;  // Get the username from the response
                console.log("Twitch Username:", username);
                // Proceed with the rest of your logic using the username
            } else {
                console.error("Failed to fetch user data:", data);
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}


// Function to apply the hat to the correct character
function applyHatToCharacter() {
    if (userName) {
        // Send a request to your server or Unity app to apply the selected hat for the user
        console.log(`Applying hat for user: ${userName}`);
        // Example: You can send an HTTP request to your server here
    } else {
        console.log('User is not logged in');
    }
}

// Initialize OAuth login if user is not logged in
if (!userName) {
    startOAuthLogin(); // This should trigger the redirect to Twitch
}

// If we're at the redirect URI, check for token
if (window.location.pathname === '/redirect.html') {
    checkForToken();  // This will check the hash for the access token
}
