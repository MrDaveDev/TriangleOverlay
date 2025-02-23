// OAuth configuration
const clientId = 'mdvx1f5go1vufb6ilzl43eu4o67onp'; // Replace with your Twitch Client ID
const redirectUri = 'https://mrdavedev.github.io/TriangleOverlay/'; // Your GitHub Pages URL

// Step 1: Redirect to Twitch for OAuth login
function redirectToTwitchOAuth() {
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=user:read:email`;
    window.location.href = authUrl; // Redirect to Twitch OAuth login
}

// Step 2: Extract the access token from the URL when redirected back to the page
function getAccessToken() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');  // Extract the access_token from the URL
    console.log("Access Token:", token);  // Log it for debugging
    return token;
}

// Step 3: Fetch user data from Twitch API using the access token
function fetchUserData(accessToken) {
    return fetch('https://api.twitch.tv/helix/users', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Client-Id': clientId
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.length > 0) {
                const username = data.data[0].login;
                console.log("Username:", username);  // Log username for debugging
                return username;
            } else {
                throw new Error("User data not found.");
            }
        })
        .catch(err => {
            console.error('Error fetching user data:', err);
            return null;
        });
}

// Step 4: Send the username and hat choice to your Unity app
function sendUsernameToUnity(username, hatChoice) {
    const unityServerUrl = 'http://localhost:8080/hat'; // Unity app's server URL

    fetch(unityServerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `viewer=${username}&hat=${hatChoice}`  // Send the username and selected hat
    })
        .then(response => response.text())
        .then(data => {
            console.log('Unity response:', data);
        })
        .catch(err => {
            console.error('Error sending data to Unity:', err);
        });
}

// Step 5: Main function to handle the OAuth flow
function handleOAuthFlow() {
    const accessToken = getAccessToken();

    if (accessToken) {
        // If the access token is available, fetch the username from Twitch
        fetchUserData(accessToken)
            .then(username => {
                if (username) {
                    // Apply the hat selection to the Unity app (you can customize the hat choice here)
                    const hatChoice = 'red';  // Replace with the hat selected by the user
                    sendUsernameToUnity(username, hatChoice);
                }
            })
            .catch(err => {
                console.error('Error processing OAuth flow:', err);
            });
    } else {
        console.log("No access token found in URL. Redirecting to Twitch OAuth...");
        redirectToTwitchOAuth();  // If there's no access token, start the OAuth flow
    }
}

// Run the OAuth flow when the page loads
window.onload = handleOAuthFlow;
