import './App.css'

import { Link } from 'react-router';
import unitecLogo from './assets/unitec.jpeg' // asegúrate de tener este archivo

function App() {
  return (
    <div className="cover-container">
      <img src={unitecLogo} alt="Logo Unitec" className="unitec-logo" />
      <h1 className="title">Valeria Alfaro</h1>
      <h1 className="title">Harold Diaz</h1>
      <h1 className="title">Joe Corrales</h1>
      <Link to="/menu" className="menu-button">
        Menú
      </Link>
    </div>
  )
}

export default App;
