import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import admin from 'firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
      // Intentar re-inicializar app si es necesario o manejar el error
      return NextResponse.json({ success: false, error: 'Token inválido' }, { status: 401 });
    }

    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json({ success: false, error: 'Price ID requerido' }, { status: 400 });
    }

    // Crear sesión de Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: decodedToken.email,
      client_reference_id: decodedToken.uid, // Guardamos el UID para saber quién pagó
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/?checkout=success`,
      cancel_url: `${req.headers.get('origin')}/pricing?checkout=canceled`,
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    console.error('Error creando checkout session:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
