// Import Firebase Admin SDK
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin with your service account JSON
const serviceAccount = require('./pocoverse-44c45-firebase-adminsdk-fbsvc-8d39687999.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get Firestore instance
const db = admin.firestore();

// Telegram Web App initialization
const tg = window.Telegram.WebApp;

// Wait for the Web App to be ready
tg.ready();

// Get user information
const usernameElement = document.getElementById('username');
const errorElement = document.getElementById('error');

try {
  const user = tg.initDataUnsafe?.user || {};

  // Display user info
  if (user.username) {
    usernameElement.textContent = `Hello, @${user.username}!`;
  } else if (user.first_name) {
    usernameElement.textContent = `Hello, ${user.first_name}! You have no username set.`;
  } else {
    usernameElement.textContent = `Hello, User!`;
    errorElement.style.display = 'block';
    errorElement.textContent = 'User information is limited. Please open the app through Telegram.';
  }

  // Save user information to Firestore
  const userId = user.id || 'unknown_user';
  const userData = {
    userId: userId,
    username: user.username || null,
    firstName: user.first_name || null,
    lastName: user.last_name || null,
    timestamp: new Date().toISOString()
  };

  // Add user data to Firestore
  db.collection('users').doc(userId.toString()).set(userData)
    .then(() => {
      console.log("User data saved to Firestore successfully.");
    })
    .catch((error) => {
      console.error("Error saving user data to Firestore:", error);
    });

} catch (error) {
  console.error('Error fetching user info:', error);
  usernameElement.textContent = 'An error occurred while fetching user info.';
  errorElement.style.display = 'block';
  errorElement.textContent = 'Failed to retrieve user information.';
}

// Function to close the Web App
function closeWebApp() {
  tg.close();
}



