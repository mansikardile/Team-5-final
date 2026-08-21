'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  QrCode,
  Sparkles,
  Calendar,
  Building2,
  MapPin,
  Copy,
  CheckCircle2,
  ExternalLink,
  Share2,
} from 'lucide-react';

interface EventRegistrationQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
}

export default function EventRegistrationQRModal({
  isOpen,
  onClose,
  event,
}: EventRegistrationQRModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !event) return null;

  // Registration URL that opens when scanned
  const registrationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/register/${event.code}`
    : `http://localhost:3001/register/${event.code}`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(registrationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs font-bold"
        >
          ✕
        </button>

        {/* Header Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-extrabold uppercase mb-3">
          <QrCode className="w-3.5 h-3.5" />
          <span>Scan to Register on Mobile</span>
        </div>

        <h3 className="text-base font-extrabold text-slate-900 leading-snug">
          {event.title}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 mb-4 truncate">
          {event.collegeName} &bull; <span className="font-mono font-bold text-slate-700">{event.code}</span>
        </p>

        {/* Big Scannable QR Code */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner mb-4">
          <QRCodeSVG
            value={registrationUrl}
            size={190}
            level="H"
            includeMargin={true}
          />
        </div>

        <p className="text-[11px] text-slate-600 mb-4 px-2 leading-relaxed">
          Point your phone camera or Google Lens at this QR code to open the instant registration form without signing up!
        </p>

        {/* Event Quick Info */}
        <div className="space-y-1.5 text-left text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>
              {new Date(event.eventDate).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Link Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Direct Registration Link</span>
              </>
            )}
          </button>

          <a
            href={registrationUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center justify-center gap-1"
          >
            <span>Open Link in New Tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
