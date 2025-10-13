import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import '../../css/ElectricityEffect.css';



// Leggi i colori direttamente dalle variabili CSS
function getCSSVariable(variable) {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

function LightningBolt({ start, end, intensity = 1, colorVar = '--lightning-primary' }) {
  const lineRef = useRef();
  const [points, setPoints] = useState([]);
  const [color, setColor] = useState('#00ffff');

  useEffect(() => {
    const cssColor = getCSSVariable(colorVar);
    setColor(cssColor || '#00ffff');
  }, [colorVar]);

  useEffect(() => {
    const generateLightning = () => {
      const pts = [];
      const segments = 25;
      
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = start.x + (end.x - start.x) * t;
        const y = start.y + (end.y - start.y) * t;
        const z = start.z + (end.z - start.z) * t;
        
        const offset = (Math.random() - 0.5) * 0.8 * (1 - Math.abs(t - 0.5) * 2);
        
        pts.push(new THREE.Vector3(
          x + offset,
          y + offset,
          z
        ));
      }
      
      setPoints(pts);
    };

    generateLightning();
    const interval = setInterval(generateLightning, 60);
    
    return () => clearInterval(interval);
  }, [start.x, start.y, start.z, end.x, end.y, end.z]);

  useFrame(() => {
    if (lineRef.current && points.length > 0) {
      lineRef.current.geometry.setFromPoints(points);
    }
  });

  if (points.length === 0) return null;

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial 
        color={color}
        transparent 
        opacity={0.6 * intensity}
        linewidth={3}
      />
    </line>
  );
}

function ElectricityScene({ mousePos, hoveredCard, viewportSize }) {
  const [bolts, setBolts] = useState([]);
  const viewportSizeRef = useRef(viewportSize);

  // Aggiorna il ref quando cambia viewportSize
  useEffect(() => {
    viewportSizeRef.current = viewportSize;
  }, [viewportSize]);

  useEffect(() => {
    const updateBolts = () => {
      const currentViewport = viewportSizeRef.current;
      
      // Non generare fulmini se la viewport non è stata ancora calcolata
      if (currentViewport.width === 0 || currentViewport.height === 0) {
        return;
      }
      
      if (hoveredCard && mousePos) {
        const newBolts = Array.from({ length: 7 }, (_, i) => {
          const angle = (Math.PI * 2 * i) / 7 + Math.random() * 0.3;
          const distance = 2 + Math.random() * 1.5;
          
          return {
            id: Math.random(),
            start: {
              x: mousePos.x + Math.cos(angle) * distance,
              y: mousePos.y + Math.sin(angle) * distance,
              z: -1
            },
            end: { ...mousePos },
            intensity: Math.random() * 0.3 + 0.5,
            colorVar: i % 2 === 0 ? '--lightning-hover' : '--lightning-secondary'
          };
        });
        
        setBolts(newBolts);
      } else {
        setBolts([]);
      }
    };

    updateBolts();
    const interval = setInterval(updateBolts, 150);
    
    return () => clearInterval(interval);
  }, [mousePos, hoveredCard, viewportSize]);

  return (
    <>
      <ambientLight intensity={0.2} />
      {mousePos && hoveredCard && (
        <pointLight 
          position={[mousePos.x, mousePos.y, 2]} 
          intensity={1.5} 
          color={getCSSVariable('--lightning-hover') || '#00ffff'} 
          distance={5} 
        />
      )}
      {bolts.map(bolt => (
        <LightningBolt
          key={bolt.id}
          start={bolt.start}
          end={bolt.end}
          intensity={bolt.intensity}
          colorVar={bolt.colorVar}
        />
      ))}
    </>
  );
}

export default function ElectricityEffect() {
  const [mousePos, setMousePos] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    setIsDesktop(window.innerWidth > 1024);
  }, []);

  useEffect(() => {
    const updateViewportSize = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const aspect = rect.width / rect.height;
      const vFOV = THREE.MathUtils.degToRad(60);
      const height = 2 * Math.tan(vFOV / 2) * 10;
      const width = height * aspect;
      
      setViewportSize({ width, height });
    };

    const handleResize = () => {
      updateViewportSize();
      setIsDesktop(window.innerWidth > 1024);
    };

    // Calcola subito al mount
    updateViewportSize();
    
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isMounted]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      setMousePos({ 
        x: x * (viewportSize.width / 2), 
        y: y * (viewportSize.height / 2), 
        z: 0 
      });
      
      const element = document.elementFromPoint(e.clientX, e.clientY);
      
      const isCard = element && (
        element.classList.contains('hasElectricity') || 
        element.closest('.hasElectricity') ||
        element.classList.contains('customInteractiveImageCard') ||
        element.closest('.customInteractiveImageCard') ||
        element.classList.contains('genreGameCard') ||
        element.closest('.genreGameCard') ||
        element.classList.contains('cardFlipContainer') ||
        element.closest('.cardFlipContainer')
      );
      
      setHoveredCard(isCard);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [viewportSize]);

  if (!isMounted || !isDesktop) return null;

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        mixBlendMode: 'screen'
      }}
    >
      <Canvas 
        ref={canvasRef}
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ 
          background: 'transparent',
          pointerEvents: 'none'
        }}
      >
        <ElectricityScene mousePos={mousePos} hoveredCard={hoveredCard} viewportSize={viewportSize} />
      </Canvas>
    </div>
  );
}