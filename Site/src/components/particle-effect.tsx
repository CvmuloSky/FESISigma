"use client";

import React, { useEffect, useRef } from 'react';

export function ParticleEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    };

    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    // Particle settings
    const particleCount = 200;
    const particles: Particle[] = [];
    const colors = ['#00B8A9', '#006B63', '#00DAC7', '#008277'];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.5 + 0.1,
        angle: Math.random() * Math.PI * 2,
        spin: Math.random() * 0.1 - 0.05,
      });
    }

    // Animation loop
    let animationFrameId: number;
    
    // Draw circular frame
    const drawCircularFrame = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.45;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = colors[0];
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawCircularFrame();
      
      // Draw connections between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 50) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 184, 169, ${(1 - distance / 50) * 0.2})`;
            ctx.stroke();
          }
        }
      }
      
      // Update and draw particles
      for (const particle of particles) {
        // Update particle position
        particle.angle += particle.spin;
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;
        
        // Boundary check - keep particles within circle
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.45;
        
        const dx = particle.x - centerX;
        const dy = particle.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > radius - particle.radius) {
          // Bounce off the circle boundary
          const angle = Math.atan2(dy, dx);
          const newAngle = angle + Math.PI;
          particle.angle = newAngle;
          
          // Move particle inside the circle
          particle.x = centerX + Math.cos(angle) * (radius - particle.radius - 1);
          particle.y = centerY + Math.sin(angle) * (radius - particle.radius - 1);
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-full rounded-full animate-float"
      style={{ 
        background: 'radial-gradient(circle, rgba(0,184,169,0.1) 0%, rgba(255,255,255,0) 70%)'
      }}
    />
  );
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  speed: number;
  angle: number;
  spin: number;
} 