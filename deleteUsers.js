const admin = require('firebase-admin');
const serviceAccount = require('./sa-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function deleteAllUsers() {
  const listUsersResult = await admin.auth().listUsers(1000);
  for (const userRecord of listUsersResult.users) {
    console.log(`Deleting user: ${userRecord.email}`);
    await admin.auth().deleteUser(userRecord.uid);
    // Also delete from firestore
    await admin.firestore().collection('users').doc(userRecord.uid).delete();
  }
  console.log('All users deleted.');
  process.exit();
}

deleteAllUsers().catch(console.error);
