import React, { useRef, useState } from 'react';

interface BorderGlowProps {
  children: React.ReactNode;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  colors?: string[];
  edgeSensitivity?: number;
  className?: string;
  style?: React.CSSProperties;
}

const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  borderRadius = 24,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [glowOpacity, setGlowOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    // Distance from edges
    const distFromLeft = x;
    const distFromRight = w - x;
    const distFromTop = y;
    const distFromBottom = h - y;
    
    const minDistFromEdge = Math.min(
      distFromLeft,
      distFromRight,
      distFromTop,
      distFromBottom
    );

    // Intensity based on proximity to edges
    const intensity = Math.max(0, 1 - minDistFromEdge / 80);
    setGlowOpacity(intensity);
  };

  const handleMouseLeave = () => {
    setGlowOpacity(0);
  };

  const glowSize = 15 + glowOpacity * 30;
  const spread = 5 + glowOpacity * 15;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        borderRadius: `${borderRadius}px`,
        boxShadow: `0 0 ${glowSize}px ${spread}px rgba(234, 179, 8, ${glowOpacity * 0.7})`,
        transition: 'box-shadow 0.15s ease-out',
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default BorderGlow;
