import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import * as THREE from 'three';
import { AudioContext } from './context/AudioProvider';
import { Play } from 'lucide-react';

function App() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);

  const { playV10 } = useContext(AudioContext)

  useEffect(() => {
    return () => {
      // Cleanup Three.js resources
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  const createSpeedTunnel = () => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create wind lines
    const lineCount = 200;
    const windLines = [];

    // F1 colors
    const f1Colors = [
      new THREE.Color(0xffffff), // White
      // new THREE.Color(0xff4444), // Light Red
      // new THREE.Color(0x4466ff), // Light Blue
    ];

    for (let i = 0; i < lineCount; i++) {
      const geometry = new THREE.BufferGeometry();
      
      // Create individual line with multiple segments for more dynamic effect
      const segments = 30;
      const positions = new Float32Array((segments + 1) * 3);
      const colors = new Float32Array((segments + 1) * 3);
      
      // Random starting position in tunnel
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 8 + 2;
      const baseX = Math.cos(angle) * radius;
      const baseY = Math.sin(angle) * radius;
      const startZ = (Math.random() - 0.5) * 100 - 50;
      
      // Create wavy line segments
      for (let j = 0; j <= segments; j++) {
        const j3 = j * 3;
        const progress = j / segments;
        
        // Add slight wave motion to simulate wind turbulence
        const waveX = Math.sin(progress * Math.PI * 4) * 0.3;
        const waveY = Math.cos(progress * Math.PI * 3) * 0.2;
        
        positions[j3] = baseX + waveX;
        positions[j3 + 1] = baseY + waveY;
        positions[j3 + 2] = startZ + (progress * 8); // Line length
        
        // Color gradient along the line
        const color = f1Colors[Math.floor(Math.random() * f1Colors.length)];
        const opacity = 1 - progress * 0.7; // Fade towards the back
        colors[j3] = color.r * opacity;
        colors[j3 + 1] = color.g * opacity;
        colors[j3 + 2] = color.b * opacity;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: Math.random() * 0.7 + 0.3,
        blending: THREE.AdditiveBlending,
        linewidth: 2
      });
      
      const line = new THREE.Line(geometry, material);
      
      // Store additional properties for animation
      line.userData = {
        speed: Math.random() * 2 + 1,
        wavePhase: Math.random() * Math.PI * 2,
        waveSpeed: Math.random() * 0.1 + 0.05,
        originalAngle: angle,
        originalRadius: radius
      };
      
      windLines.push(line);
      scene.add(line);
    }

    // Create additional horizontal wind streaks
    const streakCount = 50;
    const windStreaks = [];

    for (let i = 0; i < streakCount; i++) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(6); // 2 points
      const colors = new Float32Array(6);
      
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 10 + 1;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 80;
      
      // Horizontal streak
      positions[0] = Math.cos(angle) * radius;
      positions[1] = y;
      positions[2] = z;
      
      positions[3] = Math.cos(angle) * (radius + 3);
      positions[4] = y;
      positions[5] = z;
      
      const color = f1Colors[Math.floor(Math.random() * f1Colors.length)];
      
      // Bright start
      colors[0] = color.r;
      colors[1] = color.g;
      colors[2] = color.b;
      
      // Fade end
      colors[3] = color.r * 0.3;
      colors[4] = color.g * 0.3;
      colors[5] = color.b * 0.3;
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });
      
      const streak = new THREE.Line(geometry, material);
      streak.userData = {
        speed: Math.random() * 3 + 2,
        angle: angle,
        baseRadius: radius
      };
      
      windStreaks.push(streak);
      scene.add(streak);
    }

    // Camera position
    camera.position.z = 5;

    // Animation loop
    let speed = 0;
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      speed += 0.02;
      const maxSpeed = 3;
      const currentSpeed = Math.min(speed, maxSpeed);

      // Animate wind lines
      windLines.forEach((line, index) => {
        const positions = line.geometry.attributes.position.array;
        const userData = line.userData;
        
        // Update wave phase for turbulence
        userData.wavePhase += userData.waveSpeed;
        
        // Move entire line forward
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 2] += currentSpeed * userData.speed;
        }
        
        // Add wave motion
        for (let i = 0; i < positions.length; i += 3) {
          const segmentIndex = i / 3;
          const progress = segmentIndex / 5; // 5 segments
          
          const waveX = Math.sin(userData.wavePhase + progress * Math.PI * 4) * 0.3;
          const waveY = Math.cos(userData.wavePhase + progress * Math.PI * 3) * 0.2;
          
          const baseX = Math.cos(userData.originalAngle) * userData.originalRadius;
          const baseY = Math.sin(userData.originalAngle) * userData.originalRadius;
          
          positions[i] = baseX + waveX;
          positions[i + 1] = baseY + waveY;
        }
        
        // Reset line if it passes the camera
        if (positions[2] > 20) {
          for (let i = 0; i < positions.length; i += 3) {
            positions[i + 2] -= 120;
          }
          
          // Randomize position
          userData.originalAngle = Math.random() * Math.PI * 2;
          userData.originalRadius = Math.random() * 8 + 2;
          userData.wavePhase = Math.random() * Math.PI * 2;
        }
        
        line.geometry.attributes.position.needsUpdate = true;
      });

      // Animate wind streaks
      windStreaks.forEach((streak) => {
        const positions = streak.geometry.attributes.position.array;
        const userData = streak.userData;
        
        // Move streak forward
        positions[2] += currentSpeed * userData.speed;
        positions[5] += currentSpeed * userData.speed;
        
        // Reset if passed camera
        if (positions[2] > 15) {
          positions[2] -= 100;
          positions[5] -= 100;
          
          // Randomize position
          userData.angle = Math.random() * Math.PI * 2;
          userData.baseRadius = Math.random() * 10 + 1;
          
          positions[0] = Math.cos(userData.angle) * userData.baseRadius;
          positions[3] = Math.cos(userData.angle) * (userData.baseRadius + 3);
          positions[1] = (Math.random() - 0.5) * 15;
          positions[4] = positions[1];
        }
        
        streak.geometry.attributes.position.needsUpdate = true;
      });

      // Enhanced camera shake effect
      const shakeIntensity = currentSpeed * 0.15;
      camera.position.x = (Math.random() - 0.5) * shakeIntensity;
      camera.position.y = (Math.random() - 0.5) * shakeIntensity;
      
      // Slight rotation for more dynamic feel
      camera.rotation.z = (Math.random() - 0.5) * 0.02 * currentSpeed;

      renderer.render(scene, camera);
    };

    animate();
  };

  const handleStartEngine = () => {
    setIsTransitioning(true);

    // Start 3D tunnel animation
    setTimeout(() => {
      createSpeedTunnel();
    }, 100);

    playV10()

    // Navigate after animation
    setTimeout(() => {
      navigate('/menu');
    }, 4000);
  };

  return (
    <div className="title min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-red-950 to-black">

      {/* Transition overlay with 3D tunnel */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Three.js Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ background: 'radial-gradient(circle, rgba(255,0,0,0.1) 0%, rgba(0,0,0,1) 70%)' }}
          />

          {/* Speed effect overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/50">
            <div className="absolute inset-0 bg-gradient-conic from-red-500/10 via-transparent to-blue-500/10 animate-spin" style={{ animationDuration: '0.5s' }}></div>
          </div>

          {/* Engine start text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-8xl font-black text-white mb-6 animate-pulse drop-shadow-2xl">
                A EJECUTAR ALGORITMOS!
              </div>
              <div className="text-4xl font-bold text-red-400 animate-bounce">
                VAMOS...
              </div>
              <div className="mt-8 flex justify-center space-x-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-4 h-4 bg-red-500 rounded-full animate-ping"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-silver-400 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Racing stripes */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-red-500 via-transparent to-red-500 opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-blue-500 via-transparent to-blue-500 opacity-20 animate-pulse delay-700"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">

        {/* Logo container with glass effect */}
        <div className="mb-12 p-3 rounded-3xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-500 hover:scale-105">
          <div className="w-50 h-48 mx-auto rounded-2xl bg-gradient-to-br from-white/20 to-white/5 flex flex-col items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner">
            <img
              src="src/assets/unitec_logo.png"
              alt="UNITEC logo"
              className="w-16 h-16 mb-2 object-contain"
            />
            <div className="text-white/90 text-4xl font-bold tracking-wider">
              UNITEC
            </div>
          </div>
        </div>



        {/* Title section */}
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-white to-blue-400 animate-pulse">
            FORMULA 1
          </h1>
          <div className="text-lg md:text-xl text-white/80 font-light tracking-wide">
            <p>CHAMPIONSHIP TIME EXECUTION</p>
            <p>ALGORITHM EXPERIENCE</p>
          </div>
        </div>

        {/* Team members */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl">
          {[
            {
              name: "Valeria Alfaro",
              color: "from-orange-400 to-orange-600",
              delay: "0s",
              logo: "src/assets/logos/mclarenlogo.jpg",
            },
            {
              name: "Joe Corrales",
              color: "from-red-600 to-slate-900",
              delay: "0.2s",
              logo: "src/assets/logos/ferrarilogo.svg",
            },
            {
              name: "Harold Diaz",
              color: "from-gray-800 to-emerald-500",
              delay: "0.4s",
              logo: "src/assets/logos/mercedeslogo.png",
            },
          ].map((member, index) => (
            <div
              key={index}
              className={`group p-6 rounded-2xl backdrop-blur-lg bg-gradient-to-br ${member.color} bg-opacity-20 border border-white/10 hover:bg-opacity-30 transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
              style={{ animationDelay: member.delay }}
            >
              <div className="flex justify-center flex-col text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={member.logo}
                    alt={`${member.name} team logo`}
                    className="w-14 h-14 object-contain"
                  />
                </div>
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors duration-300">
                  {member.name}
                </h2>
                <div className="text-white/60 text-sm font-light tracking-wide">
                  PILOT/ANALYST
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Menu button */}
        <button
          onClick={handleStartEngine}
          disabled={isTransitioning}
          className={`group relative px-12 py-4 text-xl font-bold text-white rounded-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:via-red-400 hover:to-red-500 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-red-500/25 border border-red-400/20 backdrop-blur-sm ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center space-x-3">
            <span className="tracking-wider">START ENGINE</span>
            <div className="w-auto h-auto p-2 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
              <Play size={14} />
            </div>
          </div>
        </button>

        {/* Decorative elements */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full bg-white/40 animate-pulse`}
              style={{ animationDelay: `${i * 0.3}s` }}
            ></div>
          ))}
        </div> */}
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-red-500/30 rounded-tl-3xl"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-blue-500/30 rounded-br-3xl"></div>
    </div>
  );
}

export default App;