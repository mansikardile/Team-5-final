'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [trailPosition, setTrailPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const requestRef = useRef<number>();
  const mouseRef = useRef({ x: -100, y: -100 });
  const trailRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Check if device has a fine pointer (desktop mouse)
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('a') ||
          target.closest('button') ||
          target.closest('input') ||
          target.closest('select') ||
          target.closest('textarea') ||
          target.closest('[role="button"]') ||
          target.closest('.cursor-pointer')
        );
        setIsHovered(isInteractive);

        const customLabel = target.closest('[data-cursor-label]')?.getAttribute('data-cursor-label');
        setCursorText(customLabel || '');
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth animation loop for the trailing outer ring
    const animateTrail = () => {
      // Lerp (Linear interpolation) for smooth liquid trail
      trailRef.current.x += (mouseRef.current.x - trailRef.current.x) * 0.18;
      trailRef.current.y += (mouseRef.current.y - trailRef.current.y) * 0.18;
      setTrailPosition({ x: trailRef.current.x, y: trailRef.current.y });

      requestRef.current = requestAnimationFrame(animateTrail);
    };

    requestRef.current = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* 1. Fast Sharp Center Dot */}
      <div
        style={{
          transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) translate(-50%, -50%) scale(${
            isClicking ? 0.7 : isHovered ? 1.4 : 1
          })`,
        }}
        className={`fixed top-0 left-0 w-2.5 h-2.5 rounded-full transition-transform duration-75 ease-out shadow-sm pointer-events-none ${
          isHovered
            ? 'bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.9)]'
            : 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.7)]'
        }`}
      />

      {/* 2. Fluid Lagged Outer Ring / Aura */}
      <div
        style={{
          transform: `translate3d(${trailPosition.x}px, ${trailPosition.y}px, 0) translate(-50%, -50%) scale(${
            isClicking ? 0.8 : isHovered ? 1.85 : 1
          })`,
        }}
        className={`fixed top-0 left-0 rounded-full transition-all duration-300 ease-out pointer-events-none flex items-center justify-center ${
          isHovered
            ? 'w-11 h-11 border-2 border-sky-400/70 bg-sky-400/15 backdrop-blur-[0.5px]'
            : 'w-8 h-8 border border-blue-600/40 bg-blue-500/5'
        }`}
      >
        {cursorText && (
          <span className="text-[9px] font-black text-white bg-slate-900/90 px-1.5 py-0.5 rounded-full shadow-md scale-75">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}
