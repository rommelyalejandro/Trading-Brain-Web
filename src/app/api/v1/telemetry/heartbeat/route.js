import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Inicializar Firebase Admin SDK si no está inicializado


export async function POST(request) {
  try {
    const apiKey = request.headers.get('x-api-key') || '';
    const payload = await request.json();

    // Validar API Key y Concurrencia
    let isValid = false;
    let userEmail = 'unknown';
    let errorMessage = 'Invalid API Key';
    
    if (apiKey) {
      const usersSnapshot = await db.collection('users').where('api_key', '==', apiKey).limit(1).get();
      if (!usersSnapshot.empty) {
        isValid = true;
        const userDoc = usersSnapshot.docs[0];
        const userData = userDoc.data();
        userEmail = userData.email;

        // Anti-Piratería: Bloqueo de Hardware / Instancia
        const incomingInstanceId = payload.instance_id || request.headers.get('x-instance-id');
        if (incomingInstanceId) {
          if (!userData.locked_instance_id) {
            // Es la primera vez que se usa la llave, bloquear a esta máquina
            await userDoc.ref.update({ locked_instance_id: incomingInstanceId });
          } else if (userData.locked_instance_id !== incomingInstanceId) {
            // Ya está bloqueada a OTRA máquina, rechazar conexión
            isValid = false;
            errorMessage = 'Concurrent Usage Detected: API Key is locked to another NinjaTrader instance.';
          }
        }
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
      return NextResponse.json({ success: false, error: errorMessage }, { status: 403 });
    }

    return NextResponse.json({ success: true, message: 'Heartbeat logged' });

  } catch (error) {
    console.error('Error logging telemetry:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
