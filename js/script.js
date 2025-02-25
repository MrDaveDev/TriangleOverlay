var viewerName;

// Function to start Twitch login process
function twitchLogin() {
    const clientId = 'mdvx1f5go1vufb6ilzl43eu4o67onp'; // Replace with your Twitch Client ID
    const redirectUri = 'https://mrdavedev.github.io/TriangleOverlay/index.html'; // Replace with your redirect URI
    const scope = 'user:read:email'; // Adjust scope as needed
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    window.location.href = authUrl;
}

// Function to extract the code from the URL
function getCodeFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
}

// Function to exchange the code for an access token
async function exchangeCodeForToken(code) {
    const clientId = 'mdvx1f5go1vufb6ilzl43eu4o67onp'; // Replace with your Twitch Client ID
    const clientSecret = '08xyg88er6jucz38xr2viwbklo4a1z'; // Replace with your Twitch Client Secret
    const redirectUri = 'https://mrdavedev.github.io/TriangleOverlay/index.html'; // Ensure this matches the registered redirect URI

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('code', code);
    params.append('redirect_uri', redirectUri);
    params.append('grant_type', 'authorization_code');

    try {
        const response = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Access Token:', data.access_token);
            fetchUserInfo(data.access_token);
        } else {
            const errorData = await response.json();
            console.error('Error fetching token:', response.status, errorData); // Log the error data for more details
        }
    } catch (error) {
        console.error('Error:', error); // Log any other errors (network issues, etc.)
    }
}

// Fetch user info using the access token
async function fetchUserInfo(token) {
    try {
        const response = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Client-Id': 'mdvx1f5go1vufb6ilzl43eu4o67onp', // Replace with your Client ID
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log('User Info:', data);
            if (data.data && data.data.length > 0) {
                const user = data.data[0];
                viewerName = user.display_name;
                document.getElementById('twitch-login').innerText = `Logged in as ${user.display_name}`;
                document.getElementById('twitch-login').disabled = true; // Disable button after login
            }
        } else {
            console.error('Error fetching user info:', response.status, await response.text());
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// On page load, check if we have the code to exchange
window.onload = () => {
    const code = getCodeFromUrl();
    if (code) {
        exchangeCodeForToken(code);
    }
};

// Fetch user info from Twitch API
async function fetchUserInfo(accessToken) {
    const clientId = 'mdvx1f5go1vufb6ilzl43eu4o67onp'; // Replace with your actual client ID

    try {
        // Make a request to get user information
        const response = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
                'Authorization': `Bearer ${accessToken}`, // Include the access token
                'Client-Id': clientId,                    // Include your Client ID
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.data && data.data.length > 0) {
                const user = data.data[0];  // Twitch returns an array; we want the first user
                console.log('Username:', user.login); // Twitch username (login)
                console.log('Display Name:', user.display_name); // Display name
                console.log('User ID:', user.id); // User ID

                // Get the login button element
                const loginButton = document.getElementById('twitch-login');

                // Disable the button and change its text after login
                loginButton.innerText = `${user.display_name}`;
                loginButton.disabled = true;  // This disables the button
                loginButton.classList.add('disabled');  // Optional: Add a "disabled" class for extra styling (like opacity change)
            }
        } else {
            const errorData = await response.json();
            console.error('Error fetching user info:', response.status, errorData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function sendHatChangeRequest(hatName, viewerName) {
    const url = 'http://localhost:8080/';  // The Unity HTTP listener URL

    // Create the data to send
    const postData = `ChangeHat:${hatName}`;

    // Send the POST request
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: postData
    })
        .then(response => response.text())
        .then(data => {
            console.log("Received response from Unity: " + data);
        })
        .catch(error => {
            console.error("Error sending request:", error);
        });
}

// Example button click event to change the hat
document.getElementById('NoHat').onclick = () => sendHatChangeRequest('NoHat', viewerName);
document.getElementById('RedBeanie').onclick = () => sendHatChangeRequest('RedBeanie', viewerName);
document.getElementById('BlueBeanie').onclick = () => sendHatChangeRequest('BlueBeanie', viewerName);
document.getElementById('GreenBeanie').onclick = () => sendHatChangeRequest('GreenBeanie', viewerName);



