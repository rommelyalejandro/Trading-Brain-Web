import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    let userId = null;
    const authHeader = request.headers.get('Authorization');
    const apiKey = request.headers.get('X-API-Key');

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      userId = decodedToken.uid;
    } else if (apiKey) {
      // Find user by API Key
      const keysSnapshot = await db.collection('api_keys').where('key', '==', apiKey).limit(1).get();
      if (!keysSnapshot.empty) {
        userId = keysSnapshot.docs[0].data().userId;
      }
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { trades } = body;

    if (!trades || !Array.isArray(trades)) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    // Usar un batch para subir todos los trades eficientemente
    // Firestore batch permite hasta 500 operaciones a la vez
    const batches = [];
    let currentBatch = db.batch();
    let operationCount = 0;

    for (const trade of trades) {
      // Usar executionId como doc ID para evitar duplicados si se sincroniza múltiples veces
      const docRef = db.collection('trades').doc(`${userId}_${trade.executionId}`);
      
      currentBatch.set(docRef, {
        trader_id: userId,
        action: trade.action.toUpperCase(),
        instrument: trade.instrument,
        lots: trade.quantity,
        price: trade.price,
        timestamp: trade.time * 1000, // Convertir Unix seconds a milisegundos
        server_timestamp: admin.firestore.FieldValue.serverTimestamp(),
        account: trade.accountName,
        is_historical: true,
        superpower: "Historical Sync"
      }, { merge: true }); // merge: true evita sobrescribir si ya existe y solo actualiza

      operationCount++;

      if (operationCount === 500) {
        batches.push(currentBatch.commit());
        currentBatch = db.batch();
        operationCount = 0;
      }
    }

    if (operationCount > 0) {
      batches.push(currentBatch.commit());
    }

    await Promise.all(batches);

    return NextResponse.json({ success: true, count: trades.length });
  } catch (error) {
    console.error('Error syncing historical trades:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
