import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';

// Función auxiliar para verificar el token de Firebase y asegurar que es el admin
async function verifyAdmin(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No authorization token provided');
  }
  const idToken = authHeader.split('Bearer ')[1];
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  
  if (decodedToken.email !== 'rommelyalejandro@gmail.com') {
    throw new Error('Unauthorized Access. Admin only.');
  }
  
  return decodedToken;
}

export async function GET(request) {
  try {
    await verifyAdmin(request);
    
    const usersSnapshot = await db.collection('users').get();
    
    const users = [];
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      users.push({
        id: doc.id,
        email: data.email || 'No email',
        name: data.name || 'Anonymous',
        plan: data.plan || 'Free',
        api_key: data.api_key || 'No Key Generated',
        status: data.status || 'Active', // Active or Inactive
        created_at: data.created_at ? data.created_at.toDate() : null
      });
    });
    
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}
