import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import crypto from 'crypto';

// Inicializar Firebase Admin SDK si no está inicializado


// Función auxiliar para verificar el token de Firebase
async function verifyUser(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No authorization token provided');
  }
  const idToken = authHeader.split('Bearer ')[1];
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  return decodedToken;
}

export async function GET(request) {
  try {
    const user = await verifyUser(request);
    
    // Buscar en Firestore si el usuario ya tiene una llave
    const userDoc = await db.collection('users').doc(user.uid).get();
    
    if (userDoc.exists && userDoc.data().api_key) {
      return NextResponse.json({ success: true, api_key: userDoc.data().api_key });
    } else {
      return NextResponse.json({ success: true, api_key: null });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    const user = await verifyUser(request);
    
    // Buscar el documento del usuario para verificar si tiene un plan
    const userDocRef = db.collection('users').doc(user.uid);
    const userDoc = await userDocRef.get();
    
    let currentPlan = 'None';
    if (userDoc.exists) {
      currentPlan = userDoc.data().plan || 'None';
    }
    
    // Si no tiene plan, bloqueamos la generación
    if (currentPlan === 'None') {
      return NextResponse.json({ success: false, requirePlan: true, error: 'Debes seleccionar un plan antes de generar una API Key.' }, { status: 403 });
    }
    
    // Generar una nueva API Key única
    const randomHex = crypto.randomBytes(16).toString('hex');
    const newApiKey = `brain_user_${randomHex}`;
    
    // Guardar en Firestore
    await userDocRef.set({
      api_key: newApiKey,
      email: user.email,
      name: user.name || '',
      label: currentPlan, // Etiqueta hereda el plan del usuario (Free, Gold, etc.)
      created_at: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    return NextResponse.json({ success: true, api_key: newApiKey, plan: currentPlan });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

