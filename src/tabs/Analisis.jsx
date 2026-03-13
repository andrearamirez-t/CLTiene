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

        const planesRes = await fetch(`http://localhost:8000/api/planes_mencionados${query}`);
        const mascotasRes = await fetch(`http://localhost:8000/api/tipo_mascota${query}`);
        const vehiculosRes = await fetch(`http://localhost:8000/api/tipo_vehiculo${query}`);
        const motivosRechazoRes = await fetch(`http://localhost:8000/api/motivo_rechazo${query}`);

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
  const obtenerAnalisisIA = async () => {

    try {

      setCargandoAnalisis(true);
      setAnalisisIA("");

      const params = buildQuery();
      const query = params ? `?${params}` : "";

      // const response = await fetch(`http://localhost:8000/analisis-patrones${query}`);
      const response = await fetch(`http://localhost:8000/ia/analisis_ranking`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const data = result.result
      const texto = data[0] || "No se recibio analisis.";

      setAnalisisIA(texto);

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
          backgroundColor: '#be185d',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
      >

        {mostrarAnalisis ? 'Ocultar Analisis' : 'Analisis Profundo IA - Patrones de Ventas'}

      </button>



      {/* PANEL DE ANALISIS IA */}
      {mostrarAnalisis && (

        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>

          {cargandoAnalisis ? (

            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Generando Analisis con IA...
            </p>

          ) : (

            <div style={{ color: '#475569', fontSize: '13px', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: analisisIA }} />

          )}

        </div>

      )}

    </div>

  );

};

export default Analisis;


