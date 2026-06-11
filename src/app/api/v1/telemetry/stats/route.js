import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';
import * as fs from 'fs';
import * as path from 'path';



export async function GET(req) {
  try {
    const apiKey = req.headers.get('x-api-key') || req.headers.get('X-API-Key');
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'API Key missing' }, { status: 401 });
    }

    // Buscar el usuario con esta API Key
    const snapshot = await db.collection('users').where('api_key', '==', apiKey).limit(1).get();
    
    if (snapshot.empty) {
      return NextResponse.json({ success: false, error: 'Invalid API Key' }, { status: 403 });
    }

    const userData = snapshot.docs[0].data();
    const currentPlan = userData.plan || 'Starter';

    // Retornar éxito junto con el plan del usuario
    return NextResponse.json({ 
      success: true, 
      plan: currentPlan,
      label: userData.label || currentPlan
    });

  } catch (error) {
    console.error('Error validating API Key in stats:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
