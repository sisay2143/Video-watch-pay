// admin.js
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with service account key
const serviceAccount = require('./miniproject-25ae5-firebase-adminsdk-ts8it-84bf2d13db.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
