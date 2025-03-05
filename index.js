// Import the Express module
const express = require('express');

// Create an instance of an Express app
const app = express();

// Set the port for the server
const PORT = process.env.PORT || 3000;

// Define a simple route for testing
app.get('/status', (req, res) => {
    res.send("Service is running");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});