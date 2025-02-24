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
                console.log("Successfully authenticated! Username:", username);
                document.getElementById("username-section").innerHTML = `<p>Logged in as <strong>${username}</strong></p>`;
            } else {
                console.error("Failed to retrieve Twitch user data.");
            }
        })
        .catch(error => console.error("Error fetching Twitch user data:", error));
}

function openTab(evt, tabName) {
    let i, tabcontent, tablinks;

    // Hide all tab contents
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove active class from all tab buttons
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the selected tab and mark it as active
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Set default tab to "Hats" on page load
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".tablinks").click();
});
