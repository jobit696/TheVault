import { useEffect } from 'react';
import '../css/Particles.css';

export default function ParticlesBackground() {
    useEffect(() => {
        const container = document.querySelector('.particles-bg');
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Posizione casuale
            particle.style.left = `${Math.random() * 100}%`;
            
            // Dimensione casuale
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Durata animazione casuale
            particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            // Opacità casuale
            particle.style.opacity = Math.random() * 0.5 + 0.2;
            
            container.appendChild(particle);
        }
        
        return () => {
            container.innerHTML = '';
        };
    }, []);
    
    return <div className="particles-bg"></div>;
}