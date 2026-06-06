export async function POST(req) {
  try {
    const { module, userId } = await req.json();
    
    // Guardar en coleccion de descargas
    await addDoc(collection(db, 'telemetry_downloads'), {
      module: module || 'Unknown',
      userId: userId || 'Anonymous',
      timestamp: new Date()
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
