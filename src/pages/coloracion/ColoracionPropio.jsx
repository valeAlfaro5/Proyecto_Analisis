import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Link, useNavigate } from 'react-router';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AiOutlineTrophy, AiFillCalendar, AiFillMerge, AiOutlinePartition } from "react-icons/ai";
import { IoIosColorPalette } from "react-icons/io";
import { IoInformationCircle } from "react-icons/io5"
import { useState } from 'react';
import { AlgoritmoVoraz } from "@backend/voraz.js";
import { Play } from 'lucide-react';

// Componente de fondo animado para el tutorial
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-orange-500/20"></div>
    {/* Luces animadas */}
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-orange-400 rounded-full animate-pulse opacity-30"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 2}s`
        }}
      />
    ))}
    {[...Array(8)].map((_, i) => (
      <div
        key={`orange-${i}`}
        className="absolute w-3 h-3 bg-orange-300 rounded-full animate-ping opacity-20"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 4}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }}
      />
    ))}
  </div>
);

//se encarga de cambiar los colores
const createSvgPinIcon = (color) =>
  L.divIcon({
    className: '',
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="48" viewBox="0 0 24 36">
        <path d="M12 0C6.5 0 2 4.5 2 10c0 7.5 10 26 10 26s10-18.5 10-26c0-5.5-4.5-10-10-10z"
          fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="12" cy="10" r="4" fill="white"/>
      </svg>
    `,
    iconSize: [30, 40],
    iconAnchor: [15, 48],
    popupAnchor: [0, -40],
  });

const coloracion = (carrera, edges) => {
  //llama a mi algoritmo 
  const colorMap = AlgoritmoVoraz(carrera, edges);
  return (
    <>
      {carrera.map((gp) => (
        <Marker key={gp.id} position={[gp.x, gp.y]} icon={createSvgPinIcon(colorMap.coloracion[gp.id])}>
          {edges.map((edge, index) => {
            const source = carrera.find(c => c.id === edge.source);
            const target = carrera.find(c => c.id === edge.target);

            if (!source || !target) return null;

            return (
              <Polyline
                key={index}
                positions={[[source.x, source.y], [target.x, target.y]]}
                pathOptions={{ color: '#ff6600', weight: 2, opacity: 0.8 }}
              />
            );
          })}
          <Popup>
            <div className="text-center">
              <strong>{gp.name}</strong><br />
              <span className="text-sm text-gray-600">
                Semana: {colorMap.coloracion[gp.id] === '#fff9c4' ? '1' : 
                        colorMap.coloracion[gp.id] === '#fecaca' ? '2' : 
                        colorMap.coloracion[gp.id] === '#bfdbfe' ? '3' : '4'}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

// Panel de información del grafo
const GraphInfo = ({ isVisible, onToggle, currentSchedule }) => (
  <div className={`fixed right-4 top-20 z-[999] transition-all duration-300 ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
    <div className="bg-slate-900/95 backdrop-blur-lg border border-orange-500/30 rounded-xl p-6 max-w-sm shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <IoInformationCircle className="mr-2 text-orange-400" />
          Información del Grafo
        </h3>
        <button 
          onClick={onToggle}
          className="text-orange-400 hover:text-orange-300 transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-4 text-sm text-gray-300">
        <div>
          <h4 className="font-semibold text-orange-400 mb-2">¿Qué representa este grafo?</h4>
          <p className="leading-relaxed">
            Cada <strong className="text-white">punto</strong> es una carrera de F1 y cada <strong className="text-orange-400">línea</strong> conecta carreras consecutivas en el calendario.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold text-orange-400 mb-2">Coloración por Semanas</h4>
          <p className="leading-relaxed mb-3">
            Los colores indican la semana del mes en que se realizará cada carrera, evitando conflictos de programación.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-yellow-200"></div>
              <span className="text-xs">Semana 1</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-200"></div>
              <span className="text-xs">Semana 2</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-200"></div>
              <span className="text-xs">Semana 3</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-200"></div>
              <span className="text-xs">Semana 4</span>
            </div>
          </div>
        </div>
        
        {currentSchedule && (
          <div>
            <h4 className="font-semibold text-orange-400 mb-2">Horario Actual</h4>
            <p className="text-white font-medium">{currentSchedule}</p>
          </div>
        )}
        
        <div className="pt-2 border-t border-orange-500/30">
          <p className="text-xs text-gray-400 leading-relaxed">
            <strong>Algoritmo:</strong> Coloración voraz que asigna el menor color posible a cada carrera sin conflictos con carreras adyacentes.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Botón flotante para mostrar información
const InfoButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed right-4 top-4 z-[999] bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
  >
    <IoInformationCircle size={24} />
  </button>
);

//espacio izquierdo encargado de los botones
const DropdownGrandPrix = ({ onMostrarGrafo, onNuevoGrafo, onMostrarGrafo2 }) => {
  const carreras = [
    "Gran Premio de Australia 🇦🇺", "Gran Premio de China 🇨🇳", "Gran Premio de Japón 🇯🇵",
    "Gran Premio de Bahrein 🇧🇭", "Gran Premio de Arabia Saudita 🇸🇦", "Gran Premio de Miami 🇺🇸",
    "Gran Premio de Italia (Imola) 🇮🇹", "Gran Premio de Monaco 🇲🇨", "Gran Premio de España 🇪🇸",
    "Gran Premio de Madrid 🇪🇸", "Gran Premio de Canadá 🇨🇦", "Gran Premio de Austria 🇦🇹",
    "Gran Premio de Gran Bretaña 🇬🇧", "Gran Premio de Bélgica 🇧🇪", "Gran Premio de Hungría 🇭🇺",
    "Gran Premio de Países Bajos 🇳🇱", "Gran Premio de Italia (Monza)🇮🇹", "Gran Premio de Azerbaiyán 🇦🇿",
    "Gran Premio de Singapur 🇸🇬", "Gran Premio de Estados Unidos 🇺🇸", "Gran Premio de México 🇲🇽",
    "Gran Premio de Brasil 🇧🇷", "Gran Premio de Las Vegas 🇺🇸", "Gran Premio de Qatar 🇶🇦",
    "Gran Premio de Abu Dhabi 🇦🇪"
  ];
  
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  return (
    <div className="w-full max-w-xs space-y-4">
      {/* Lista de Colores */}
      <div className="relative">
        <button 
          className='flex items-center w-full px-4 py-3 text-sm font-medium text-white bg-slate-800/80 backdrop-blur-lg rounded-xl hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 border border-slate-700/50' 
          onClick={() => setIsOpen2(!isOpen2)}
        >
          <IoIosColorPalette className="w-5 h-5 text-orange-400 mr-3" />
          Leyenda de Semanas
        </button>

        {isOpen2 && (
          <div className="absolute z-20 mt-2 w-full bg-slate-800/95 backdrop-blur-lg border border-slate-600/50 rounded-xl shadow-2xl">
            <div className="p-4 space-y-3">
              {[
                { color: 'bg-yellow-200', label: 'Semana 1', border: 'border-yellow-300' },
                { color: 'bg-red-200', label: 'Semana 2', border: 'border-red-300' },
                { color: 'bg-blue-200', label: 'Semana 3', border: 'border-blue-300' },
                { color: 'bg-green-200', label: 'Semana 4', border: 'border-green-300' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full ${item.color} border-2 ${item.border} shadow-sm`}></div>
                  <span className="text-sm text-white font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lista de Grandes Premios */}
      <div className="relative">
        <button 
          className='flex items-center w-full px-4 py-3 text-sm font-medium text-white bg-slate-800/80 backdrop-blur-lg rounded-xl hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 border border-slate-700/50' 
          onClick={() => setIsOpen(!isOpen)}
        >
          <AiOutlineTrophy className="w-5 h-5 text-orange-400 mr-3" />
          Grandes Premios 2025
        </button>

        {isOpen && (
          <div className="absolute z-20 mt-2 w-full bg-slate-800/95 backdrop-blur-lg border border-slate-600/50 rounded-xl shadow-2xl">
            <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-slate-700">
              {carreras.map((gp, index) => (
                <div
                  key={index}
                  className="px-4 py-2 text-sm text-white hover:bg-orange-500/20 hover:text-orange-300 transition-colors cursor-pointer first:rounded-t-xl last:rounded-b-xl"
                >
                  {gp}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Botones de Horarios */}
      <button 
        className='flex items-center w-full px-4 py-3 text-sm font-medium text-white bg-slate-800/80 backdrop-blur-lg rounded-xl hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 border border-slate-700/50' 
        onClick={onMostrarGrafo}
      >
        <AiFillCalendar className="w-5 h-5 text-orange-400 mr-3" />
        Horario 2025
      </button>

      <button 
        className='flex items-center w-full px-4 py-3 text-sm font-medium text-white bg-slate-800/80 backdrop-blur-lg rounded-xl hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 border border-slate-700/50' 
        onClick={onMostrarGrafo2}
      >
        <AiOutlinePartition className="w-5 h-5 text-orange-400 mr-3" />
        Horario 2026
      </button>

      <button 
        className='flex items-center w-full px-4 py-3 text-sm font-medium text-white bg-slate-800/80 backdrop-blur-lg rounded-xl hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 border border-slate-700/50' 
        onClick={onNuevoGrafo}
      >
        <AiFillMerge className="w-5 h-5 text-orange-400 mr-3" />
        Horario Aleatorio
      </button>
    </div>
  );
};

//carreras con id, nombre y coordenadas para poder tomar de referencia para el grafo
const carrera = [
  { id: 1, name: "Gran Premio de Australia 🇦🇺", x: -37.8497, y: 144.9680 },
  { id: 2, name: "Gran Premio de China 🇨🇳", x: 31.3389, y: 121.2236 },
  { id: 3, name: "Gran Premio de Japón 🇯🇵", x: 34.8431, y: 136.5416 },
  { id: 4, name: "Gran Premio de Bahrein 🇧🇭", x: 26.0325, y: 50.5106 },
  { id: 5, name: "Gran Premio de Arabia Saudita 🇸🇦", x: 21.6333, y: 39.1041 },
  { id: 6, name: "Gran Premio de Miami 🇺🇸", x: 25.9580, y: -80.2389 },
  { id: 7, name: "Gran Premio de Italia (Imola) 🇮🇹", x: 44.3439, y: 11.7161 },
  { id: 8, name: "Gran Premio de Monaco 🇲🇨", x: 43.7347, y: 7.4206 },
  { id: 9, name: "Gran Premio de España 🇪🇸", x: 41.5700, y: 2.2611 },
  { id: 10, name: "Gran Premio de Canadá 🇨🇦", x: 45.5047, y: -73.5261 },
  { id: 11, name: "Gran Premio de Austria 🇦🇹", x: 47.2197, y: 14.7647 },
  { id: 12, name: "Gran Premio de Gran Bretaña 🇬🇧", x: 52.0733, y: -1.0147 },
  { id: 13, name: "Gran Premio de Bélgica 🇧🇪", x: 50.4372, y: 5.9714 },
  { id: 14, name: "Gran Premio de Hungría 🇭🇺", x: 47.5789, y: 19.2486 },
  { id: 15, name: "Gran Premio de Países Bajos 🇳🇱", x: 52.3883, y: 4.5400 },
  { id: 16, name: "Gran Premio de Italia (Monza) 🇮🇹", x: 45.6156, y: 9.2811 },
  { id: 17, name: "Gran Premio de Azerbaiyán 🇦🇿", x: 40.3725, y: 49.8533 },
  { id: 18, name: "Gran Premio de Singapur 🇸🇬", x: 1.2914, y: 103.8642 },
  { id: 19, name: "Gran Premio de Estados Unidos 🇺🇸", x: 30.1328, y: -97.6411 },
  { id: 20, name: "Gran Premio de México 🇲🇽", x: 19.4042, y: -99.0900 },
  { id: 21, name: "Gran Premio de Brasil 🇧🇷", x: -23.7036, y: -46.6997 },
  { id: 22, name: "Gran Premio de Las Vegas 🇺🇸", x: 36.1147, y: -115.1728 },
  { id: 23, name: "Gran Premio de Qatar 🇶🇦", x: 25.5304, y: 51.5105 },
  { id: 24, name: "Gran Premio de Abu Dhabi 🇦🇪", x: 24.4672, y: 54.6031 },
  { id: 25, name: "Gran Premio de Madrid 🇪🇸", x: 40.4674, y: -3.6158 },
]

//horario 2025
const edgesOriginal = [
  { source: 1, target: 2 }, { source: 2, target: 3 }, { source: 3, target: 4 },
  { source: 4, target: 5 }, { source: 5, target: 6 }, { source: 6, target: 7 },
  { source: 7, target: 8 }, { source: 8, target: 9 }, { source: 9, target: 10 },
  { source: 10, target: 11 }, { source: 11, target: 12 }, { source: 12, target: 13 },
  { source: 13, target: 14 }, { source: 14, target: 15 }, { source: 15, target: 16 },
  { source: 16, target: 17 }, { source: 17, target: 18 }, { source: 18, target: 19 },
  { source: 19, target: 20 }, { source: 20, target: 21 }, { source: 21, target: 22 },
  { source: 22, target: 23 }, { source: 23, target: 24 },
];

//horario 2026
const edges2026 = [
  { source: 1, target: 2 }, { source: 2, target: 3 }, { source: 3, target: 4 },
  { source: 4, target: 5 }, { source: 5, target: 6 }, { source: 6, target: 10 },
  { source: 10, target: 8 }, { source: 8, target: 9 }, { source: 9, target: 11 },
  { source: 11, target: 12 }, { source: 12, target: 13 }, { source: 13, target: 14 },
  { source: 14, target: 15 }, { source: 15, target: 7 }, { source: 7, target: 25 },
  { source: 25, target: 17 }, { source: 17, target: 18 }, { source: 18, target: 19 },
  { source: 19, target: 20 }, { source: 20, target: 21 }, { source: 21, target: 22 },
  { source: 22, target: 23 }, { source: 23, target: 24 },
];

export default function ColoracionPropio() {
  const navigate = useNavigate();
  const [mostrarGrafo, setMostrarGrafo] = useState(false);
  const [mostrarGrafo2, setMostrarGrafo2] = useState(false);
  const [nuevoGrafo, setNuevoGrafo] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [showPopup2, setShowPopup2] = useState(false);
  const [showPopup3, setShowPopup3] = useState(false);
  const [edges, setEdges] = useState([]);
  const [edges1, setEdges1] = useState([]);
  const [showGraphInfo, setShowGraphInfo] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);

  //crear aristas random de las predifinidas
  const handleRandomAristas = () => {
    setEdges1([]);
    const newEdges = [];
    for (let i = 0; i < 25; i++) {
      const source = Math.floor(Math.random() * carrera.length);
      const target = Math.floor(Math.random() * carrera.length);
      if (source !== target) {
        newEdges.push({ source: carrera[source].id, target: carrera[target].id });
      }
    }
    return newEdges;
  }

  const handleMostrar2025 = () => {
    setEdges([]);
    setEdges(edgesOriginal);
    setMostrarGrafo(true);
    setMostrarGrafo2(false);
    setNuevoGrafo(false);
    setCurrentSchedule("Temporada 2025 - Horario Oficial");
  };

  const handleMostrar2026 = () => {
    setEdges([]);
    setEdges(edges2026);
    setMostrarGrafo(false);
    setMostrarGrafo2(true);
    setNuevoGrafo(false);
    setCurrentSchedule("Temporada 2026 - Horario Propuesto");
  };

  const handleNuevoHorario = () => {
    setEdges([]);
    setEdges(handleRandomAristas());
    setMostrarGrafo(false);
    setMostrarGrafo2(false);
    setNuevoGrafo(true);
    setCurrentSchedule("Horario Aleatorio Generado");
  };

  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-black to-orange-500/20 text-white overflow-hidden'>
      
      {/* Tutorial Popups con fondo animado */}
      {(showPopup || showPopup2 || showPopup3) && <AnimatedBackground />}
      
      {showPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="bg-slate-900/95 backdrop-blur-xl text-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center border border-orange-500/30">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AiOutlineTrophy className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-orange-400">Bienvenido al Calendario F1</h2>
            <p className="mb-6 text-gray-300 leading-relaxed">
              Explora la visualización de horarios de Formula 1 usando coloración de grafos para optimizar la programación de carreras.
            </p>
            <button
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              onClick={() => { setShowPopup(false); setShowPopup2(true); }}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {showPopup2 && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="bg-slate-900/95 backdrop-blur-xl text-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center border border-orange-500/30">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <IoInformationCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-orange-400">Coloración de Grafos</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              Cada punto representa una carrera y las líneas muestran el orden consecutivo del calendario.
            </p>
            <p className="mb-6 text-gray-300 leading-relaxed">
              Los colores indican la semana del mes para evitar conflictos de programación.
            </p>
            <button
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              onClick={() => { setShowPopup2(false); setShowPopup3(true); }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {showPopup3 && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="bg-slate-900/95 backdrop-blur-xl text-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center border border-orange-500/30">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <IoIosColorPalette className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-orange-400">Sistema de Semanas</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              Cada mes tiene un mínimo de 2 carreras distribuidas en 4 semanas posibles.
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { color: 'bg-yellow-200', label: 'Semana 1' },
                { color: 'bg-red-200', label: 'Semana 2' },
                { color: 'bg-blue-200', label: 'Semana 3' },
                { color: 'bg-green-200', label: 'Semana 4' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${item.color} border border-gray-400`}></div>
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>

            <button
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              onClick={() => setShowPopup3(false)}
            >
              ¡Comenzar!
            </button>
          </div>
        </div>
      )}

      {/* Botón de información flotante */}
      <InfoButton onClick={() => setShowGraphInfo(true)} />

      {/* Panel de información del grafo */}
      <GraphInfo 
        isVisible={showGraphInfo} 
        onToggle={() => setShowGraphInfo(false)}
        currentSchedule={currentSchedule}
      />

      {/* Contenido principal */}
      <div className="flex-1 p-6 h-screen overflow-hidden">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
          🏎️ Calendario F1 2025 - Coloración de Grafos
        </h1>

        <div className="flex gap-6 h-[calc(100vh-150px)]">
          {/* Panel de control lateral */}
          <div className="w-80 flex-shrink-0">
            <DropdownGrandPrix 
              onMostrarGrafo={handleMostrar2025} 
              onMostrarGrafo2={handleMostrar2026} 
              onNuevoGrafo={handleNuevoHorario} 
            />
          </div>

          {/* Mapa */}
          <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
            <MapContainer 
              center={[20, 0]} 
              zoom={2} 
              style={{ height: '100%', width: '100%' }}
              className="bg-slate-900"
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="opacity-80"
              />
              
              {/* Marcadores base de las carreras */}
              {carrera.map((gp) => (
                <Marker key={`base-${gp.id}`} position={[gp.x, gp.y]}>
                  <Popup>
                    <div className="text-center">
                      <strong>{gp.name}</strong><br/>
                      <span className="text-sm text-gray-600">Ubicación del circuito</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* Grafo coloreado según el horario seleccionado */}
              {(mostrarGrafo || mostrarGrafo2 || nuevoGrafo) && (
                <div>
                  {coloracion(carrera, edges)}
                </div>
              )}
            </MapContainer>
          </div>
        </div>

        {/* Botón de regreso */}
        <div className="text-center mt-6">
          <Link
            onClick={() => navigate(-1)}
            className="group inline-flex items-center space-x-4 px-8 py-4 text-lg font-bold text-white/90 rounded-full border-2 border-orange-500/30 hover:border-orange-500/60 hover:text-white backdrop-blur-lg bg-slate-800/40 hover:bg-slate-800/60 transition-all duration-500 hover:scale-105"
          >
            <div className="w-auto h-auto p-2 rounded-full bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/40 transition-colors duration-300">
              <Play size={16} className="scale-x-[-1] text-orange-400" />
            </div>
            <span className="tracking-wider">Regresar</span>
          </Link>
        </div>
      </div>
    </div>
  );
}