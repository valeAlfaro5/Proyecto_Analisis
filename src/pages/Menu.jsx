import { Link } from 'react-router';
import './Menu.css'

function Menu() {
  return (
    <div className="menu-container">
      <h1>Menú Principal</h1>
      <div className="menu-options">
        <button className="menu-option">
          <Link to="/coloracion-grafos-comunidad" className="menu-button">
            Análisis de Algoritmo de Coloración de Grafos
          </Link>
        </button>

        <button className="menu-option">
          <Link to="/particion" className="menu-button">
            Análisis de Algoritmo de Partición
          </Link>
        </button>
        
        <button className="menu-option">
          Análisis de Algoritmo de Ciclos Hamiltonianos
        </button>
        <Link to="/" className="menu-button">
            Regresar
      </Link>
      </div>
    </div>
  )
}

export default Menu;
