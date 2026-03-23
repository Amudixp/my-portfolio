import { useEffect, useRef } from 'react';

interface Firefly {
  x: number;
  y: number;
  radius: number;
  timeOffset: number;
  baseY: number;
  speed: number;
}

const FireflyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Firefly[]>([]);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize fireflies
    const initializeFireflies = () => {
      particlesRef.current = [];
      const particleCount = Math.floor(Math.random() * 11) + 30; // 30-40 particles

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 1, // 1-2.5px
          timeOffset: Math.random() * Math.PI * 2,
          baseY: Math.random() * canvas.height,
          speed: Math.random() * 0.3 + 0.1 // Very slow upward drift
        });
      }
    };

    initializeFireflies();

    // Animation loop
    const animate = (timestamp: number) => {
      // Clear canvas with slight fade to create motion blur effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = timestamp * 0.0003; // Normalize time for smooth motion

      particlesRef.current.forEach((firefly) => {
        // Organic X movement: horizontal wandering
        const wobbleX = Math.sin(time * 0.5 + firefly.timeOffset) * 50; // Gentle horizontal drift
        const noiseX = Math.cos(time * 0.3 + firefly.timeOffset * 2) * 30; // Additional noise for irregularity

        // Organic Y movement: upward drift with wave motion
        const waveY = Math.sin(time * 0.2 + firefly.timeOffset) * 40; // Gentle up-down wave
        const driftY = firefly.baseY - firefly.speed * time * 50; // Slow upward drift

        // Update firefly position
        firefly.x = (firefly.x + wobbleX * 0.02 + noiseX * 0.01) % canvas.width;
        if (firefly.x < 0) firefly.x += canvas.width;
        firefly.baseY = driftY + waveY;

        // Wrap around when drifting off top
        if (firefly.baseY < -10) {
          firefly.baseY = canvas.height + 10;
        }

        firefly.y = firefly.baseY;

        // Blinking effect: organic pulsation using sine wave
        const pulseOpacity = Math.sin(time * 2 + firefly.timeOffset) * 0.4 + 0.5; // Oscillates between 0.1 and 0.9
        const clampedOpacity = Math.max(0.1, Math.min(0.9, pulseOpacity));

        // Draw firefly with glow
        ctx.save();

        // Setup glow effect
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(234, 179, 8, ${clampedOpacity})`; // Mustard yellow glow
        ctx.globalAlpha = clampedOpacity;

        // Draw particle
        ctx.fillStyle = '#EAB308'; // Mustard yellow
        ctx.beginPath();
        ctx.arc(firefly.x, firefly.y, firefly.radius, 0, Math.PI * 2);
        ctx.fill();

        // Add extra bright core
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(firefly.x, firefly.y, firefly.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }}
    />
  );
};

export default FireflyBackground;
