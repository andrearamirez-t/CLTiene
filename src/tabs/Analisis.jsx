import { API_BASE } from '../config';
import React, { useEffect, useState } from 'react';
import GraficaBarrasAnalisis from '../components/ui/GraficaBarrasAnalisis';
import GraficaPastelAnalisis from '../components/ui/GraficaPastelAnalisis';
import { useFilters } from '../FiltersContext';

const Analisis = () => {

  const { filters, buildQuery } = useFilters();

  const [planes, setPlanes] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [motivosRechazo, setMotivosRechazo] = useState([]);

  const [mostrarAnalisis, setMostrarAnalisis] = useState(false);
  const [analisisIA, setAnalisisIA] = useState("");
  const [cargandoAnalisis, setCargandoAnalisis] = useState(false);


  useEffect(() => {

    const fetchData = async () => {

      try {

        const params = buildQuery();
        const query = params ? `?${params}` : "";

        const safe = (url) => fetch(url).then((r) => r.ok ? r.json() : []).catch(() => []);

        const [planes, mascotas, vehiculos, motivor] = await Promise.all([
          safe(`${API_BASE}/api/planes_mencionados${query}`),
          safe(`${API_BASE}/api/tipo_mascota${query}`),
          safe(`${API_BASE}/api/tipo_vehiculo${query}`),
          safe(`${API_BASE}/api/motivo_rechazo${query}`),
        ]);

        setPlanes(planes);
        setMascotas(mascotas);
        setVehiculos(vehiculos);
        setMotivosRechazo(motivor);

      } catch (error) {

        console.error("Error cargando datos:", error);

      }

    };

    fetchData();

  }, [filters]);
  const obtenerAnalisisIA = async () => {

    try {

      setCargandoAnalisis(true);
      setAnalisisIA("");

      const params = buildQuery();
      const query = params ? `?${params}` : "";

      const sep = params ? '&' : '?';
      const response = await fetch(`${API_BASE}/ia/analisis_automatico${query}${sep}tipo_analisis=patrones_ventas`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const raw = result.result || "No se recibio analisis.";
      setAnalisisIA(raw
        .replace(/background-color\s*:\s*rgb\(15,\s*23,\s*42\)[^;"']*/g, 'background-color: #f8fafc')
        .replace(/color\s*:\s*rgb\(203,\s*213,\s*225\)[^;"']*/g, 'color: #334155')
        .replace(/border-bottom\s*:\s*1px solid rgb\(30,\s*41,\s*59\)[^;"']*/g, 'border-bottom: 1px solid #e2e8f0'));

    } catch (error) {

      console.error("Error obteniendo analisis IA:", error);
      setAnalisisIA("No fue posible generar el analisis.");

    } finally {

      setCargandoAnalisis(false);

    }

  }


  const datosPlanes = planes;
  const datosMascota = mascotas;
  const datosVehiculo = vehiculos;
  const datosMotivoRechazo = motivosRechazo;



  return (

    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', backgroundColor: '#f8fafc' }}>

      {/* Graficas de Barras */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        <GraficaBarrasAnalisis
          titulo="Planes Mencionados"
          datos={datosPlanes}
          colorBarra="#EE7553"
        />

        <GraficaBarrasAnalisis
          titulo="Motivos de Rechazo"
          datos={datosMotivoRechazo}
          colorBarra="#f87171"
        />

      </div>


      {/* Graficas de Tortas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        <GraficaPastelAnalisis
          titulo="Tipo de Mascota"
          datos={datosMascota}
          colores={['#f43f5e', '#fb923c', '#fb7185', '#fda4af']}
        />

        <GraficaPastelAnalisis
          titulo="Tipo de Vehiculo"
          datos={datosVehiculo}
          colores={['#db2777', '#f472b6', '#fbcfe8']}
        />

      </div>


      {/* BOTON IA */}
      <button
        onClick={async () => {

          const nuevoEstado = !mostrarAnalisis;
          setMostrarAnalisis(nuevoEstado);

          if (nuevoEstado) {
            await obtenerAnalisisIA();
          }

        }}
        style={{
          width: '100%',
          padding: '16px',
          background: mostrarAnalisis
            ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
            : 'linear-gradient(135deg, #FC3276 0%, #db2777 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '700',
          cursor: 'pointer',
          fontSize: '14px',
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          boxShadow: mostrarAnalisis
            ? '0 4px 18px rgba(100,116,139,0.25)'
            : '0 4px 18px rgba(252,50,118,0.35)',
        }}
      >

        {mostrarAnalisis ? 'Ocultar Analisis' : 'Analisis Profundo IA - Patrones de Ventas'}

      </button>



      {/* PANEL DE ANALISIS IA */}
      {mostrarAnalisis && (

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '36px 40px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        }}>

          <div style={{
            borderLeft: '5px solid #FC3276',
            background: 'linear-gradient(90deg, #fff5f9 0%, transparent 80%)',
            borderRadius: '0 10px 10px 0',
            padding: '14px 20px',
            marginBottom: '28px',
          }}>
            <span style={{ display: 'block', fontSize: '18px', fontWeight: '700', color: '#FC3276', marginBottom: '4px' }}>
              📊 Análisis Profundo — Patrones de Ventas
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Generado con los filtros activos del dashboard
            </span>
          </div>

          {cargandoAnalisis ? (
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>⌛ Generando análisis con IA...</p>
          ) : (
            <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '14px' }}
              dangerouslySetInnerHTML={{ __html: analisisIA }} />
          )}

        </div>

      )}

    </div>

  );

};

export default Analisis;


