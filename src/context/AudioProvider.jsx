// src/context/AudioContext.js
import { createContext, useRef, useEffect } from "react";

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const v10Sound = useRef(new Audio("src\\assets\\V10 Sound faded it out.mp4"));
  const menuMusic = useRef(new Audio("src\\assets\\F1ThemeMusic.mp3"));

  useEffect(() => {
    menuMusic.current.loop = true;
  }, []);

  const playV10 = () => {
    stopMenu(); // Detener cualquier música previa
    v10Sound.current.currentTime = 0;
    v10Sound.current.play();
    v10Sound.current.onended = () => {
      playMenu(); // Al terminar, empieza la música de fondo
    };
  };

  const playMenu = () => {
    if (menuMusic.current.paused) {
      menuMusic.current.currentTime = 0;
      menuMusic.current.play();
    }
  };

  const stopMenu = () => {
    menuMusic.current.pause();
    menuMusic.current.currentTime = 0;
  };

  return (
    <AudioContext.Provider value={{ playV10, playMenu, stopMenu }}>
      {children}
    </AudioContext.Provider>
  );
};
