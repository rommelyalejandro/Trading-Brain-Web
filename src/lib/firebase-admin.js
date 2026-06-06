import admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
      projectId: 'trading-brain-ai-app'
    });
  } else {
    try {
      const keyPath = path.resolve(process.cwd(), 'sa-key.json');
      if (fs.existsSync(keyPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: 'trading-brain-ai-app'
        });
      } else {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId: 'trading-brain-ai-app'
        });
      }
    } catch (e) {
      console.warn('Could not initialize Firebase Admin SDK from sa-key.json', e);
    }
  }
}

const db = admin.firestore();
export { admin, db };
