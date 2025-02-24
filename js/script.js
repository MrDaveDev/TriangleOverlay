document.addEventListener('DOMContentLoaded', () => {
    const clientId = "mdvx1f5go1vufb6ilzl43eu4o67onp";  // Replace with your Twitch client ID
    const redirectUri = "https://mrdavedev.github.io/TriangleOverlay/redirect.html";
    const storedToken = localStorage.getItem("access_token");

    if (!storedToken) {
        // No token found, initiate OAuth flow
        redirectToTwitchAuth();
    } else {
        console.log("User already authenticated.");
        fetchUserData(storedToken); // Fetch user data if already authenticated
    }
});

function redirectToTwitchAuth() {
    const clientId = "mdvx1f5go1vufb6ilzl43eu4o67onp";  // Replace with your Twitch client ID
    const redirectUri = "https://mrdavedev.github.io/TriangleOverlay/redirect.html";
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=user:read:email`;

    window.location.href = authUrl; // Redirect to Twitch for authentication
}

function fetchUserData(token) {
    fetch('https://api.twitch.tv/helix/users', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Client-Id': 'YOUR_TWITCH_CLIENT_ID'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log("User data:", data);
            if (data.data && data.data.length > 0) {
                const username = data.data[0].login;
                console.log(`Authenticated as ${username}`);
            }
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
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
