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
  wordChunkSize?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.15,
  baseRotation = 1,
  blurStrength = 4,
  containerClassName = '',
  style = {},
  wordChunkSize = 1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const reduceMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    if (!text) return text;
    const words = text.split(/\s+/).filter(Boolean);
    const chunkSize = Math.max(1, Math.floor(wordChunkSize));
    const chunks: string[][] = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize));
    }
    const nodes: ReactNode[] = [];
    chunks.forEach((chunk, index) => {
      nodes.push(
        <span
          className="inline-block word"
          key={index}
          style={{
            display: 'inline-block',
            opacity: reduceMotion ? 1 : baseOpacity,
            color: 'inherit',
            filter: reduceMotion ? 'blur(0px)' : enableBlur ? `blur(${blurStrength}px)` : 'blur(0px)',
            transition: 'none'
          }}
        >
          {chunk.join(' ')}
        </span>
      );
      if (index < chunks.length - 1) nodes.push(' ');
    });
    return nodes;
  }, [children, baseOpacity, blurStrength, enableBlur, reduceMotion, wordChunkSize]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || reduceMotion) return;
    
    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;
    const triggers: ScrollTrigger[] = [];
    const track = (tween: ReturnType<typeof gsap.fromTo>) => {
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    };
    
    // Container rotation animation
    track(gsap.fromTo(
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
    ));
    
    const wordElements = el.querySelectorAll<HTMLElement>('.word');
    
    // Word opacity animation
    track(gsap.fromTo(
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
    ));
    
    // Word blur animation
    if (enableBlur) {
      track(gsap.fromTo(
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
      ));
    }
    
    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, blurStrength, reduceMotion]);

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
