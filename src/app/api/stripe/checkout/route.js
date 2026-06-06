import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { admin } from '@/lib/firebase-admin';

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Use the latest API version or your account's default
});

export async function POST(request) {
  try {
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

    const { priceId, mode = 'subscription' } = await request.json();

    if (!priceId) {
      return NextResponse.json({ success: false, error: 'Price ID is required' }, { status: 400 });
    }

    const userId = decodedToken.uid;
    const email = decodedToken.email;

    // Build the checkout session URL dynamically based on where the app is running
    const origin = request.headers.get('origin') || 'https://trading-brain-ai.com';

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      client_reference_id: userId, // CRITICAL: This is how we map the payment back to the Firebase user in the webhook
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode, // 'payment' for one-time (Free plan), 'subscription' for the rest
      success_url: `${origin}/dashboard?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?payment_canceled=true`,
      metadata: {
        userId: userId,
      }
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
