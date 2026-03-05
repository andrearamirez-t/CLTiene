import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import "./css/style.css";
import { FiltersProvider } from './FiltersContext';

function App() {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const desubscribir = onAuthStateChanged(auth, (user) => {
            setUsuario(user);
            setCargando(false);
        });
        return () => desubscribir();
    }, []);

    if (cargando) return <div className="loading">Cargando...</div>;

    return (
        <Router>
            <Routes>
                <Route path="/login" element={!usuario ? <Login /> : <Navigate to="/" />} />
                <Route path="/" element={usuario ? <FiltersProvider>
                    <Dashboard />
                </FiltersProvider> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}
export default App;