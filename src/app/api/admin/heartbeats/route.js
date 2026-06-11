import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Inicializar Firebase Admin SDK si no está inicializado


export async function GET(req) {
  try {
    // 1. Validar autorización (en un sistema de prod, usaríamos middleware y el Auth token del header)
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Solo rommelyalejandro@gmail.com es admin
    if (decodedToken.email !== 'rommelyalejandro@gmail.com') {
      return NextResponse.json({ success: false, error: 'Forbidden. Admin access only.' }, { status: 403 });
    }

    // 2. Obtener heartbeats
    // Filtramos solo los que han hecho ping en los últimos 3 minutos
    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);

    const snapshot = await db.collection('superpower_instances').get();

    const instances = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      // Omitir los que explícitamente están Uninstalled
      if (data.status !== 'Uninstalled') {
        const isOnline = data.server_timestamp && data.server_timestamp.toDate() >= threeMinutesAgo;
        instances.push({
          id: doc.id,
          ...data,
          status: isOnline ? 'Active' : 'Inactive',
          server_timestamp: data.server_timestamp ? data.server_timestamp.toDate().toISOString() : data.timestamp
        });
      }
    });

    // 3. Obtener KPIs Globales de Usuarios
    const usersSnapshot = await db.collection('users').get();
    let totalRegistered = 0;
    let freeUsers = 0;
    let payUsers = 0;

    usersSnapshot.forEach(doc => {
      totalRegistered++;
      const d = doc.data();
      // Asumimos campo 'plan', por defecto 'starter' si no existe
      if (d.plan === 'pay' || d.plan === 'pro') {
        payUsers++;
      } else {
        freeUsers++;
      }
    });

    // Calcular Activos vs Inactivos
    const activeUserIds = new Set(instances.map(inst => inst.auth_user_id).filter(id => id));
    const activos = activeUserIds.size;
    const inactivos = totalRegistered - activos;

    const userMetrics = {
      registrados: totalRegistered,
      activos: activos,
      inactivos: inactivos,
      starter: freeUsers,
      pay: payUsers
    };

    return NextResponse.json({ success: true, data: instances, metrics: userMetrics });
  } catch (error) {
    console.error('Error fetching admin heartbeats:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

