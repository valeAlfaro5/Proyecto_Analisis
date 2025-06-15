
import { BrowserRouter, Routes, Route } from 'react-router'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Menu from './pages/Menu.jsx'
import Particion from './pages/Particion.jsx';
import Algoritmo_Propio from './pages/Problem_Partition/Algoritmo_Propio.jsx'
import Algoritmo_Comunidad from './pages/Problem_Partition/Algoritmo_Comunidad.jsx'
import ColoracionGrafosComunidad from './pages/coloracion/ColoracionComunidad.jsx';
import ColoracionMenu from './pages/coloracion/ColoracionMenu.jsx'
import ColoracionPropio from './pages/coloracion/ColoracionPropio.jsx'
import HamiltonianMenu from './pages/hamiltonian cycles/HamiltonianMenu.jsx'
import HamiltonianCommunity from './pages/hamiltonian cycles/HamiltonianCommunity.jsx'
import HamiltonianOwn from './pages/hamiltonian cycles/HamiltonianOwn.jsx'
import { AudioProvider } from './context/AudioProvider.jsx'

createRoot(document.getElementById('root')).render(
  <AudioProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/particion" element={<Particion />} />
        <Route path="/coloracion-grafos-comunidad" element={<ColoracionGrafosComunidad />} />
        <Route path="/coloracion-grafos-propio" element={<ColoracionPropio />} />
        <Route path="/coloracion-grafos-menu" element={<ColoracionMenu />} />
        <Route path="/hamiltonian-menu" element={<HamiltonianMenu />} />
        <Route path='/hamiltonian-community' element={<HamiltonianCommunity />} />
        <Route path="/Algoritmo_Propio" element={<Algoritmo_Propio />} />
        <Route path="/Algoritmo_Comunidad" element={<Algoritmo_Comunidad />} />
        <Route path='/hamiltonian-own' element={<HamiltonianOwn />} />
      </Routes>
    </BrowserRouter>
  </AudioProvider>
)
