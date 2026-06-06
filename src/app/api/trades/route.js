import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Inicializar Firebase Admin SDK si no está inicializado


// GET endpoint para obtener los trades recientes
export async function GET() {
  try {
    // Obtenemos los últimos 50 trades ordenados por tiempo
    const snapshot = await db.collection('trades')
      .orderBy('server_timestamp', 'desc')
      .limit(50)
      .get();

    const trades = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      trades.push({
        id: doc.id,
        ...data,
        // Evitamos el error de serialización de Firebase Timestamp convirtiéndolo a ISO string
        server_timestamp: data.server_timestamp ? data.server_timestamp.toDate().toISOString() : data.timestamp
      });
    });

    return NextResponse.json({ success: true, data: trades });
  } catch (error) {
    console.error('Error fetching trades de Firestore:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

