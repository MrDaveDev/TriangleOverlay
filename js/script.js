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

function selectHat(hatType) {
    console.log(`Selected hat: ${hatType}`);
    applyHatToCharacter();
    // Send the selected hat choice to your server or Unity instance
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
