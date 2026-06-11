import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';

export async function GET(request) {
  try {
    const apiKey = request.headers.get('x-api-key') || '';

    // Validar API Key
    let isValid = false;
    let userEmail = '';
    let planName = 'starter';

    if (apiKey) {
      const usersSnapshot = await db.collection('users').where('api_key', '==', apiKey).limit(1).get();
      if (!usersSnapshot.empty) {
        isValid = true;
        const userDoc = usersSnapshot.docs[0];
        const userData = userDoc.data();
        userEmail = userData.email || '';
        planName = (userData.plan || 'Starter').toLowerCase();
      }
    }

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid API Key' }, { status: 403 });
    }

    // Obtener los mensajes activos y no expirados
    const now = admin.firestore.Timestamp.now();
    const messagesSnapshot = await db.collection('brain_messages')
      .where('is_active', '==', true)
      .where('expires_at', '>', now)
      .get();

    const messages = [];
    messagesSnapshot.forEach(doc => {
      const msg = doc.data();
      const audience = (msg.target_audience || 'all').toLowerCase();
      
      let shouldInclude = false;

      if (audience === 'all') {
        shouldInclude = true;
      } else if (audience === 'specific') {
        if (msg.target_email === userEmail) {
          shouldInclude = true;
        }
      } else {
        // Filtrar por plan (starter, scale, advanced, prime)
        if (audience === planName) {
          shouldInclude = true;
        }
      }

      if (shouldInclude) {
        messages.push({
          id: doc.id,
          title: msg.title,
          body: msg.body,
          type: msg.type,
          created_at: msg.created_at ? msg.created_at.toDate().toISOString() : new Date().toISOString()
        });
      }
    });

    return NextResponse.json({ success: true, messages });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
