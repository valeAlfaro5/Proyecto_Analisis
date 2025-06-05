
import { BrowserRouter, Routes, Route } from 'react-router'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Menu from './pages/Menu.jsx'
import Particion from './pages/Particion.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/particion" element={<Particion />} />
    </Routes>
  </BrowserRouter>
)
