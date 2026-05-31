import React from 'react';

type StarBorderProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: string;
  thickness?: number;
  borderRadius?: string;
  isFlipped?: boolean;
};

const StarBorder = <T extends React.ElementType = 'div'>({
  as,
  className = '',
  color = '#EAB308',
  speed = '4s',
  thickness = 3,
  borderRadius = '20px',
  isFlipped = false,
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || 'div';

  return (
    <Component
      className={`relative inline-block ${className}`}
      style={{
        borderRadius,
      }}
      {...(rest as Record<string, unknown>)}
    >
      {/* Outer animated border - Bottom glow */}
      <div
        className="absolute w-[300%] h-[100%] rounded-full animate-star-movement-bottom"
        style={{
          bottom: `-${thickness}px`,
          right: '-250%',
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
          animationPlayState: isFlipped ? 'paused' : 'running',
          zIndex: 0,
          filter: 'blur(2px)',
        }}
      />
      
      {/* Outer animated border - Top glow */}
      <div
        className="absolute w-[300%] h-[100%] rounded-full animate-star-movement-top"
        style={{
          top: `-${thickness}px`,
          left: '-250%',
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
          animationPlayState: isFlipped ? 'paused' : 'running',
          zIndex: 0,
          filter: 'blur(2px)',
        }}
      />

      {/* Static border outline for visibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius,
          border: `${thickness}px solid ${color}`,
          opacity: 0.5,
          zIndex: 1,
        }}
      />

      {/* Inner content container */}
      <div
        className="relative w-full h-full"
        style={{
          borderRadius: `calc(${borderRadius} - ${thickness}px)`,
          zIndex: 10,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
