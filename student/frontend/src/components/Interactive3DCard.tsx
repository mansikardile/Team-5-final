'use client';

import React, { useRef, useState, useCallback } from 'react';

interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  scale?: number;
}

export default function Interactive3DCard({
  children,
  className = '',
  maxTilt = 12,
  glare = true,
  scale = 1.02,
}: Interactive3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
  });
  const [glareStyle, setGlareStyle] = useState({
    opacity: 0,
    transform: 'translate(-50%, -50%)',
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = -((y - centerY) / centerY) * maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setTransformStyle({
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
        transition: 'transform 0.1s ease-out',
      });

      if (glare) {
        setGlareStyle({
          opacity: 0.25,
          transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
        });
      }
    },
    [maxTilt, glare, scale]
  );

  const handleMouseLeave = useCallback(() => {
    setTransformStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
    });
    if (glare) {
      setGlareStyle((prev) => ({
        ...prev,
        opacity: 0,
      }));
    }
  }, [glare]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={transformStyle}
      className={`relative will-change-transform transform-gpu [transform-style:preserve-3d] ${className}`}
    >
      {/* 3D Content Container */}
      <div className="relative w-full h-full [transform-style:preserve-3d]">
        {children}
      </div>

      {/* Dynamic 3D Glare Highlight */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] transition-opacity duration-300 -z-0"
        >
          <div
            style={{
              transform: glareStyle.transform,
              opacity: glareStyle.opacity,
            }}
            className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-white/60 via-emerald-200/40 to-transparent blur-2xl transition-opacity duration-300 mix-blend-overlay pointer-events-none"
          />
        </div>
      )}
    </div>
  );
}
