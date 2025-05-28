import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from './pages/Inicio';

function App() {
  return (
    <div >
      <Router>
        <Routes>

        {/* paginas que no necesitan sidebar */}
        <Route path='/' element={<Login/>}/>
        <Route path='/inicio' element={<Inicio/>}/>

        {/* paginas que necesitan sidebar */}
          <Route path='/' element={<Layout/>}>
           
           
            </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;