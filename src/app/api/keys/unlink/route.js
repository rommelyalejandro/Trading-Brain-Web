import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';

// Función auxiliar para verificar el token de Firebase
async function verifyUser(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No authorization token provided');
  }
  const idToken = authHeader.split('Bearer ')[1];
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  return decodedToken;
}

export async function POST(request) {
  try {
    const user = await verifyUser(request);
    
    // Buscar en Firestore el documento del usuario
    const userRef = db.collection('users').doc(user.uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ success: false, error: 'User not found in database' }, { status: 404 });
    }

    // Actualizar el documento para borrar el locked_instance_id
    await userRef.update({
      locked_instance_id: admin.firestore.FieldValue.delete()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Dispositivo desvinculado exitosamente. Ahora puedes usar tu Licencia en una nueva computadora.' 
    });

  } catch (error) {
    console.error('Error unlinking device:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}
