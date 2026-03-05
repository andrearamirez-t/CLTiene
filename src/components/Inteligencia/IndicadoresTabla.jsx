import React, { useState } from 'react';

const IndicadoresTabla = ({ data }) => {
  const [busqueda, setBusqueda] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'efectividad', direction: 'desc' });

  const handleSortSelect = (e, key) => {
    const value = e.target.value;
    if (value === 'mayor') {
      setSortConfig({ key, direction: 'desc' });
    } else if (value === 'menor') {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  const filteredData = data
    .filter(item => item.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const headerStyle = {
    padding: '10px',
    backgroundColor: '#1e293b',
    color: '#94a3b8',
    fontSize: '11px',
    fontWeight: '600',
    borderBottom: '1px solid #334155',
    textAlign: 'center',
    whiteSpace: 'nowrap'
  };

  const inputStyle = {
    width: '100%',
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    color: 'white',
    fontSize: '10px',
    marginTop: '5px',
    borderRadius: '4px',
    padding: '4px',
    outline: 'none'
  };

  return (
    <div style={{ overflowX: 'auto', borderRadius: '8px', backgroundColor: '#0f172a' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', color: '#f1f5f9', fontSize: '12px' }}>
        <thead>
          {/* Fila 1: Títulos */}
          <tr>
            <th style={headerStyle}>#</th>
            <th style={headerStyle}>Cuenta</th>
            <th style={headerStyle}>Total</th>
            <th style={headerStyle}>Ventas</th>
            <th style={headerStyle}>Efectividad_%</th>
            <th style={headerStyle}>Turnos_Asesor</th>
            <th style={headerStyle}>Turnos_Cliente</th>
            <th style={headerStyle}>Palabras</th>
            <th style={headerStyle}>Saludo %</th>
            <th style={headerStyle}>Identif. %</th>
            <th style={headerStyle}>Comprensión %</th>
            <th style={headerStyle}>Ofrecimiento %</th>
            <th style={headerStyle}>Manejo Inq. %</th>
            <th style={headerStyle}>Cierre %</th>
            <th style={headerStyle}>Próx. Paso %</th>
          </tr>
          
          <tr style={{ backgroundColor: '#1e293b' }}>
            <th style={{ padding: '5px' }}></th>
            <th style={{ padding: '5px' }}>
              <input 
                type="text" 
                placeholder="🔍 Buscar..." 
                style={inputStyle}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </th>
            <th style={{ padding: '5px' }}>
              <select style={inputStyle} onChange={(e) => handleSortSelect(e, 'total')}>
                <option value="todos">Todos</option>
                <option value="mayor">Mayor a menor</option>
                <option value="menor">Menor a mayor</option>
              </select>
            </th>
            <th style={{ padding: '5px' }}></th>
            <th style={{ padding: '5px' }}>
              <select style={inputStyle} onChange={(e) => handleSortSelect(e, 'efectividad')}>
                <option value="todos">Todos</option>
                <option value="mayor">Mayor a menor</option>
                <option value="menor">Menor a mayor</option>
              </select>
            </th>
            {Array(10).fill(0).map((_, i) => <th key={i} style={{ padding: '5px' }}></th>)}
          </tr>
        </thead>
        
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #1e293b', textAlign: 'center' }}>
              <td style={{ padding: '10px', color: '#64748b' }}>{index + 1}</td>
              <td style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>{row.nombre}</td>
              <td style={{ padding: '10px' }}>{row.total}</td>
              <td style={{ padding: '10px' }}>{row.ventas}</td>
              <td style={{ padding: '10px', color: '#fbbf24', fontWeight: 'bold' }}>{row.efectividad}%</td>
              <td style={{ padding: '10px' }}>{row.turnosAsesor}</td>
              <td style={{ padding: '10px' }}>{row.turnosCliente}</td>
              <td style={{ padding: '10px' }}>{row.palabras}</td>
              <td style={{ padding: '10px' }}>{row.saludo}%</td>
              <td style={{ padding: '10px' }}>{row.identificacion}%</td>
              <td style={{ padding: '10px' }}>{row.comprension}%</td>
              <td style={{ padding: '10px' }}>{row.ofrecimiento}%</td>
              <td style={{ padding: '10px' }}>{row.manejo}%</td>
              <td style={{ padding: '10px' }}>{row.cierre}%</td>
              <td style={{ padding: '10px' }}>{row.paso}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IndicadoresTabla;