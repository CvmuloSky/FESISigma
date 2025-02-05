import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function FuturisticBackground() {
    const canvasRef = useRef(null);
    const particles = [];

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width = window.innerWidth;
        const height = canvas.height = window.innerHeight;

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > width || this.x < 0) this.speedX *= -1;
                if (this.y > height || this.y < 0) this.speedY *= -1;
            }

            draw() {
                ctx.fillStyle = 'rgba(0, 255, 255, 0.7)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            for (let i = 0; i < 150; i++) {
                particles.push(new Particle());
            }
        }

        function handleParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach((particle) => {
                particle.update();
                particle.draw();
            });
        }

        function animate() {
            handleParticles();
            requestAnimationFrame(animate);
        }

        initParticles();
        animate();

        return () => cancelAnimationFrame(animate);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 -z-10 bg-black"
        >
            <canvas ref={canvasRef} className="w-full h-full"></canvas>
        </motion.div>
    );
}
