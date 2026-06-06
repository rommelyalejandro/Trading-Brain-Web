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
        // pero por ahora asignaremos "Premium" o extraeremos del Line Item.
        const assignedPlan = 'Premium'; // TODO: Mapear según el precio exacto
        
        // Generar una nueva API Key única con prefijo del plan
        const randomHex = crypto.randomBytes(16).toString('hex');
        const planPrefix = assignedPlan.toLowerCase();
        const newApiKey = `${planPrefix}_user_${randomHex}`;
        
        await db.collection('users').doc(userId).set({
          plan: assignedPlan,
          subscription_status: 'active',
          stripe_customer_id: session.customer,
          subscription_id: session.subscription,
          label: assignedPlan, // Sobrescribir etiqueta Trial
          api_key: newApiKey, // ASIGNAR API KEY INMEDIATAMENTE
          updated_at: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        console.log(`Usuario ${userId} actualizado a plan ${assignedPlan} con API Key generada.`);
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
