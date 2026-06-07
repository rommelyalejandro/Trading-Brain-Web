import Link from 'next/link';

export const metadata = {
  title: 'Documentación Técnica: Superpoderes AI | Trading Brain',
  description: 'Arquitectura matemática y diseño algorítmico detrás de nuestros indicadores de Order Flow para NinjaTrader 8.',
};

export default function SuperpowersDocs() {
  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header Premium */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>TB</div>
            <span style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.5px' }}>Trading Brain AI <span style={{ color: '#64748b', fontWeight: '400' }}>/ Docs</span></span>
          </div>
          <nav>
            <Link href="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Volver al Dashboard</Link>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 16px 0', background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Arquitectura de Superpoderes
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Transparencia técnica absoluta. Descubre cómo diseñamos nuestros algoritmos de Order Flow garantizando cero latencia en tu plataforma.
          </p>
        </div>

        {/* Alerta de Transparencia */}
        <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px', padding: '24px', marginBottom: '48px', display: 'flex', gap: '16px' }}>
          <div style={{ color: '#3b82f6', marginTop: '2px' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#60a5fa' }}>Nuestra Filosofía de Rendimiento</h3>
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6' }}>
              A diferencia de indicadores comerciales pesados que procesan miles de barras volumétricas históricas colapsando tu memoria RAM, los Superpoderes de Trading Brain se conectan directamente a la vena <code style={{ background: '#0f172a', padding: '2px 6px', borderRadius: '4px', color: '#e2e8f0' }}>OnMarketData</code> de NinjaTrader. Calculamos todo en tiempo real (Tick a Tick).
              <br/><br/>
              <strong>Regla de Seguridad Operativa (Límite 48h):</strong> Para proteger la estabilidad de tu máquina y garantizar que el gráfico sea "súper ligero", nuestros indicadores solo grafican matemáticamente los datos de los <strong>últimos 2 días</strong>. No permitimos sobrecargas por dibujar semanas de datos inútiles.
            </p>
          </div>
        </div>

        {/* Sección VPOC */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>SuperPower: VPOC Actual</h2>
          </div>
          
          <div style={{ background: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '32px' }}>
              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '24px' }}>
                El <strong>Volume Point of Control (VPOC)</strong> identifica el nivel de precio exacto donde se negociaron la mayor cantidad de contratos institucionales dentro de la vela que se está formando.
              </p>
              
              <h4 style={{ color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '16px' }}>Mecánica Matemática</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.8', margin: '0 0 24px 0', paddingLeft: '20px' }}>
                <li>Se inicializa un <code style={{ color: '#38bdf8' }}>Dictionary&lt;double, long&gt;</code> mapeando Precio vs Volumen en la RAM.</li>
                <li>Por cada Tick recibido (<code style={{ color: '#38bdf8' }}>MarketDataType.Last</code>), se suma el volumen al nivel de precio correspondiente.</li>
                <li>Se compara el volumen del nuevo tick con el <code style={{ color: '#38bdf8' }}>MaxVolume</code> de la vela. Si lo supera, ese precio se convierte en el nuevo POC.</li>
                <li>Al cierre de la vela, el diccionario <strong>se vacía por completo</strong> para evitar saturación de memoria.</li>
              </ul>

              <h4 style={{ color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '16px' }}>Requisito Crítico: Tick Replay</h4>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', borderLeft: '4px solid #f59e0b', padding: '16px', borderRadius: '0 8px 8px 0' }}>
                <p style={{ margin: 0, color: '#fcd34d', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Para que NinjaTrader pueda reproducir este cálculo matemático con precisión quirúrgica en el pasado reciente (2 días), <strong>debes habilitar la casilla "Tick Replay"</strong> en tu serie de datos al configurar el gráfico. Si no lo activas, el indicador funcionará perfectamente de aquí en adelante (tiempo real), pero no podrá pintar el histórico de las velas anteriores.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección VP Fixed */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>SuperPower: VP Fixed (Nativo)</h2>
          </div>
          
          <div style={{ background: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '32px' }}>
              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '24px' }}>
                El <strong>Volume Profile Fixed Range</strong> no es un indicador pesado tradicional, sino una verdadera <strong>Herramienta de Dibujo Nativa</strong> (como el Fibonacci). Te permite seleccionar milimétricamente un Punto A y un Punto B en tu gráfico para descubrir exactamente dónde se inyectó el volumen institucional.
              </p>
              
              <h4 style={{ color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '16px' }}>Mecánica y Optimización</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.8', margin: '0 0 24px 0', paddingLeft: '20px' }}>
                <li>Se integra nativamente al menú del <code style={{ color: '#38bdf8' }}>Lápiz</code> de NinjaTrader para máxima eficiencia gráfica (Direct2D).</li>
                <li>Solo extrae y procesa los datos del rango de barras seleccionadas mediante <code style={{ color: '#38bdf8' }}>GetAttachedToChartBars()</code>, garantizando cero impacto en el rendimiento global de tu CPU.</li>
                <li>Dibuja el histograma de manera inversa (Nace a la izquierda, proyectando hacia la derecha) con un Area de Valor del 70% optimizada para no tapar la acción del precio.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Sección DeltaBar */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>SuperPower: DeltaBar</h2>
          </div>
          
          <div style={{ background: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '32px' }}>
              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '24px' }}>
                El <strong>Delta de Order Flow</strong> es el microscopio institucional. Mide la agresión pura del mercado, calculando la diferencia exacta entre los compradores que cruzaron el spread (Ask) y los vendedores que lo golpearon (Bid).
              </p>
              
              <h4 style={{ color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '16px' }}>Mecánica Matemática</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.8', margin: '0 0 24px 0', paddingLeft: '20px' }}>
                <li>Monitoreamos simultáneamente el libro de órdenes (Bid/Ask) y los trades cruzados (Last).</li>
                <li>Si <code style={{ color: '#ef4444' }}>Trade Price &gt;= Current Ask</code> ➔ Compra Agresiva ➔ Sumamos al Delta.</li>
                <li>Si <code style={{ color: '#ef4444' }}>Trade Price &lt;= Current Bid</code> ➔ Venta Agresiva ➔ Restamos al Delta.</li>
              </ul>

              <h4 style={{ color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '16px' }}>Experiencia Visual (UI)</h4>
              <p style={{ color: '#94a3b8', lineHeight: '1.8', margin: 0 }}>
                El indicador pinta un histograma limpio en la parte inferior del gráfico (Verde/Rojo). Además, inyectamos una etiqueta flotante (<code style={{ color: '#10b981' }}>Draw.TextFixed</code>) en la esquina superior derecha de tu gráfico que muestra el valor exacto en tiempo real (ej: <strong>🔥 Delta: +450</strong>), permitiéndote tomar decisiones sin quitar los ojos de las velas.
              </p>
            </div>
          </div>
        </section>

        {/* Sección Big Trade */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '24px' }}>🐳</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>SuperPower: Big Trade</h2>
          </div>
          
          <div style={{ background: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '32px' }}>
              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '24px' }}>
                El <strong>Detector de Big Trades</strong> escanea el flujo de órdenes en tiempo real para identificar posiciones institucionales masivas que cruzan la cinta (Time and Sales), revelando dónde las "Ballenas" están entrando al mercado.
              </p>
              
              <h4 style={{ color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '16px' }}>Mecánica Visual</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.8', margin: '0 0 24px 0', paddingLeft: '20px' }}>
                <li>Filtra automáticamente el "ruido" de los operadores minoristas.</li>
                <li>Dibuja marcadores esféricos (Burbujas) en el gráfico exactamente en el precio y tiempo donde ocurrió el trade masivo.</li>
                <li>El tamaño de la burbuja es dinámico, escalando en proporción directa al tamaño del contrato ejecutado.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Sección Absorción */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '24px' }}>🧱</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>SuperPower: Absorción</h2>
          </div>
          
          <div style={{ background: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '32px' }}>
              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '24px' }}>
                El <strong>Mapa de Absorción</strong> detecta zonas de liquidez extrema donde los institucionales están usando órdenes Límite (Icebergs) para absorber la agresión del mercado, frenando el precio e indicando posibles giros abruptos (Reversals).
              </p>
              
              <h4 style={{ color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '16px' }}>Detección Algorítmica</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.8', margin: '0 0 24px 0', paddingLeft: '20px' }}>
                <li>Compara el volumen de trades agresivos (Delta) contra el movimiento real del precio.</li>
                <li>Si hay agresión extrema (ej: grandes ventas de mercado) pero el precio <strong>no cae</strong>, el algoritmo detecta la presencia de un "Muro de Órdenes Límite".</li>
                <li>Pinta la zona de absorción directamente en la vela, alertándote de que la tendencia está siendo bloqueada y está a punto de invertirse.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Sección SuperCopier */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '24px' }}>⚡</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>SuperCopier Ultrarrápido</h2>
          </div>
          
          <div style={{ background: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '32px' }}>
              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '24px' }}>
                El <strong>SuperCopier</strong> es un motor de replicación de alta frecuencia. En lugar de depender de servidores externos lentos, el SuperCopier se ejecuta <strong>localmente</strong> en tu máquina, enlazando directamente las cuentas (Apex, Topstep, etc.) dentro de NinjaTrader.
              </p>
              
              <h4 style={{ color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '16px' }}>Arquitectura de Cero Latencia</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.8', margin: '0 0 24px 0', paddingLeft: '20px' }}>
                <li>Se interceptan los eventos <code style={{ color: '#eab308' }}>OnExecutionUpdate</code> y <code style={{ color: '#eab308' }}>OnOrderUpdate</code> de la cuenta maestra (Líder).</li>
                <li>Se aplica instantáneamente un factor de multiplicación (Multiplicador de Contratos) y se emiten órdenes asíncronas <code style={{ color: '#eab308' }}>SubmitOrderAsync</code> a las cuentas seguidoras.</li>
                <li>Inmune a caídas de internet de proveedores externos, ya que el ruteo de órdenes ocurre directo a los servidores de Rithmic/Tradovate.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Sección Bitácora Analítica */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '24px' }}>📓</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>Bitácora Analítica Automática</h2>
          </div>
          
          <div style={{ background: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '32px' }}>
              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '24px' }}>
                La <strong>Bitácora (Smart Analytics Log)</strong> acaba con la tarea manual de registrar trades en Excel. Captura todos tus movimientos en tiempo real y los sincroniza automáticamente con la nube a través de nuestra API REST, donde se analizan para extraer tu ventaja matemática (Edge).
              </p>
              
              <h4 style={{ color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '16px' }}>Métricas y Tiltmeter</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.8', margin: '0 0 24px 0', paddingLeft: '20px' }}>
                <li>Captura el PnL, comisiones, duración del trade, y Maximum Adverse Excursion (MAE) / Maximum Favorable Excursion (MFE).</li>
                <li><strong>Tiltmeter Algorítmico:</strong> Mide la frecuencia de tus operaciones para detectar síntomas de "Overtrading" o comportamiento irracional, activando alertas si te acercas al colapso psicológico.</li>
                <li>Los datos viajan en formato JSON seguro utilizando <code style={{ color: '#a855f7' }}>HttpClient</code> en un hilo secundario para no congelar la interfaz de tu NinjaTrader.</li>
              </ul>
            </div>
          </div>
        </section>

      </main>
      
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 24px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
        &copy; {new Date().getFullYear()} Trading Brain AI. Diseñado con precisión milimétrica.
      </footer>
    </div>
  );
}
