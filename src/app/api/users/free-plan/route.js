import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';

// Inicializar Firebase Admin SDK si no está inicializado


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

    // Actualizar usuario en Firestore a plan Starter
    await db.collection('users').doc(userId).set({
      plan: 'Starter',
      subscription_status: 'active',
      label: 'Starter',
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return NextResponse.json({ success: true, message: 'Plan Starter asignado exitosamente' });
  } catch (error) {
    console.error('Error asignando plan Starter:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
