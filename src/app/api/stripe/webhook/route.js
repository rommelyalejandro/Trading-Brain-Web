import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Retrieve the user ID we passed in client_reference_id
    const userId = session.client_reference_id || session.metadata?.userId;

    if (userId) {
      try {
        // Fetch the user's document
        const userRef = db.collection('users').doc(userId);
        
        // Update user status
        await userRef.set({
          stripeCustomerId: session.customer,
          subscriptionStatus: 'active',
          plan: 'paid', // Could be dynamic based on the price ID mapped from Stripe
          updatedAt: new Date().toISOString()
        }, { merge: true });

        console.log(`Successfully provisioned license for user: ${userId}`);

        // TODO: Automatically generate the NinjaTrader API Key here or let the Dashboard handle it on load if subscriptionStatus === 'active'

      } catch (dbError) {
        console.error('Error updating Firestore:', dbError);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
    } else {
      console.warn('Checkout session completed but no userId found in client_reference_id or metadata');
    }
  }

  return NextResponse.json({ received: true });
}
