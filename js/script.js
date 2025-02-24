document.addEventListener('DOMContentLoaded', () => {
    const clientId = "mdvx1f5go1vufb6ilzl43eu4o67onp";  // Replace with your Twitch client ID
    const redirectUri = "https://mrdavedev.github.io/TriangleOverlay/redirect.html";
    const storedToken = localStorage.getItem("access_token");

    var viewerName = '';

    if (!storedToken) {
        // No token found, initiate OAuth flow
        redirectToTwitchAuth();
    } else {
        console.log("User already authenticated.");
        fetchUserData(storedToken); // Fetch user data if already authenticated
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const accessToken = localStorage.getItem("twitch_access_token");

    if (!accessToken) {
        document.getElementById("auth-button").addEventListener("click", authenticateWithTwitch);
    } else {
        console.log("User is authenticated with Twitch");
        // Now you can make API calls with accessToken
    }
});


function redirectToTwitchAuth() {
    const clientId = "mdvx1f5go1vufb6ilzl43eu4o67onp";
    const redirectUri = "https://mrdavedev.github.io/TriangleOverlay/redirect.html";
    const scope = "user:read:email"; // Add required scopes
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;

    // Open in a new tab
    window.open(authUrl, "_blank");
}

function fetchUserData(token) {
    const accessToken = localStorage.getItem("access_token");

    fetch('https://api.twitch.tv/helix/users', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Client-Id': 'mdvx1f5go1vufb6ilzl43eu4o67onp'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log("Twitch API Response:", data);

            if (data.data && data.data.length > 0) {
                const username = data.data[0].login;
                viewerName = data.data[0].login;
                console.log("Successfully authenticated! Username:", username);
                document.getElementById("username-section").innerHTML = `<p>Logged in as <strong>${username}</strong></p>`;
            } else {
                console.error("Failed to retrieve Twitch user data.");
            }
        })
        .catch(error => console.error("Error fetching Twitch user data:", error));
}

// Function to open tabs
function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
    }

    const tabLinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Select a hat and store the selection
function selectHat(hat) {
    selectedHat = hat;
    console.log(`Hat selected: ${selectedHat}`);
}

// Apply the selected hat to the character
function applyHatToCharacter() {
    const formData = new URLSearchParams();
    formData.append("username", viewerName);
    formData.append("hat", selectedHat);

    fetch("http://localhost:8080/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
    })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));
}

// Default action to display Hats tab
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".tablinks").click();
});
