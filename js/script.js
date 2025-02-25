var viewerName = '';

document.addEventListener("DOMContentLoaded", function () {
    const accessToken = localStorage.getItem("twitch_access_token");

    // Check if user is already authenticated
    if (!accessToken) {
        // Show the login button if the user is not authenticated
        const authButton = document.getElementById("auth-button");
        authButton.addEventListener("click", authenticateWithTwitch);
    } else {
        console.log("User is authenticated with Twitch.");
        // Now you can make API calls with accessToken
        // You can now enable interactions with the extension that require Twitch authentication
    }
});

function authenticateWithTwitch() {
    console.log("Login button clicked."); // Debugging line
    const clientId = "mdvx1f5go1vufb6ilzl43eu4o67onp";
    const redirectUri = "https://mrdavedev.github.io/TriangleOverlay/redirect.html"; // Change this to your redirect URI
    const scope = "user:read:email"; // Scopes you need
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;

    // Open authentication in a new tab
    window.open(authUrl, "_blank");
}

function getViewerName(accessToken) {
    // Make a request to the Twitch API to get user info
    fetch('https://api.twitch.tv/helix/users', {
        method: 'GET',
        headers: {
            'Client-ID': 'mdvx1f5go1vufb6ilzl43eu4o67onp',
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then(response => response.json())
        .then(data => {
            viewerName = data.data[0].login; // Extract the username
            console.log("Authenticated user:", viewerName);

            // You can now use `viewerName` as needed
            // You may want to store it in localStorage or use it directly in your extension
            localStorage.setItem("viewer_name", viewerName);
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
        });
}

function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

var selectedHat = '';

function selectHat(hatType) {
    const viewerName = localStorage.getItem("viewer_name");

    if (!viewerName) {
        console.error("Error: No username found. Ensure user is authenticated.");
        return;
    }

    console.log(`Sending hat selection: ${hatType} for ${viewerName}`);

    fetch("http://localhost:8080/hat", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            username: viewerName,
            hat: hatType
        })
    })
        .then(response => response.text())
        .then(data => console.log("Server Response:", data))
        .catch(error => console.error("Error sending hat selection:", error));

    applyHatToCharacter();
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
