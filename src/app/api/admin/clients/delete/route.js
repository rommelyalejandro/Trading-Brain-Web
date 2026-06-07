import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';

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

export async function DELETE(request) {
  try {
    await verifyAdmin(request);
    
    // Parse the userId from the URL query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Missing userId' }, { status: 400 });
    }

    // 1. Delete from Firestore users collection
    await db.collection('users').doc(userId).delete();
    
    // 2. We can't delete the Firebase Auth user easily without the admin auth SDK having full privileges,
    // but deleting their Firestore document invalidates their API key and telemetry access.
    // However, since we are using Firebase Admin SDK, we CAN delete their Auth account!
    try {
      await admin.auth().deleteUser(userId);
    } catch (authError) {
      console.warn("Could not delete from Auth (might not exist):", authError.message);
    }

    return NextResponse.json({ success: true, message: 'User deleted permanently.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}
