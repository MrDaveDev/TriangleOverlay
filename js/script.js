const clientId = 'mdvx1f5go1vufb6ilzl43eu4o67onp';  // Replace with your Twitch client ID
const clientSecret = '7ceixtxr6mcr7h0kqvhnn3skneczps';  // Replace with your Twitch client secret
const redirectUri = 'https://mrdavedev.github.io/TriangleOverlay/redirect.html';  // The same redirect URI you used in Twitch dev console

// Function to get the access token using the code returned from Twitch
function getAccessToken(code) {
    const body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
    });

    fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        body: body,
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.access_token) {
                console.log('Access Token:', data.access_token);
                // Save the access token for future API requests
                localStorage.setItem('access_token', data.access_token);
                // After getting the access token, fetch the user's details
                fetchUserData(data.access_token);
            } else {
                console.error('Failed to get access token:', data);
            }
        })
        .catch((error) => {
            console.error('Error during token exchange:', error);
        });
}

// Function to fetch user data using the access token
function fetchUserData(accessToken) {
    fetch('https://api.twitch.tv/helix/users', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Client-Id': clientId,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.data && data.data.length > 0) {
                const user = data.data[0];
                const username = user.login;  // Twitch username
                console.log('Twitch User:', user);
                console.log('User’s Username:', username);

                // Store the username for applying the hat later
                localStorage.setItem('twitch_username', username);
                // Show the tab for selecting a hat now that the username is set
                showHatTab(username);
            } else {
                console.error('No user data returned');
            }
        })
        .catch((error) => {
            console.error('Error fetching user info:', error);
        });
}

// Function to show the hat selection tab after authentication
function showHatTab(username) {
    document.getElementById('username').textContent = `Hello, ${username}! Select your Hat`;
    document.getElementById('hat-selection').style.display = 'block';  // Show the hat selection section
}

// Function to handle hat selection
function selectHat(hatColor) {
    const username = localStorage.getItem('twitch_username');
    if (!username) {
        alert('User not authenticated');
        return;
    }

    // Send a POST request to the Unity app to apply the selected hat
    fetch('http://localhost:8080/hat', {  // Make sure the Unity server is running and CORS is enabled
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            viewer: username,  // Use the Twitch username
            hat: hatColor,     // Send the selected hat color
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Hat applied:', data);
            alert('Hat applied successfully!');
        })
        .catch((error) => {
            console.error('Error applying hat:', error);
            alert('Failed to apply hat.');
        });
}

// Function to handle the Twitch login flow
function startTwitchLogin() {
    const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=user:read:email`;
    window.location.href = twitchAuthUrl;
}

// Check if there's a code in the URL (this happens after Twitch redirects back)
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

if (code) {
    // If a code is present in the URL, exchange it for an access token
    getAccessToken(code);
}

// Event listener for starting the login
document.getElementById('login-btn').addEventListener('click', startTwitchLogin);
