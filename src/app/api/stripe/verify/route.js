import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { admin, db } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(request) {
  try {
    // Verificar token del usuario
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (error) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const { session_id } = await request.json();
    if (!session_id) {
      return NextResponse.json({ success: false, error: 'Session ID is required' }, { status: 400 });
    }

    // Verificar la sesión en Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === 'paid') {
      const userId = decodedToken.uid;
      
      // Update user status
      const userRef = db.collection('users').doc(userId);
      await userRef.set({
        stripeCustomerId: session.customer,
        subscriptionStatus: 'active',
        plan: 'paid',
        updatedAt: new Date().toISOString()
      }, { merge: true });

      return NextResponse.json({ success: true, message: 'Payment verified and account activated' });
    } else {
      return NextResponse.json({ success: false, error: 'Payment not completed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Stripe verify error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
