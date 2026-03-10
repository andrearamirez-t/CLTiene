import React from "react";

const ResumenEjecutivoResult = ({ resultado }) => {

    return (
        <div
            style={{
                marginTop: "20px",
                padding: "20px",
                backgroundColor: "#f8fafc",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                color: "#1e293b",
                fontSize: "14px",
                lineHeight: "1.6",
                maxHeight: "400px",
                overflowY: "auto",
                whiteSpace: "pre-wrap"
            }}
        >
            {resultado ? (
                <div>{resultado}</div>
            ) : (
                <p style={{ color: "#64748b" }}>
                    Genera un análisis para ver el resumen ejecutivo.
                </p>
            )}
        </div>
    );
};

export default ResumenEjecutivoResult;