document.addEventListener("DOMContentLoaded", function () {
  const accessToken = localStorage.getItem("twitch_access_token");

  // Check if user is already authenticated
  if (!accessToken) {
    // Show the login button if the user is not authenticated
    document.getElementById("auth-button").addEventListener("click", authenticateWithTwitch);
  } else {
    console.log("User is authenticated with Twitch.");
    // Now you can make API calls with accessToken
    // You can now enable interactions with the extension that require Twitch authentication
  }
});

function authenticateWithTwitch() {
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
  // Send the selected hat choice to your server or Unity instance
}
