import React, { useEffect, useState } from 'react';
import GraficaBarrasAnalisis from '../components/ui/GraficaBarrasAnalisis';
import GraficaPastelAnalisis from '../components/ui/GraficaPastelAnalisis';
import { useFilters } from '../FiltersContext';

const Analisis = () => {
  const { filters, buildQuery } = useFilters();

  const [planes, setPlanes] = useState([])
  const [mascotas, setMascotas] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [motivosRechazo, setMotivosRechazo] = useState([])




  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = buildQuery() || null

        const planesRes = await fetch(`http://localhost:8000/api/planes_mencionados${params ? `?${params}` : ""}`);
        const mascotasRes = await fetch(`http://localhost:8000/api/tipo_mascota${params ? `?${params}` : ""}`);
        const vehiculosRes = await fetch(`http://localhost:8000/api/tipo_vehiculo${params ? `?${params}` : ""}`);
        const motivosRechazoRes = await fetch(`http://localhost:8000/api/motivo_rechazo${params ? `?${params}` : ""}`);

        const planes = await planesRes.json();
        const mascotas = await mascotasRes.json();
        const vehiculos = await vehiculosRes.json();
        const motivor = await motivosRechazoRes.json();

        setPlanes(Array.isArray(planes) ? planes : []);
        setMascotas(Array.isArray(mascotas) ? mascotas : []);
        setVehiculos(Array.isArray(vehiculos) ? vehiculos : []);
        setMotivosRechazo(Array.isArray(motivor) ? motivor : []);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    fetchData();
  }, [filters]);

  const [mostrarAnalisis, setMostrarAnalisis] = useState(false);

  const [analisisIA, setAnalisisIA] = useState(null)
  const [loadingIA, setLoadingIA] = useState(false)

  const generarAnalisisIA = async () => {

    const toggleAnalisisIA = async () => {

      if (!analisisIA) {

        setMostrarAnalisis(true);
        setLoadingIA(true);

        try {

          const params = buildQuery()

          const url = `http://localhost:8000/ia/analisis_automatico?tipo_analisis=patrones_ventas${params ? `&${params}` : ""}`

          const response = await fetch(url)

          const data = await response.json()

          setAnalisisIA(data?.result || "No se pudo generar el análisis.")

        } catch (error) {

          console.error("Error generando análisis IA:", error)
          setAnalisisIA("Error generando análisis.")

        }

        setLoadingIA(false)
      } else {

        setMostrarAnalisis(!mostrarAnalisis)
      }
    }

    <button
      onClick={toggleAnalisisIA}
    >
      {mostrarAnalisis ? 'Ocultar Análisis' : 'Análisis Profundo IA - Patrones de Ventas'}
    </button>




    const datosPlanes = planes
    const datosMascota = mascotas
    const datosVehiculo = vehiculos
    const datosMotivoRechazo = motivosRechazo

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', backgroundColor: '#f8fafc' }}>

        {/* Graficas de Barras */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <GraficaBarrasAnalisis titulo="Planes Mencionados" datos={datosPlanes} colorBarra="#EE7553" />

          <GraficaBarrasAnalisis titulo="Motivos de Rechazo" datos={datosMotivoRechazo} colorBarra="#f87171" />
        </div>

        {/* Graficas de Tortas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <GraficaPastelAnalisis titulo="Tipo de Mascota" datos={datosMascota} colores={['#f43f5e', '#fb923c', '#fb7185', '#fda4af']} />
          <GraficaPastelAnalisis titulo="Tipo de Vehículo" datos={datosVehiculo} colores={['#db2777', '#f472b6', '#fbcfe8']} />
        </div>

        {/* BOTON */}
        <button
          onClick={generarAnalisisIA}
          style={{
            width: '100%', padding: '16px', backgroundColor: '#be185d', color: 'white',
            border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer',
            fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
          }}
        >
          {mostrarAnalisis ? 'Ocultar Análisis' : 'Análisis Profundo IA - Patrones de Ventas'}
        </button>


        {mostrarAnalisis && (
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>

            {loadingIA && (
              <p style={{ fontSize: '13px' }}>Generando análisis con IA...</p>
            )}

            {analisisIA && (
              <div
                dangerouslySetInnerHTML={{ __html: analisisIA }}
                style={{
                  fontSize: '13px',
                  color: '#475569',
                  lineHeight: '1.6'
                }}
              />
            )}

          </div>
        )}
      </div>
    );
  };
};

export default Analisis;