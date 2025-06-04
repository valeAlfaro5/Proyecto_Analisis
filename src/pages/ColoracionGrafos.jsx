import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function ColoracionGrafos() {
  return (
    <div className='flex items-center justify-center h-screen'> 
      <h1 className="font-bold font-Montserrat mx-auto flex items-center ">
      Calendario Formula 1 2025
    </h1>


    <MapContainer center={[51.505, -0.09]} zoom={2} style={{ height: '85vh', width: 'calc(100vw - 100px)', marginLeft: '100px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>Hola desde aquí!</Popup>
      </Marker>
    </MapContainer>
    </div>
  );
}
export default ColoracionGrafos;