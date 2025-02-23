// Function to switch between tabs
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    // Hide all tab content
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the active class from all buttons
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the selected tab and add the active class to the clicked button
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Function to handle hat selection and send to Unity
function selectHat(hatColor) {
    console.log(`Hat selected: ${hatColor}`);

    // Send this information to the Unity app
    fetch('http://localhost:8080/hat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            viewer: 'MrDaveDev',
            hat: hatColor
        })
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

// Set default tab to display
document.addEventListener("DOMContentLoaded", function() {
    // Open the Hats tab by default
    document.querySelector(".tablinks").click();
});
