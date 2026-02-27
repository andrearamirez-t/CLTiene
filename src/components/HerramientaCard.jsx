import React from 'react';

const HerramientaCard = ({ title, description, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '20px',
        borderRadius: '15px',
        border: isActive ? '2px solid #e91e63' : '1px solid #e2e8f0',
        backgroundColor: '#fff',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: isActive ? '0 4px 12px rgba(233, 30, 99, 0.1)' : 'none',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '80px'
      }}
    >
      <h4 style={{
        margin: '0 0 5px 0',
        fontSize: '14px',
        color: isActive ? '#e91e63' : '#1e293b',
        fontWeight: 'bold'
      }}>
        {title}
      </h4>
      <p style={{ fontSize: '12px', color: '#7e8999', margin: 0 }}>
        {description}
      </p>
    </div>
  );
};

export default HerramientaCard;