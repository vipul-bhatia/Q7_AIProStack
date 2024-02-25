function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Client-side input validation
    if (!username || !password) {
        document.getElementById('error-message').innerText = 'Please enter both username and password';
        return;
    }

    // Send login credentials to the server
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: username, password: password})
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/dashboard';
        } else {
            document.getElementById('error-message').innerText = 'Invalid username or password';
        }
    });
}
