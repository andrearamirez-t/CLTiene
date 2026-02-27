import React, { useState } from 'react';
import { Phone, Download, CheckCircle, DollarSign, Clock, Calendar, Trophy, Star, ChevronDown } from 'lucide-react';
import Sidebar from './components/Sidebar';

import "./css/style.css"
import Resumen from './tabs/Resumen';
import Rendimiento from './tabs/Rendimiento';
import Analisis from './tabs/Analisis';
import Inteligencia from './tabs/Inteligencia';
import Transcripciones from './tabs/Transcripciones';
import Agente from './tabs/Agente';

function App() {
  const [tabActiva, setTabActiva] = useState('Resumen Ejecutivo');

  const tabs = ['Resumen Ejecutivo', 'Rendimiento Asesores', 'Análisis Detallado', 'Inteligencia Operativa', 'Transcripciones', 'Agente IA PRO'];


  return (
    <div className="dashboard-container">

      <Sidebar />

      <main className="main">
        <header className="header-banner">
          <h1 style={{ margin: 0, fontSize: '22px' }}>Rendimiento de Asesores y Éxito de Llamadas</h1>
          <p style={{ margin: '5px 0 0', fontSize: '13px', opacity: 0.8 }}>Validación y seguimiento de datos con IA</p>
        </header>

        <section className="kpi-row">
          <div className="kpi-card"><Phone size={18} color="#be123c" /><span>Total</span><strong>3,299</strong></div>
          <div className="kpi-card"><Download size={18} color="#be123c" /><span>Contestadas</span><strong>3,298</strong></div>
          <div className="kpi-card"><CheckCircle size={18} color="#be123c" /><span>Efectivas</span><strong>185</strong></div>
          <div className="kpi-card"><DollarSign size={18} color="#be123c" /><span>Ventas</span><strong>62</strong></div>
          <div className="kpi-card"><Clock size={18} color="#be123c" /><span>Hora</span><strong>9:00</strong></div>
          <div className="kpi-card"><Calendar size={18} color="#be123c" /><span>Día</span><strong>Viernes</strong></div>
          <div className="kpi-card"><Trophy size={18} color="#be123c" /><span>Top</span><strong>Jennifer</strong></div>
          <div className="kpi-card"><Trophy size={18} color="#be123c" /><span>Saludo</span><strong>7%</strong></div>
          <div className="kpi-card"><Star size={18} color="#be123c" /><span>Calidad</span><strong>12/100</strong></div>
        </section>

        <nav className="tabs-container">
          {tabs.map(tab => (
            <button key={tab} className={`tab-button ${tabActiva === tab ? 'active' : ''}`} onClick={() => setTabActiva(tab)}>{tab}</button>
          ))}
        </nav>

        {tabActiva == "Resumen Ejecutivo" && (<Resumen />)}
        {tabActiva == "Rendimiento Asesores" && (<Rendimiento />)}
        {tabActiva == "Análisis Detallado" && (<Analisis />)}
        {tabActiva == "Inteligencia Operativa" && (<Inteligencia />)}
        {tabActiva == "Transcripciones" && (<Transcripciones />)}
        {tabActiva == "Agente IA PRO" && (<Agente />)}
      </main>
    </div>
  );
}

export default App;