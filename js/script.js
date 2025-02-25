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
