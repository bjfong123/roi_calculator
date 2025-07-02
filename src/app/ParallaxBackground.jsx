"use client";
import { useEffect } from 'react';

const ParallaxBackground = () => {
  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseMoving = true;
      
      // Apply parallax effect to layers
      const layers = document.querySelectorAll('.layer');
      layers.forEach((layer) => {
        const depth = layer.getAttribute('data-depth');
        const moveX = (mouseX - window.innerWidth / 2) * depth * 0.01;
        const moveY = (mouseY - window.innerHeight / 2) * depth * 0.01;
        
        layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    };

    // Initialize particles
    const initParticles = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const particlesContainer = document.getElementById('particles-js');
      
      if (!particlesContainer) return;
      
      particlesContainer.appendChild(canvas);
      
      canvas.width = window.innerWidth;
      canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';

      const particles = [];
      const particleCount = 120;

      // Create particles
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
        });
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach((particle, i) => {
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Wrap around screen
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;

          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fill();

          // Draw connections
          particles.forEach((otherParticle, j) => {
            if (i !== j) {
              const dx = particle.x - otherParticle.x;
              const dy = particle.y - otherParticle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 * (1 - distance / 150)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
              }
            }
          });
        });

        requestAnimationFrame(animate);
      };

      animate();

      // Handle resize
      const handleResize = () => {
  canvas.width = window.innerWidth;
  canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
};

      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    };

    document.addEventListener('mousemove', handleMouseMove);
    const cleanupParticles = initParticles();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (cleanupParticles) cleanupParticles();
    };
  }, []);

  return null;
};

export default ParallaxBackground;
