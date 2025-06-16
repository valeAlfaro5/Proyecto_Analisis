import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Link, useNavigate } from 'react-router';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AiOutlineTrophy , AiFillCalendar, AiFillMerge, AiOutlinePartition } from "react-icons/ai";
import { IoIosColorPalette } from "react-icons/io";
import { useState } from 'react';
// import {ReactFlow, addEdge, useNodesState, useEdgesState} from "@xyflow/react";
import { AlgoritmoVoraz } from "@backend/voraz.js";
import { Play } from 'lucide-react';

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

const coloracion =(carrera, edges) => {

//llama a mi algoritmo 
  const colorMap = AlgoritmoVoraz(carrera, edges);
  return(
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
              pathOptions={{ color: 'black', weight: 3 }}
            />
          );
        })}
      <Popup>
        {gp.name}<br/>
      </Popup>
    </Marker>
  ))}
  </>
);
}


//espacio izquierdo encargado de los botones
const DropdownGrandPrix = ({onMostrarGrafo, onNuevoGrafo, onMostrarGrafo2}) => {
  const carreras = [
    "Gran Premio de Australia 🇦🇺",
    "Gran Premio de China 🇨🇳",
    "Gran Premio de Japón 🇯🇵",
    "Gran Premio de Bahrein 🇧🇭",
    "Gran Premio de Arabia Saudita 🇸🇦",
    "Gran Premio de Miami 🇺🇸",
    "Gran Premio de Italia (Imola) 🇮🇹",
    "Gran Premio de Monaco 🇲🇨",
    "Gran Premio de España 🇪🇸",
    "Gran Premio de Madrid 🇪🇸",
    "Gran Premio de Canadá 🇨🇦",
    "Gran Premio de Austria 🇦🇹",
    "Gran Premio de Gran Bretaña 🇬🇧",
    "Gran Premio de Bélgica 🇧🇪",
    "Gran Premio de Hungría 🇭🇺",
    "Gran Premio de Países Bajos 🇳🇱",
    "Gran Premio de Italia (Monza)🇮🇹",
    "Gran Premio de Azerbaiyán 🇦🇿",
    "Gran Premio de Singapur 🇸🇬",
    "Gran Premio de Estados Unidos 🇺🇸",
    "Gran Premio de México 🇲🇽",
    "Gran Premio de Brasil 🇧🇷",
    "Gran Premio de Las Vegas 🇺🇸",
    "Gran Premio de Qatar 🇶🇦",
    "Gran Premio de Abu Dhabi 🇦🇪",

  ];
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
 
  

  return (
      <div className="relative w-full max-w-xs mt-50">
        <div>
          <button className='flex  w-full px-2 py-2 text-s font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2' onClick={() => setIsOpen2(!isOpen2)}>
            <IoIosColorPalette  className="w-6 h-6 text-yellow-300 mr-2 ml-2" />
             Lista de Colores
          </button>

          {isOpen2 && (
            <div className="absolute z-20 mt-2 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
              <ul className="max-h-64 overflow-y-auto divide-y divide-gray-700 p-4">
                <li className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-yellow-200 border border-gray-300"></div>
                  <span className="text-sm text-white">Semana 1</span>
                </li>
                <li className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-red-200 border border-gray-300"></div>
                  <span className="text-sm text-white">Semana 2</span>
                </li>
                <li className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-200 border border-gray-300"></div>
                  <span className="text-sm text-white">Semana 3</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-green-200 border border-gray-300"></div>
                  <span className="text-sm text-white">Semana 4</span>
                </li>
              </ul>
            </div>
          )}

        </div>
        <div className='mt-5'>
        <button className='flex  w-full px-2 py-2 text-s font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2' onClick={() => setIsOpen(!isOpen)}>
            <AiOutlineTrophy className="w-6 h-6 text-yellow-300 mr-2 ml-2" />
             Lista de Grandes Premios 2025
        </button>
        

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
        <ul className="max-h-64 overflow-y-auto divide-y divide-gray-700">
          {carreras.map((gp, index) => (
            <li
              key={index}
              className="px-4 py-2 text-sm text-white hover:bg-yellow-500 hover:text-black cursor-pointer"
            >
              {gp}
            </li>
          ))}
        </ul>
      </div>)}
      
      
      </div>

        <div className='mt-5'>
         <button className='flex  w-full px-2 py-2 text-s font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2'  onClick={onMostrarGrafo}>
          <AiFillCalendar className="w-6 h-6 text-yellow-300 mr-2 ml-2" />
             Horario Predeterminado 2025
        </button></div>

        <div className='mt-5'>
         <button className='flex  w-full px-2 py-2 text-s font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2'  onClick={onMostrarGrafo2}>
          <AiOutlinePartition className="w-6 h-6 text-yellow-300 mr-2 ml-2" />
             Horario Predeterminado 2026
        </button></div>

        <div className='mt-5'>
         <button className='flex  w-full px-2 py-2 text-s font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2'  onClick={onNuevoGrafo}>
          <AiFillMerge className="w-6 h-6 text-yellow-300 mr-2 ml-2" />
             Crear Nuevo Horario
        </button></div>
    </div>
  );
};

//carreras con id, nombre y coordenadas para poder tomar de referencia para el grafo
const carrera =[
    {id: 1, name: "Gran Premio de Australia 🇦🇺", x:  -37.8497, y:144.9680 },
    {id: 2, name: "Gran Premio de China 🇨🇳", x: 31.3389,y:  121.2236 },
    {id: 3, name: "Gran Premio de Japón 🇯🇵", x: 34.8431,y: 136.5416 },
    {id: 4, name: "Gran Premio de Bahrein 🇧🇭", x: 26.0325,y: 50.5106 },
    {id: 5, name: "Gran Premio de Arabia Saudita 🇸🇦", x: 21.6333, y: 39.1041 },
    {id: 6, name: "Gran Premio de Miami 🇺🇸", x: 25.9580, y: -80.2389 },
    {id: 7, name: "Gran Premio de Italia (Imola) 🇮🇹", x:  44.3439, y: 11.7161 },
    {id: 8, name: "Gran Premio de Monaco 🇲🇨", x:43.7347, y: 7.4206 },
    {id: 9, name: "Gran Premio de España 🇪🇸", x: 41.5700, y:2.2611 },
    {id: 10, name: "Gran Premio de Canadá 🇨🇦", x:  45.5047, y: -73.5261 },
    {id: 11, name: "Gran Premio de Austria 🇦🇹", x: 47.2197, y: 14.7647 },
    {id: 12, name: "Gran Premio de Gran Bretaña 🇬🇧", x:52.0733,y:  -1.0147 },
    {id: 13, name: "Gran Premio de Bélgica 🇧🇪", x: 50.4372, y:5.9714},
    {id: 14, name: "Gran Premio de Hungría 🇭🇺", x:  47.5789, y: 19.2486 },
    {id: 15, name: "Gran Premio de Países Bajos 🇳🇱",  x:  52.3883, y:4.5400},
    {id: 16, name: "Gran Premio de Italia (Monza) 🇮🇹", x: 45.6156, y:9.2811 },
    {id: 17, name: "Gran Premio de Azerbaiyán 🇦🇿", x: 40.3725, y:49.8533 },
    {id: 18, name: "Gran Premio de Singapur 🇸🇬", x:1.2914, y: 103.8642 },
    {id: 19, name: "Gran Premio de Estados Unidos 🇺🇸", x:30.1328,y: -97.6411 },
    {id: 20, name: "Gran Premio de México 🇲🇽", x:19.4042, y:-99.0900 },
    {id: 21, name: "Gran Premio de Brasil 🇧🇷", x:  -23.7036, y: -46.6997 },
    {id: 22, name: "Gran Premio de Las Vegas 🇺🇸", x: 36.1147, y:-115.1728 },
    {id: 23, name: "Gran Premio de Qatar 🇶🇦", x:25.5304,y:51.5105 },
    {id: 24, name: "Gran Premio de Abu Dhabi 🇦🇪",  x:  24.4672, y:54.6031 },
    {id: 25, name: "Gran Premio de Madrid 🇪🇸", x: 40.4674, y: -3.6158},
]

//horario 2025
const edgesOriginal =[
  //source == actual y target== donde se dirige
    { source: 1, target: 2 },
    { source: 2, target: 3 },
    { source: 3, target: 4 },
    { source: 4, target: 5 },
    { source: 5, target: 6 },
    { source: 6, target: 7 },
    { source: 7, target: 8 },
    { source: 8, target: 9 },
    { source: 9, target: 10 },
    { source: 10, target: 11 },
    { source: 11, target: 12 },
    { source: 12, target: 13 },
    { source: 13, target: 14 },
    { source: 14, target: 15 },
    { source: 15, target: 16 },
    { source: 16, target: 17 },
    { source: 17, target: 18 },
    { source: 18, target: 19 },
    { source: 19, target: 20 },
    { source: 20, target: 21 },
    { source: 21, target: 22 },
    { source: 22, target: 23 },
    { source: 23, target: 24 },
]; 

//horario 2026
const edges2026 =[
  {source: 1, target: 2 },
  {source: 2, target: 3 },
  {source: 3, target: 4},
  {source: 4, target: 5},
  {source: 5, target: 6},
  {source: 6, target: 10},
  {source: 10, target: 8},
  {source: 8, target: 9},
  {source: 9, target: 11},
  {source: 11, target: 12},
  {source: 12, target: 13},
  {source: 13, target: 14},
  {source: 14, target:15},
  {source: 15, target:7},
  {source: 7, target: 25},
  {source: 25, target: 17},
  {source: 17, target: 18},
  {source: 18, target: 19},
  {source: 19, target: 20},
  {source: 20, target: 21},
  {source: 21, target: 22},
  {source: 22, target: 23},
  {source: 23, target: 24},
];




export default function ColoracionPropio() {
    const navigate = useNavigate();
    const [mostrarGrafo, setMostrarGrafo] = useState(false);
    const [mostrarGrafo2, setMostrarGrafo2] = useState(false);
    const [nuevoGrafo, setNuevoGrafo] = useState(false);
    const [showPopup, setShowPopup] = useState(true); 
    const [showPopup2, setShowPopup2] = useState(false); 
    const [showPopup3, setShowPopup3] = useState(false); 
    const [edges , setEdges] = useState([]);
    const [edges1, setEdges1] = useState([]);

    //crear aristas random de las predifinidas
    const handleRandomAristas = () => {
      setEdges1([]);
      let max =0, min=0, source =0, target =0;
      // const numEdges = Math.floor(Math.random() * (carrera.length - 1)) + 1;
      for (let i = 0; i < 25; i++) {
        min = Math.ceil(i);
        max = Math.floor(carrera.length - 1); 
        source = Math.floor(Math.random() * (max - min + 1)) + min;//funcion random para obtener un numero entre 0 y el numero de carreras
        target = Math.floor(Math.random() * (max - min + 1)) + min;//funcion random para obtener un numero entre 0 y el numero de carreras
        //verifica que no se repita la arista
        if (source !== target) {
          edges1.push({ source: carrera[source].id, target: carrera[target].id });
        }
      }
      // setEdges(edges1);
      return edges1;
    }
   

    const handleMostrar2025 = () => {
      setEdges([]);               // borra cualquier grafo previo
      setEdges(edgesOriginal);    // reemplaza con las aristas 2025
      setMostrarGrafo(true);
      setMostrarGrafo2(false);
      setNuevoGrafo(false);
    };

    const handleMostrar2026 = () => {
      setEdges([]);               
      setEdges(edges2026);
      setMostrarGrafo(false);
      setMostrarGrafo2(true);
      setNuevoGrafo(false);
    };

    const handleNuevoHorario = () => {
      setEdges([]);
      setEdges(handleRandomAristas()); // borra y pone nuevas de golpe
      setMostrarGrafo(false);
      setMostrarGrafo2(false);
      setNuevoGrafo(true);
    };


   
    return (
        
    <div className='flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-400 via-black to-orange-400 text-white p-6 ' >
        {showPopup && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white text-black rounded-lg shadow-lg p-6 max-w-md w-full text-center">
              <h2 className="text-xl font-semibold mb-4">Bienvenido al Calendario Formula 1 2025</h2>
              <p className="mb-4">Aquí podrás visualizar el horario de las carreras de Formula 1 2025.</p>
              <button
                className="mt-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
                onClick={() => {setShowPopup(false); setShowPopup2(true);}}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {showPopup2 && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white text-black rounded-lg shadow-lg p-6 max-w-md w-full text-center">
              <h2 className="text-xl font-semibold mb-4">Coloración de Grafos</h2>
              <p className="mb-4">Inicialmente veras la ubicación de cada carrera. </p>
              <p>Para la coloración de grafo podras explorar con los horarios de los años 2025 y 2026, asi como crear ordenes aleatorios para futuras carreras.</p>
              <button
                className="mt-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
                onClick={() => {setShowPopup2(false); setShowPopup3(true);}}
              >
                Comenzar
              </button>
            </div>
          </div>
        )}

        {showPopup3 && ( 
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white text-black rounded-lg shadow-lg p-6 max-w-md w-full text-center">
              <h2 className="text-xl font-semibold mb-4">Coloración de Grafos</h2>
              <p className="mb-4"> En este simulacro, cada mes se corren minimo dos carreras.</p>
                <p>Trabajamos con 4 colores que representan la semana de cada mes en respectivo orden. </p>

              <div className="grid grid-cols-2 gap-4 justify-center items-center mb-4 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-yellow-100 border border-gray-300"></div>
                  <span className="text-sm">Semana 1</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-red-100 border border-gray-300"></div>
                  <span className="text-sm">Semana 2</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 border border-gray-300"></div>
                  <span className="text-sm">Semana 3</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 border border-gray-300"></div>
                  <span className="text-sm">Semana 4</span>
                </div>
              </div>

              <button
                className="mt-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
                onClick={() => setShowPopup3(false)}
              >
                Comenzar
              </button>
            </div>
          </div>
        )}



      <h1 className="font-bold mb-6 text-2xl text-white">
        📍 Calendario F1 2025 - Coloración de Grafos
      </h1>

      <div className="flex w-full max-w-6xl gap-6">
        <div className="w-1/3">
          <DropdownGrandPrix onMostrarGrafo={handleMostrar2025} onMostrarGrafo2={handleMostrar2026} onNuevoGrafo={handleNuevoHorario} />
        </div>

        {/* mapa */}
        <div className="w-5/6 h-[700px]">
          <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* recorre cada carrera y crea un marcador en el mapa */}
            {/* dibuja los marcadores de las carreras solo para que el usuario sepa sus ubicaciones*/}
            {carrera.map((gp) => (
              <Marker key={gp.id} position={[gp.x, gp.y]}>
                <Popup>
                  {gp.name}<br/>
                </Popup>
              </Marker>
            ))}
            {/* dibuja las aristas del grafo predeterminado */}
            {/* misma funcion de coloracion pero con diferentes arrelgos de aristas*/}
            {mostrarGrafo &&(
              <div>
                {coloracion(carrera, edges)}
              </div>
            )}
            {mostrarGrafo2 &&(
              <div>
                {coloracion(carrera, edges)}
              </div>
            )}
            {nuevoGrafo && (
                <div>
                  {coloracion(carrera, edges)}
                </div>
            )} 


          </MapContainer>
        </div>

       
      </div>
       <div className="text-center mt-5">
        <Link
            onClick={() => navigate(-1)}
            className={`group inline-flex items-center space-x-4 px-8 py-4 text-lg font-bold text-white/80 rounded-full border-2 border-black/20 hover:border-white/40 hover:text-white backdrop-blur-lg bg-white/5 hover:bg-white/10 transition-all duration-500 hover:scale-105 'translate-y-0 opacity-100'`}
            style={{ transitionDelay: '0.8s' }}
        >
            <div className="w-auto h-auto p-2 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
              <Play size={14} className="scale-x-[-1]" />
            </div>
            <span className="tracking-wider">Regresar</span>
        </Link>
    </div>
    </div>
  );
}