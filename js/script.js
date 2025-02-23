// Twitch OAuth URLs
const clientId = 'mdvx1f5go1vufb6ilzl43eu4o67onp';  // Get this from the Twitch Developer Console
const redirectUri = 'https://mrdavedev.github.io/TriangleOverlay/redirect.html';  // Replace with your redirect URL
const responseType = 'token';  // We want the token for authorization

// Start OAuth login flow
function loginToTwitch() {
    const oauthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=user:read:email`;
    window.location.href = oauthUrl;
}

// Get the Twitch username from the URL fragment after successful OAuth
function getUsernameFromUrl() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    return accessToken;
}

// Check if the user is logged in (you can call this on page load or whenever you need)
function checkUserLogin() {
    const accessToken = getUsernameFromUrl();
    if (accessToken) {
        fetchUserData(accessToken);
    } else {
        // Ask the user to log in
        loginToTwitch();
    }
}

// Fetch user data from Twitch using the access token
async function fetchUserData(accessToken) {
    const res = await fetch(`https://api.twitch.tv/helix/users`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Client-ID': clientId
        }
    });

    const user = await res.json();
    const username = user.data[0].login;  // The username
    console.log('Logged in as: ' + username);

    // Once you have the username, you can store it or pass it to your backend
    // For example, send the username to your Unity app
    sendUsernameToBackend(username);
}

function sendUsernameToBackend(username) {
    // Send the username to the backend to associate the user with their character
    // Example of sending it to the server:
    fetch('http://localhost:8080/username', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Username sent to backend');
        })
        .catch(error => console.error('Error sending username to backend:', error));
}

checkUserLogin();



// Function to open and show the correct tab content
function openTab(evt, tabName) {
    // Hide all tab content
    let tabcontents = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontents.length; i++) {
        tabcontents[i].classList.remove('active');
    }

    // Show the clicked tab content
    let tablinks = document.getElementsByClassName('tablinks');
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove('active');
    }

    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// Function to mark the selected hat and add "selected" class
function selectHat(hatColor) {
    // Remove the "selected" class from all hat buttons
    let allHatButtons = document.querySelectorAll('.hat-btn');
    allHatButtons.forEach(button => {
        button.classList.remove('selected');
    });

    // Find the clicked hat button and add "selected" class
    let selectedHatButton = document.querySelector(`button[onclick="selectHat('${hatColor}')"]`);
    selectedHatButton.classList.add('selected');

    console.log(`Hat selected: ${hatColor}`);
}

// Function to apply the hat to the character (based on username)
function applyHatToCharacter() {
    const username = document.getElementById('username').value;
    const selectedHat = document.querySelector('.hat-btn.selected');

    if (username && selectedHat) {
        // Get the hat color from the selected button (either from data attribute or alt text)
        const hatColor = selectedHat.getAttribute('data-hat-color') || selectedHat.querySelector('img').alt;

        console.log(`Selected hat color: ${hatColor}`); // Log for debugging

        // Validating hat color before sending
        const validHatColors = ['redbeanie', 'bluebeanie', 'greenbeanie'];
        if (!validHatColors.includes(hatColor)) {
            alert('Invalid hat selection!');
            console.log('Invalid hat selected:', hatColor); // Log invalid selection
            return;
        }

        console.log(`Applying ${hatColor} to ${username}`);

        // Send the hat data to Unity
        fetch('http://localhost:8080/hat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `viewer=${username}&hat=${hatColor}`,
        })
            .then(response => response.text())
            .then(data => {
                console.log('Server Response:', data);
            })
            .catch(error => console.error('Error:', error));
    } else {
        alert('Please enter a username and select a hat!');
    }
}

