// Register user
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.text();
        document.getElementById('response').innerText = data;
    } catch (error) {
        console.error('Error:', error);
    }
});

// Login user and set token in cookies
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        
        if (response.ok) {
            document.cookie = `token=${data.token}; path=/; HttpOnly`; // Set token in cookies
            document.getElementById('response').innerText = 'Login successful!';
        } else {
            document.getElementById('response').innerText = 'Login failed: ' + data;
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Access dashboard
document.getElementById('dashboardBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('/dashboard', {
            method: 'GET',
            credentials: 'include' // Include cookies in the request
        });
        const data = await response.text();
        document.getElementById('response').innerText = data;
    } catch (error) {
        console.error('Error:', error);
    }
});