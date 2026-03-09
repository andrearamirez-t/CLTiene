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
        const motivosRechazoRes = await fetch(`http://localhost:8000/api/tipo_vehiculo${params ? `?${params}` : ""}`);

        const planes = await planesRes.json();
        const mascotas = await mascotasRes.json();
        const vehiculos = await vehiculosRes.json();
        const motivor = await motivosRechazoRes.json();

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

  const [mostrarAnalisis, setMostrarAnalisis] = useState(false);

  // const datosPlanes = [
  //   { n: "No identificado", v: "2,118 (64.2%)", valorReal: 2118 },
  //   { n: "Plan Mascotas", v: "720 (21.8%)", valorReal: 720 },
  //   { n: "Plan Salud", v: "185 (5.6%)", valorReal: 185 },
  //   { n: "Plan Movilidad", v: "146 (4.4%)", valorReal: 146 }
  // ];
  // const datosMascota = [
  //   { name: 'No especificado', value: 72 },
  //   { name: 'Perro', value: 14.7 },
  //   { name: 'Ambos', value: 8.2 },
  //   { name: 'Gato', value: 5.1 }
  // ];
  // const datosVehiculo = [
  //   { name: 'No especificado', value: 34.9 },
  //   { name: 'Carro', value: 32.9 },
  //   { name: 'Ambos', value: 30.1 },
  //   { name: 'Moto', value: 2.05 }
  // ]

  const datosPlanes = planes
  const datosMascota = mascotas
  const datosVehiculo = vehiculos
  const datosMotivoRechazo = motivosRechazo

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', backgroundColor: '#f8fafc' }}>

      {/* Graficas de Barras */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <GraficaBarrasAnalisis titulo="Planes Mencionados" datos={datosPlanes} colorBarra="#EE7553" />

        {/* Corregir */}
        <GraficaBarrasAnalisis titulo="Motivos de Rechazo" datos={datosMotivoRechazo} colorBarra="#f87171" />
      </div>

      {/* Graficas de Tortas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <GraficaPastelAnalisis titulo="Tipo de Mascota" datos={datosMascota} colores={['#f43f5e', '#fb923c', '#fb7185', '#fda4af']} />
        <GraficaPastelAnalisis titulo="Tipo de Vehículo" datos={datosVehiculo} colores={['#db2777', '#f472b6', '#fbcfe8']} />
      </div>

      {/* BOTON */}
      <button
        onClick={() => setMostrarAnalisis(!mostrarAnalisis)}
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
          backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)', animation: 'fadeIn 0.5s ease-in-out'
        }}>
          <p style={{ color: '#475569', fontSize: '13px', lineHeight: '1.6' }}>
            Con base en la información provista sobre el call center CL tiene soluciones, puedo detectar los siguientes patrones...
          </p>

          <h4 style={{ color: '#be185d', fontSize: '14px', marginTop: '20px' }}>1. PATRÓN DE ÉXITO:</h4>
          <ul style={{ fontSize: '13px', color: '#64748b' }}>
            <li>El agente Melany Camila Ramirez tiene el mejor desempeño con un 4.99% de llamadas efectivas.</li>
            <li>Planes específicos como el Plan Mascotas tienen una presencia notable en las llamadas exitosas.</li>
          </ul>

          <h4 style={{ color: '#be185d', fontSize: '14px', marginTop: '20px' }}>2. PATRÓN DE FRACASO:</h4>
          <ul style={{ fontSize: '13px', color: '#64748b' }}>
            <li>Muchos planes mencionados no están identificados (2118), lo que sugiere falta de guion claro.</li>
          </ul>

          <h4 style={{ color: '#be185d', fontSize: '14px', marginTop: '20px' }}>3. ESTRATEGIA:</h4>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Capacitar a los agentes con mejor desempeño para compartir mejores prácticas en manejo de objeciones.</p>
        </div>
      )}
    </div>
  );
};

export default Analisis;