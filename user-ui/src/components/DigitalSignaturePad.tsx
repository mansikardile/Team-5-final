'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PenTool, RotateCcw, Check, Sparkles, Type, CheckCircle2 } from 'lucide-react';

interface DigitalSignaturePadProps {
  signerName?: string;
  onSignatureChange: (signatureDataUrl: string | null, isConfirmed: boolean) => void;
  initialSignature?: string | null;
  initialConsent?: boolean;
}

export default function DigitalSignaturePad({
  signerName = 'Katalyst Scholar',
  onSignatureChange,
  initialSignature,
  initialConsent = false,
}: DigitalSignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(Boolean(initialSignature));
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [typedSignature, setTypedSignature] = useState(signerName || '');
  const [isConfirmed, setIsConfirmed] = useState(Boolean(initialConsent));

  // Initialize and scale canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = '#1e1b4b'; // Deep indigo / slate
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasDrawn(true);
      };
      img.src = initialSignature;
    }
  }, [mode]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      const mouseEvent = e as React.MouseEvent;
      return {
        x: mouseEvent.clientX - rect.left,
        y: mouseEvent.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    exportCanvas(isConfirmed);
  };

  const exportCanvas = (confirmedState: boolean = isConfirmed) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSignatureChange(dataUrl, confirmedState);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    onSignatureChange(null, isConfirmed);
  };

  const handleApplyTyped = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    ctx.font = 'italic bold 26px cursive, "Brush Script MT", Georgia';
    ctx.fillStyle = '#4338ca'; // Indigo
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedSignature || signerName || 'Katalyst Scholar', rect.width / 2, rect.height / 2);

    setHasDrawn(true);
    exportCanvas(isConfirmed);
  };

  return (
    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PenTool className="w-4 h-4 text-rose-600" />
          <span className="text-xs font-extrabold text-slate-800">
            Digital E-Signature &amp; Legal Declaration *
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-slate-200/80 p-0.5 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setMode('draw')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                mode === 'draw' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PenTool className="w-3 h-3" />
              <span>Draw</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('type')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                mode === 'type' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Type className="w-3 h-3" />
              <span>Type</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {mode === 'type' && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your full legal name..."
            value={typedSignature}
            onChange={(e) => setTypedSignature(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 outline-none focus:border-rose-500"
          />
          <button
            type="button"
            onClick={handleApplyTyped}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Apply Signature
          </button>
        </div>
      )}

      {/* Canvas Area */}
      <div className="relative rounded-xl overflow-hidden bg-white border-2 border-dashed border-slate-300 hover:border-rose-400 transition-colors">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-32 cursor-crosshair touch-none"
        />

        {!hasDrawn && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-300 text-xs font-medium">
            <Sparkles className="w-5 h-5 mb-1 text-slate-300" />
            <span>{mode === 'draw' ? 'Sign your name here with mouse or finger' : 'Click "Apply Signature" above to generate'}</span>
          </div>
        )}

        <div className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-400 pointer-events-none">
          E-Sign Pad &bull; Katalyst Verification
        </div>
      </div>

      {/* Legal Disclaimer & Consent Checkbox */}
      <div className="space-y-2 pt-1">
        <label className="flex items-start gap-2 text-[11px] font-medium text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={isConfirmed}
            onChange={(e) => {
              const val = e.target.checked;
              setIsConfirmed(val);
              const canvas = canvasRef.current;
              const dataUrl = canvas ? canvas.toDataURL('image/png') : null;
              onSignatureChange(hasDrawn ? dataUrl : null, val);
            }}
            className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5 cursor-pointer"
          />
          <span>
            I certify that the information provided in this 4-step fellowship application is accurate and true to the best of my knowledge. My digital signature serves as binding consent for admission evaluation.
          </span>
        </label>

        {hasDrawn && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Digital Signature Captured &bull; Ready for Submission</span>
          </div>
        )}
      </div>
    </div>
  );
}
