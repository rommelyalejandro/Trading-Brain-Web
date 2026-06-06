import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

if (!admin.apps.length) {
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
}

const db = admin.firestore();

export async function GET(req) {
  try {
    const apiKey = req.headers.get('x-api-key') || req.headers.get('X-API-Key');
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'API Key missing' }, { status: 401 });
    }

    // Buscar el usuario con esta API Key
    const snapshot = await db.collection('users').where('api_key', '==', apiKey).limit(1).get();
    
    if (snapshot.empty) {
      return NextResponse.json({ success: false, error: 'Invalid API Key' }, { status: 403 });
    }

    const userData = snapshot.docs[0].data();
    const currentPlan = userData.plan || 'Free';

    // Retornar éxito junto con el plan del usuario
    return NextResponse.json({ 
      success: true, 
      plan: currentPlan,
      label: userData.label || currentPlan
    });

  } catch (error) {
    console.error('Error validating API Key in stats:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
