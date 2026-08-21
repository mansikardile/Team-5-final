'use client';

import React, { useRef } from 'react';
import { X, QrCode, Copy, ExternalLink, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    code: string;
    title: string;
    collegeName: string;
  } | null;
}

export default function QRCodeModal({
  isOpen,
  onClose,
  event,
}: QRCodeModalProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !event) return null;

  const registrationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/register/${event.code}`
    : `http://localhost:3000/register/${event.code}`;

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20, 360, 360);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `katalyst_qr_${event.code}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <QrCode className="w-4 h-4 text-sky-600" />
            <span>Event Registration QR</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Event Details */}
        <div className="mb-4">
          <h4 className="font-bold text-slate-900 text-sm leading-snug">
            {event.title}
          </h4>
          <p className="text-xs text-slate-500">{event.collegeName}</p>
          <span className="inline-block mt-1.5 font-mono text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200/60 px-2.5 py-0.5 rounded-md">
            {event.code}
          </span>
        </div>

        {/* Crisp Vector QR Code Box */}
        <div
          ref={qrRef}
          className="p-5 bg-white rounded-2xl border border-slate-200 inline-block shadow-sm mb-4"
        >
          <QRCodeSVG
            value={registrationUrl}
            size={180}
            level="H"
            includeMargin={true}
          />
          <p className="text-[10px] text-slate-400 mt-2 font-medium">
            Scan with any phone camera to register
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleDownloadQR}
            className="w-full py-2.5 px-3 bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download High-Res QR (PNG)</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(registrationUrl);
                alert('Registration link copied!');
              }}
              className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>
            <a
              href={registrationUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Form</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
