import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Inicializar Firebase Admin SDK si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'trading-brain-ai-app'
  });
}

const db = admin.firestore();

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }
    
    // Validar usuario
    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Token inválido' }, { status: 401 });
    }

    const userId = decodedToken.uid;

    // Actualizar usuario en Firestore a plan Free
    await db.collection('users').doc(userId).set({
      plan: 'Free',
      subscription_status: 'active',
      label: 'Free',
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return NextResponse.json({ success: true, message: 'Plan Free asignado exitosamente' });
  } catch (error) {
    console.error('Error asignando plan Free:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
