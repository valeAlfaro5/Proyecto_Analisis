import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Link, useNavigate } from 'react-router';
import 'leaflet/dist/leaflet.css';
import { AiOutlineTrophy , AiFillCalendar, AiFillMerge } from "react-icons/ai";
import { IoIosColorPalette } from "react-icons/io";
import { useState } from 'react';
import { AlgoritmoVoraz } from "@backend/voraz.js";


const coloracion =(carrera, edgesOriginal) => {
  return(
    <>
  {carrera.map((gp) => (
    <Marker key={gp.id} position={[gp.x, gp.y]}>
      {edgesOriginal.map((edge, index) => {
          const source = carrera.find(c => c.id === edge.source);
          const target = carrera.find(c => c.id === edge.target);

          if (!source || !target) return null;

          return (
            <Polyline
              key={index}
              positions={[[source.x, source.y], [target.x, target.y]]
              }
              pathOptions={{ color: 'black', weight: 3 }}
            />
          );
        })}
      {/* al hacer click en el marcador se abre un popup con el nombre de la carrera y un boton para iniciar */}
      
      <Popup>
        {gp.name}<br/>
      </Popup>
    </Marker>
  ))}
  </>
);
}

// const coloracionGrafo = ({carrera, edges}) => {
//   const [selectGP, setSelectGP] = useState(null);

//   if (selectGP) {
//     const selectedGP = carrera.find(gp => gp.id === selectGP);
//     if (selectedGP) {
//       edges.push({ source: selectGP, target: selectedGP.id });
//       setSelectGP(null);
//     }else{
//       setSelectGP(selectGP);
//     }
//   }

//   return (
//     <>
//       {carrera.map((gp) => (
//         <Marker key={gp.id} position={[gp.x, gp.y]}>
//           {edges.map((edge, index) => {
//             const source = carrera.find(c => c.id === edge.source);
//             const target = carrera.find(c => c.id === edge.target);
//             if (!source || !target) return null;
//             return (
//               <Polyline
//                 key={index}
//                 positions={[[source.x, source.y], [target.x, target.y]]}
//                 pathOptions={{ color: 'black', weight: 3 }}
//               />
//             );
//           })}
//           <Popup>
//             {gp.name}<br/>        
//             <button className='px-2 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600' onClick={() => {setSelectGP(gp.id)}}>
//               Iniciar Carrera
//             </button>
//           </Popup>
//         </Marker>
//       ))}   
//     </>
//   );
// };

//lista para saber las carreras de la temporada 2025 de F1
const DropdownGrandPrix = ({onMostrarGrafo, onNuevoGrafo}) => {
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
                  <div className="w-6 h-6 rounded-full bg-red-200 border border-gray-300"></div>
                  <span className="text-sm text-white">Semana 1</span>
                </li>
                <li className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-200 border border-gray-300"></div>
                  <span className="text-sm text-white">Semana 2</span>
                </li>
                <li className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-green-200 border border-gray-300"></div>
                  <span className="text-sm text-white">Semana 3</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-yellow-200 border border-gray-300"></div>
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
         <button className='flex  w-full px-2 py-2 text-s font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2'  onClick={onNuevoGrafo}>
          <AiFillMerge className="w-6 h-6 text-yellow-300 mr-2 ml-2" />
             Crear Nuevo Horario
        </button></div>
    </div>
  );
};

//carreras con id, nombre y coordenadas para poder tomar de referencia para el grafo
const carrera =[
    {id: 1, name: "Gran Premio de Australia 🇦🇺", x:  -37.8136 , y:144.9631 },
    {id: 2, name: "Gran Premio de China 🇨🇳", x: 31.2304 ,y:  121.4737 },
    {id: 3, name: "Gran Premio de Japón 🇯🇵", x: 35.6762,y: 139.6503 },
    {id: 4, name: "Gran Premio de Bahrein 🇧🇭", x: 26.0667,y: 50.5577 },
    {id: 5, name: "Gran Premio de Arabia Saudita 🇸🇦", x: 24.7136, y: 46.6753 },
    {id: 6, name: "Gran Premio de Miami 🇺🇸", x: 25.7617, y: -80.1918 },
    {id: 7, name: "Gran Premio de Italia 🇮🇹", x:  45.4642, y: 9.1900 },
    {id: 8, name: "Gran Premio de Monaco 🇲🇨", x:43.7384, y: 7.4246 },
    {id: 9, name: "Gran Premio de España 🇪🇸", x: 40.4168, y:-3.7038 },
    {id: 10, name: "Gran Premio de Canadá 🇨🇦", x:  45.4215, y: -75.6972 },
    {id: 11, name: "Gran Premio de Austria 🇦🇹", x: 48.2082, y: 16.3738 },
    {id: 12, name: "Gran Premio de Gran Bretaña 🇬🇧", x:51.5074,y:  -0.1278 },
    {id: 13, name: "Gran Premio de Bélgica 🇧🇪", x: 50.8503, y:4.3517 },
    {id: 14, name: "Gran Premio de Hungría 🇭🇺", x:  47.4979, y: 19.0402 },
    {id: 15, name: "Gran Premio de Países Bajos 🇳🇱",  x:  52.3676, y:4.9041},
    {id: 16, name: "Gran Premio de Italia 🇮🇹", x: 45.4642, y:9.1900 },
    {id: 17, name: "Gran Premio de Azerbaiyán 🇦🇿", x: 40.4093, y:49.8671 },
    {id: 18, name: "Gran Premio de Singapur 🇸🇬", x:1.3521, y: 103.8198 },
    {id: 19, name: "Gran Premio de Estados Unidos 🇺🇸", x:30.2672,y: -97.7431 },
    {id: 20, name: "Gran Premio de México 🇲🇽", x:19.4326, y:-99.1332 },
    {id: 21, name: "Gran Premio de Brasil 🇧🇷", x:  -23.5505, y: -46.6333 },
    {id: 22, name: "Gran Premio de Las Vegas 🇺🇸", x: 36.1699, y:-115.1398 },
    {id: 23, name: "Gran Premio de Qatar 🇶🇦", x:25.276987,y:51.520008 },
    {id: 24, name: "Gran Premio de Abu Dhabi 🇦🇪",  x:  24.4539, y:54.3773 }
]

const edgesOriginal =[
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
]

const edges =[];


useEffect(() => {
  const grafo = {
    vertices: carrera.map(gp => gp.id),
    aristas: edgesOriginal.map(edge => [edge.source, edge.target]),
  }
  const resultado = AlgoritmoVoraz(grafo)
  setColoracion(resultado)
}, [carrera, edgesOriginal])

export default function ColoracionPropio() {
    const navigate = useNavigate();
    const [mostrarGrafo, setMostrarGrafo] = useState(false);
    const [nuevoGrafo, setNuevoGrafo] = useState(false);
    const [showPopup, setShowPopup] = useState(true); 
    const [showPopup2, setShowPopup2] = useState(false); 
    const [showPopup3, setShowPopup3] = useState(false); 

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
              <p className="mb-4">Inicialmente veras la ubicación de cada carrera. Tienes las opciones de ver el horario predeterminado o crear uno nuevo.</p>
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
              <p className="mb-4">Trabajamos con 4 colores que representan la semana de cada mes en respectivo orden.</p>

              <div className="grid grid-cols-2 gap-4 justify-center items-center mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-red-100 border border-gray-300"></div>
                  <span className="text-sm">Semana 1</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 border border-gray-300"></div>
                  <span className="text-sm">Semana 2</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 border border-gray-300"></div>
                  <span className="text-sm">Semana 3</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-yellow-100 border border-gray-300"></div>
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
          <DropdownGrandPrix onMostrarGrafo = {() => setMostrarGrafo(true)} onNuevoGrafo={()=> setNuevoGrafo(true)}/>
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
            {mostrarGrafo &&(
              <div>
                {coloracion(carrera, edgesOriginal)}
              </div>
            )}

            {/* {nuevoGrafo && (
                <div>
                  {coloracionGrafo(carrera, edges)}
                </div>
              )
            } */}


          </MapContainer>
        </div>

       
      </div>
       <div className="text-center mt-5">
        <Link
            onClick={() => navigate(-1)}
            className={`group inline-flex items-center space-x-4 px-8 py-4 text-lg font-bold text-white/80 rounded-full border-2 border-black/20 hover:border-white/40 hover:text-white backdrop-blur-lg bg-white/5 hover:bg-white/10 transition-all duration-500 hover:scale-105 'translate-y-0 opacity-100'`}
            style={{ transitionDelay: '0.8s' }}
        >
            <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                <div className="w-0 h-0 border-r-4 border-r-white border-y-2 border-y-transparent mr-1"></div>
            </div>
            <span className="tracking-wider">Regresar</span>
        </Link>
    </div>
    </div>
  );
}
