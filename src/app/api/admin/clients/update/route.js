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

export async function POST(request) {
  try {
    await verifyAdmin(request);
    
    const body = await request.json();
    const { userId, action, newPlan } = body;

    if (!userId || !action) {
      return NextResponse.json({ success: false, error: 'Missing userId or action' }, { status: 400 });
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    let updateData = {};

    if (action === 'change_plan' && newPlan) {
      updateData.plan = newPlan;
      updateData.label = newPlan;
    } else if (action === 'deactivate') {
      updateData.status = 'Inactive';
    } else if (action === 'activate') {
      updateData.status = 'Active';
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    await userRef.update(updateData);
    
    return NextResponse.json({ success: true, message: `User updated successfully with action: ${action}` });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}
