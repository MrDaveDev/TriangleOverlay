function showTab(tabName) {
    // Hide all tab content
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
}

function applyHat(hat) {
    const username = document.getElementById('username-input').value;

    if (username === '') {
        alert('Please enter your username!');
        return;
    }

    // Send the selected hat and username to the server
    const data = {
        viewer: username,
        hat: hat
    };

    fetch('http://localhost:8080/hat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `viewer=${data.viewer}&hat=${data.hat}`
    })
    .then(response => response.text())
    .then(data => console.log('Server Response: ', data))
    .catch(error => console.error('Error:', error));
}
