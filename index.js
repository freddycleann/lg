const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const authenticateToken = require('./authMiddleware');
require('dotenv').config();

const { sequelize } = require('./models/User');

sequelize.sync()
    .then(() => console.log('Database synced'))
    .catch((err) => console.error('Failed to sync database:', err));

const app = express();

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/auth', authRoutes);

// Home route
app.get('/', (req, res) => {
    res.render('index'); // Render the home page (index.ejs)
});

// Register route (GET) - renders the register form
app.get('/register', (req, res) => {
    res.render('register');
});

// Login route (GET) - renders the login form
app.get('/login', (req, res) => {
    res.render('login');
});

// Dashboard route (protected by authentication middleware)
app.get('/dashboard', authenticateToken, (req, res) => {
    res.render('dashboard', { userId: req.user.userId, username: req.user.username }); // Render dashboard with user ID
});

// Tools route
app.get('/tools', (req, res) => {
    res.render('tools'); // Render tools.ejs
});

// About route
app.get('/about', (req, res) => {
    res.render('about'); // Render about.ejs
});

// Contact route
app.get('/contact', (req, res) => {
    res.render('contact'); // Render contact.ejs
});

// Logout route
app.get('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the authentication token (or session data if you're using sessions)
    res.redirect('/login'); // Redirect to the login page
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ${PORT}'))