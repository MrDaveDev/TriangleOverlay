function twitchLogin() {
    const clientId = 'mdvx1f5go1vufb6ilzl43eu4o67onp'; // Replace with your Twitch Client ID
    const redirectUri = 'https://mrdavedev.github.io/TriangleOverlay/index.html'; // Replace with your redirect URI
    const scope = 'user:read:email'; // Adjust scope as needed

    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=https://mrdavedev.github.io/TriangleOverlay/index.html&response_type=code&scope=openid`;

    window.location.href = authUrl;
}

// Function to extract access token from URL
function getAccessToken() {
    const hash = window.location.hash;
    if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        if (accessToken) {
            fetchUserInfo(accessToken);
        }
    }
}

// Fetch user info from Twitch API
function fetchUserInfo(token) {
    fetch('https://api.twitch.tv/helix/users', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Client-Id': 'mdvx1f5go1vufb6ilzl43eu4o67onp'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.length > 0) {
                const user = data.data[0];
                document.getElementById('twitch-login').innerText = `Logged in as ${user.display_name}`;
                document.getElementById('twitch-login').disabled = true; // Disable button after login
            }
        })
        .catch(error => console.error('Error fetching user info:', error));
}

// Check if we have an access token on page load
window.onload = getAccessToken;
