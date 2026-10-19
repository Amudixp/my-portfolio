import React, { useEffect, useRef, useMemo } from 'react';
import type { ReactNode, RefObject, CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  style?: CSSProperties;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.15,
  baseRotation = 1,
  blurStrength = 4,
  containerClassName = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span 
          className="inline-block word" 
          key={index}
          style={{
            display: 'inline-block',
            opacity: baseOpacity,
            color: 'inherit',
            filter: enableBlur ? `blur(${blurStrength}px)` : 'blur(0px)',
            transition: 'none'
          }}
        >
          {word}
        </span>
      );
    });
  }, [children, baseOpacity, blurStrength, enableBlur]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;
    
    // Container rotation animation
    gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top 85%',
          end: 'top 35%',
          scrub: 0.5,
          markers: false
        }
      }
    );
    
    const wordElements = el.querySelectorAll<HTMLElement>('.word');
    
    // Word opacity animation
    gsap.fromTo(
      wordElements,
      { opacity: baseOpacity },
      {
        ease: 'none',
        opacity: 1,
        duration: 0.5,
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top 85%',
          end: 'top 30%',
          scrub: 0.5,
          markers: false
        }
      }
    );
    
    // Word blur animation
    if (enableBlur) {
      gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: 'none',
          filter: 'blur(0px)',
          duration: 0.5,
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 0.5,
            markers: false
          }
        }
      );
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, blurStrength]);

  return (
    <div 
      ref={containerRef} 
      className={containerClassName}
      style={{
        fontSize: 'inherit',
        lineHeight: '1.7',
        fontWeight: '500',
        color: 'inherit',
        margin: '0',
        wordBreak: 'break-word',
        ...style
      }}
    >
      <p style={{ margin: 0, color: 'inherit' }}>{splitText}</p>
    </div>
  );
};

export default ScrollReveal;
