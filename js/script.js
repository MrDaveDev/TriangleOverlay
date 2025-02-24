<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Twitch Extension</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="container">
    <div class="tabs">
        <button class="tablinks" onclick="openTab(event, 'Hats')">Hats</button>
        <button class="tablinks" onclick="openTab(event, 'Face')">Face</button>
        <button class="tablinks" onclick="openTab(event, 'Body')">Body</button>
        <button class="tablinks" onclick="openTab(event, 'Color')">Color</button>
    </div>

    <div id="Hats" class="tabcontent">
        <h2>Select a Hat</h2>
        <div class="hat-options">
            <button class="hat-btn" onclick="selectHat('redbeanie')">
                <img src="assets/hat-icons/RedBeanie.png" alt="redbeanie">
            </button>
            <button class="hat-btn" onclick="selectHat('bluebeanie')">
                <img src="assets/hat-icons/BlueBeanie.png" alt="bluebeanie">
            </button>
            <button class="hat-btn" onclick="selectHat('greenbeanie')">
                <img src="assets/hat-icons/GreenBeanie.png" alt="greenbeanie">
            </button>
        </div>
    </div>

    <div id="Face" class="tabcontent">
        <h2>Select a Face</h2>
        <!-- Face options (coming soon) -->
    </div>

    <div id="Body" class="tabcontent">
        <h2>Select a Body</h2>
        <!-- Body options (coming soon) -->
    </div>

    <div id="Color" class="tabcontent">
        <h2>Select a Color</h2>
        <!-- Color options (coming soon) -->
    </div>

    <!-- Removed username section -->
    <div id="apply-section">
        <button onclick="applyHatToCharacter()">Apply Hat</button>
    </div>
</div>

<script src="js/script.js"></script>

<script>
    // Get the access token from localStorage (set in redirect.html)
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
        // Proceed with your API requests using the access token
        fetchUserData(accessToken);
    } else {
        // If no access token, show login button or error message
        console.log('Access token not found');
    }
</script>
</body>
</html>
