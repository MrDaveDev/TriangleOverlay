// Function to switch tabs
function openTab(evt, tabId) {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));

    evt.currentTarget.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// Twitch login flow
let viewerName = null;

function twitchLogin() {
    const clientId = 'mdvx1f5go1vufb6ilzl43eu4a67onp';
    const redirectUri = 'https://mrdavedev.github.io/TriangleOverlay/index.html';
    const scope = 'user:read:email';
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    window.location.href = authUrl;
}

function getCodeFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
}

async function exchangeCodeForToken(code) {
    const clientId = 'mdvx1f5go1vufb6ilzl43eu4a67onp';
    const clientSecret = '08xyg88er6jucz38xr2viwbklo4a1z';
    const redirectUri = 'https://mrdavedev.github.io/TriangleOverlay/index.html';

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
            body: params
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Access Token:', data.access_token);
            fetchUserInfo(data.access_token);
        } else {
            console.error('Error fetching token:', response.status, await response.text());
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchUserInfo(token) {
    try {
        const response = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Client-Id': 'mdvx1f5go1vufb6ilzl43eu4a67onp'
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.data && data.data.length > 0) {
                const user = data.data[0];
                viewerName = user.display_name;
                document.getElementById('twitch-login').innerText = `${user.display_name}`;
                document.getElementById('twitch-login').disabled = true;
            }
        } else {
            console.error('Error fetching user info:', response.status, await response.text());
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

window.onload = () => {
    const code = getCodeFromUrl();
    if (code) {
        exchangeCodeForToken(code);
    }
    updateColorPreview(); // Initialize preview on load
};

// Hat buttons
document.getElementById('NoHat').onclick = () => sendHatChangeRequest('NoHat');
document.getElementById('RedBeanie').onclick = () => sendHatChangeRequest('RedBeanie');
document.getElementById('BlueBeanie').onclick = () => sendHatChangeRequest('BlueBeanie');
document.getElementById('GreenBeanie').onclick = () => sendHatChangeRequest('GreenBeanie');

function sendHatChangeRequest(hatName) {
    if (!viewerName) {
        console.error('Viewer name is not available');
        return;
    }

    const url = 'http://localhost:8080/';
    const postData = `hatName:${hatName}&viewerName:${viewerName}`;

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

// Color slider logic
const red = document.getElementById('red');
const green = document.getElementById('green');
const blue = document.getElementById('blue');
const preview = document.getElementById('color-preview');

function updateColorPreview() {
    const r = red.value;
    const g = green.value;
    const b = blue.value;
    preview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    print(`rgb(${r}, ${g}, ${b})`);
    sendColorChangeRequest('rgb(${r}, ${g}, ${b})');
}

red.addEventListener('input', updateColorPreview);
green.addEventListener('input', updateColorPreview);
blue.addEventListener('input', updateColorPreview);

function sendColorChangeRequest(color) {
    if (!viewerName) {
        console.error('Viewer name is not available');
        return;
    }

    const url = 'http://localhost:8080/';
    const postData = `color:${hatName}&viewerName:${viewerName}`;

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
