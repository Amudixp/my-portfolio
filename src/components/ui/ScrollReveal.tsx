import React, { useEffect, useRef, useMemo } from 'react';
import type { ReactNode, RefObject } from 'react';
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
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  
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
            color: '#ffffff',
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
          start: 'top 80%',
          end: 'top 30%',
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
          start: 'top 80%',
          end: 'top 20%',
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
            start: 'top 80%',
            end: 'top 20%',
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
    <h2 
      ref={containerRef} 
      className={containerClassName}
      style={{
        fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
        lineHeight: '1.5',
        fontWeight: '600',
        color: '#ffffff',
        margin: '20px 0',
        wordBreak: 'break-word'
      }}
    >
      <p style={{ margin: 0, color: '#A3A3A3' }}>{splitText}</p>
    </h2>
  );
};

export default ScrollReveal;
