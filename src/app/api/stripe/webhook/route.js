import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import admin from 'firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build_purposes');

// Inicializar Firebase Admin SDK si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'trading-brain-ai-app'
  });
}

const db = admin.firestore();

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Manejar el evento
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Obtener el UID del usuario (pasado en client_reference_id)
      const userId = session.client_reference_id;
      
      if (userId) {
        // En este paso deberíamos mapear el plan, 
        // pero por ahora asignaremos "Pro" o extraeremos del Line Item.
        
        await db.collection('users').doc(userId).set({
          plan: 'Premium', // TODO: Mapear según el precio exacto
          subscription_status: 'active',
          stripe_customer_id: session.customer,
          subscription_id: session.subscription,
          label: 'Premium', // Sobrescribir etiqueta Trial
          updated_at: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        console.log(`Usuario ${userId} actualizado a plan Premium.`);
      }
      break;
      
    case 'invoice.payment_failed':
      // Manejar pagos fallidos
      const failedInvoice = event.data.object;
      // Actualizar en BD a inactivo o suspendido...
      break;

    default:
      console.log(`Evento no manejado: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
