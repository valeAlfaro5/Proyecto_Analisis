import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from './pages/Inicio';
import ColoracionGrafos from './pages/ColoracionGrafos';
import 'leaflet/dist/leaflet.css';


function App() {
  return (
    <div >
      <Router>
        <Routes>

        {/* paginas que no necesitan sidebar */}
        
        <Route path='/inicio' element={<Inicio/>}/>
        <Route path='/coloracion-grafos' element={<ColoracionGrafos/>}/>

        {/* paginas que necesitan sidebar */}

           
        </Routes>
      </Router>
    </div>
  );
}

export default App;