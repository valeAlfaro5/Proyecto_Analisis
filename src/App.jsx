import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import * as THREE from 'three';

function App() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);

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

    // Create tunnel particles
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // F1 colors: red, white, blue
    const f1Colors = [
      // new THREE.Color(0xff0000), // Red
      new THREE.Color(0xffffff), // White  
      // new THREE.Color(0x0066ff), // Blue
      // new THREE.Color(0xffaa00), // Orange
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Create tunnel effect - particles in cylindrical distribution
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 5 + 1;

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = Math.sin(angle) * radius;
      positions[i3 + 2] = (Math.random() - 0.5) * 50;

      // Random F1 colors
      const color = f1Colors[Math.floor(Math.random() * f1Colors.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 3 + 1;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Particle material
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Create speed lines
    const lineGeometry = new THREE.BufferGeometry();
    const lineCount = 50;
    const linePositions = new Float32Array(lineCount * 6); // 2 points per line
    const lineColors = new Float32Array(lineCount * 6);

    for (let i = 0; i < lineCount; i++) {
      const i6 = i * 6;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 8 + 2;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // Line start (far)
      linePositions[i6] = x;
      linePositions[i6 + 1] = y;
      linePositions[i6 + 2] = -30;

      // Line end (near)
      linePositions[i6 + 3] = x;
      linePositions[i6 + 4] = y;
      linePositions[i6 + 5] = 30;

      // Colors (fade from bright to dim)
      const color = f1Colors[Math.floor(Math.random() * f1Colors.length)];
      lineColors[i6] = color.r * 0.3;
      lineColors[i6 + 1] = color.g * 0.3;
      lineColors[i6 + 2] = color.b * 0.3;

      lineColors[i6 + 3] = color.r;
      lineColors[i6 + 4] = color.g;
      lineColors[i6 + 5] = color.b;
    }

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Camera position
    camera.position.z = 5;

    // Animation loop
    let speed = 0;
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      speed += 0.02;
      const maxSpeed = 2;
      const currentSpeed = Math.min(speed, maxSpeed);

      // Move particles towards camera
      const positions = particleSystem.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 2] += currentSpeed;

        // Reset particles that pass the camera
        if (positions[i3 + 2] > 10) {
          positions[i3 + 2] = -40;
          // Randomize position slightly
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * 5 + 1;
          positions[i3] = Math.cos(angle) * radius;
          positions[i3 + 1] = Math.sin(angle) * radius;
        }
      }

      // Move lines
      const linePositions = lines.geometry.attributes.position.array;
      for (let i = 0; i < lineCount * 2; i++) {
        const i3 = i * 3;
        linePositions[i3 + 2] += currentSpeed;

        // Reset lines
        if (linePositions[i3 + 2] > 30) {
          linePositions[i3 + 2] -= 60;
        }
      }

      particleSystem.geometry.attributes.position.needsUpdate = true;
      lines.geometry.attributes.position.needsUpdate = true;

      // Camera shake effect
      camera.position.x = (Math.random() - 0.5) * 0.1 * currentSpeed;
      camera.position.y = (Math.random() - 0.5) * 0.1 * currentSpeed;

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

    // Sonido de motor V12
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const playEngineSound = () => {
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator1.frequency.setValueAtTime(80, audioContext.currentTime);
      oscillator2.frequency.setValueAtTime(120, audioContext.currentTime);

      oscillator1.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 2);
      oscillator2.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 2);

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.4, audioContext.currentTime + 1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2.5);

      oscillator1.start();
      oscillator2.start();
      oscillator1.stop(audioContext.currentTime + 3);
      oscillator2.stop(audioContext.currentTime + 3);
    };

    playEngineSound();

    // Navigate after animation
    setTimeout(() => {
      navigate('/menu');
    }, 3000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-red-950 to-black">

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
            CHAMPIONSHIP  TIME EXECUTION ALGORITHM EXPERIENCE
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
              color: "from-red-600 to-blue-900",
              delay: "0.2s",
              logo: "src/assets/logos/redbulllogo.png",
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
              <div className="text-center">
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
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
              <div className="w-0 h-0 border-l-4 border-l-white border-y-2 border-y-transparent ml-1"></div>
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