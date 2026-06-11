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

    // Verificar la sesión en Stripe expandiendo line_items
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items']
    });
    
    if (session.payment_status === 'paid') {
      const userId = decodedToken.uid;
      
      let planName = 'Premium';
      if (session.line_items && session.line_items.data.length > 0) {
        // Stripe usually sets description to the product name
        planName = session.line_items.data[0].description;
        // Clean up common prefixes like "Licencia" or "Plan" if we want, or leave as is
        if (planName.toLowerCase().includes('starter')) planName = 'Starter';
        else if (planName.toLowerCase().includes('scale')) planName = 'Scale';
        else if (planName.toLowerCase().includes('advanced')) planName = 'Advanced';
        else if (planName.toLowerCase().includes('prime')) planName = 'Prime';
      }

      // Update user status
      const userRef = db.collection('users').doc(userId);
      await userRef.set({
        stripeCustomerId: session.customer,
        subscriptionStatus: 'active',
        plan: planName,
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
