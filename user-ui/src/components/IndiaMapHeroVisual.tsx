'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Award, Laptop, Sparkles } from 'lucide-react';

export default function IndiaMapHeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState({
    transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
  });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 14;
    const rotateY = ((x - centerX) / centerX) * 14;

    setTransformStyle({
      transform: `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out',
    });

    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransformStyle({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
    });
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={transformStyle}
      className="relative w-full max-w-[540px] mx-auto flex items-center justify-center select-none py-6 will-change-transform transform-gpu [transform-style:preserve-3d] cursor-pointer group"
    >
      {/* Ambient background decorative dots / confetti with 3D depth */}
      <div
        style={{ transform: 'translateZ(60px)' }}
        className="absolute top-2 left-6 w-3.5 h-3.5 rounded-full bg-[#ea580c] shadow-lg animate-bounce duration-1000 [transform-style:preserve-3d]"
      />
      <div
        style={{ transform: 'translateZ(40px)' }}
        className="absolute top-1/4 -left-3 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md [transform-style:preserve-3d]"
      />
      <div
        style={{ transform: 'translateZ(50px)' }}
        className="absolute bottom-16 left-8 w-3.5 h-3.5 rounded-full bg-sky-500 shadow-md animate-pulse [transform-style:preserve-3d]"
      />
      <div
        style={{ transform: 'translateZ(45px)' }}
        className="absolute top-8 right-2 w-3 h-3 rounded-full bg-rose-500 shadow-md animate-bounce [transform-style:preserve-3d]"
      />
      <div
        style={{ transform: 'translateZ(35px)' }}
        className="absolute bottom-24 -right-3 w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-md [transform-style:preserve-3d]"
      />
      <div
        style={{ transform: 'translateZ(55px)' }}
        className="absolute top-1/2 -right-4 w-4 h-4 rounded-full bg-amber-400 shadow-md [transform-style:preserve-3d]"
      />
      <div
        style={{ transform: 'translateZ(30px)' }}
        className="absolute bottom-4 right-16 w-3 h-3 rounded-full bg-emerald-400 shadow-md animate-pulse [transform-style:preserve-3d]"
      />

      {/* Subtle Glow Behind India Map */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/30 via-emerald-200/20 to-indigo-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Dynamic 3D Glare Light */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300 -z-0 overflow-hidden"
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 60%)`,
          opacity: glarePosition.opacity,
        }}
      />

      {/* Main Container with Clean Vector Outline Silhouette in 3D */}
      <div
        style={{ transform: 'translateZ(20px)' }}
        className="relative w-full aspect-[507/552] max-w-[490px] flex items-center justify-center filter drop-shadow-[0_25px_45px_rgba(0,0,0,0.16)] [transform-style:preserve-3d]"
      >
        <img
          src="/images/india_scholars_clean_map.png"
          alt="Katalyst Indian STEM Scholars inside India Map"
          className="w-full h-full object-contain transition-transform duration-500"
        />
      </div>

      {/* 3D Floating Badge 1: 100% Free Laptops (Pops Out in 3D Space) */}
      <div
        style={{ transform: 'translateZ(70px)' }}
        className="absolute top-4 -left-2 sm:-left-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.15)] max-w-[210px] z-30 transition-transform duration-300 hover:scale-105 [transform-style:preserve-3d]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
            <Laptop className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-900 leading-tight">100% Free Laptops</p>
            <p className="text-[9px] text-slate-500 font-medium">Brand-new coding devices</p>
          </div>
        </div>
      </div>

      {/* 3D Floating Badge 2: 4,500+ Scholars (Pops Out in 3D Space) */}
      <div
        style={{ transform: 'translateZ(65px)' }}
        className="absolute bottom-6 -right-2 sm:-right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.15)] max-w-[220px] z-30 transition-transform duration-300 hover:scale-105 [transform-style:preserve-3d]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#ea580c] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
            <Award className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-900 leading-tight">4,500+ STEM Scholars</p>
            <p className="text-[9px] text-slate-500 font-medium">Pan-India Fellowship reach</p>
          </div>
        </div>
      </div>
    </div>
  );
}
