const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

// Example user database (replace this with a proper database in a real application)
const users = {
    'user1': {
        username: 'user1',
        passwordHash: bcrypt.hashSync('password123', 10) // Hash the password during user creation
    }
};

// Login route with server-side input validation
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Server-side input validation
    if (!username || !password) {
        return res.status(400).send('Please provide both username and password');
    }

    console.log('Entered username:', username); // Debugging output

    const user = users[username];
    if (!user) {
        console.log('Login failed: User not found.'); // Debugging output
        return res.sendStatus(401);
    }

    const storedHash = user.passwordHash;

    // Compare provided password with stored hash
bcrypt.compare(password, storedHash, (err, result) => {
    if (err) {
        console.error('Error comparing passwords:', err);
        return res.sendStatus(500);
    }
    if (result) {
        // Passwords match, login successful
        req.session.username = username;
        console.log('Login successful.'); // Debugging output
        console.log('Hashed Password:', storedHash); // Log hashed password
        return res.sendStatus(200);
    } else {
        // Passwords don't match, login failed
        console.log('Login failed.'); // Debugging output
        return res.sendStatus(401);
    }
});

});


// Dashboard route
app.get('/dashboard', (req, res) => {
    if (req.session.username) {
        res.send(`Welcome, ${req.session.username}!`);
    } else {
        res.redirect('/');
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('An error occurred:', err);
    res.status(500).send('Something went wrong');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});