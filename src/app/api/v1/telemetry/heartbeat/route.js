import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Inicializar Firebase Admin SDK si no está inicializado


export async function POST(request) {
  try {
    const apiKey = request.headers.get('x-api-key') || '';
    const payload = await request.json();

    // Validar API Key
    let isValid = false;
    let userEmail = 'unknown';
    
    if (apiKey) {
      const usersSnapshot = await db.collection('users').where('api_key', '==', apiKey).limit(1).get();
      if (!usersSnapshot.empty) {
        isValid = true;
        userEmail = usersSnapshot.docs[0].data().email;
      }
    }

    // Preparar el evento de telemetría
    const event = {
      ...payload,
      api_key_used: apiKey,
      is_valid_key: isValid,
      user_email: userEmail,
      server_timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    // Guardar en Firestore colección 'superpower_instances' (Upsert por instance_id)
    if (event.instance_id) {
      await db.collection('superpower_instances').doc(event.instance_id).set(event, { merge: true });
    } else {
      await db.collection('superpower_instances').add(event);
    }

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid API Key' }, { status: 403 });
    }

    return NextResponse.json({ success: true, message: 'Heartbeat logged' });

  } catch (error) {
    console.error('Error logging telemetry:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
