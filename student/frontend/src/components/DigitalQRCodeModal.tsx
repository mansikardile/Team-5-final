'use client';

import React from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  ShieldCheck,
  Download,
  Calendar,
  MapPin,
  Building2,
  Lock,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface DigitalQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: any;
  studentName: string;
  isAccepted?: boolean;
}

export default function DigitalQRCodeModal({
  isOpen,
  onClose,
  registration,
  studentName,
  isAccepted = false,
}: DigitalQRCodeModalProps) {
  if (!isOpen || !registration) return null;

  const event = registration.event;
  const college = registration.student?.collegeName || event?.collegeName || 'Engineering College';
  const statusText = isAccepted ? 'ACCEPTED (Katalyst Fellow 🎓)' : 'PENDING REVIEW';

  // Pretty-printed formatted pass text for any QR reader / Google Lens scanner
  const qrData = [
    `🎓 KATALYST VERIFIED SCHOLAR PASS`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👤 Student: ${studentName || registration.student?.fullName || 'Katalyst Scholar'}`,
    `🏫 College: ${college}`,
    `📌 Status: ${statusText}`,
    `🎫 Event: ${event?.title || 'Campus Drive'} (${event?.code || 'KAT-PASS'})`,
    `🆔 Tracking ID: ${registration.trackingId || 'KAT-VERIFIED'}`,
    `📅 Date: ${event?.eventDate ? new Date(event.eventDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Active Entry'}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Official Katalyst STEM Fellowship Pass`,
  ].join('\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs font-bold"
        >
          <X className="w-4 h-4" />
        </button>

        {isAccepted ? (
          /* UNLOCKED: ACCEPTED FELLOW PASS */
          <div className="space-y-4 pt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-extrabold uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Official Fellow Entry Pass &bull; Accepted</span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                {event?.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Katalyst Fellow: <span className="font-bold text-slate-800">{studentName}</span>
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-3.5 bg-purple-50/50 rounded-2xl border border-purple-200 inline-block shadow-inner">
              <QRCodeSVG
                value={qrData}
                size={170}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Pass Details */}
            <div className="space-y-1.5 text-left text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100 font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>
                  {new Date(event?.eventDate).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">{event?.collegeName}</span>
              </div>
              {event?.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{event?.location}</span>
                </div>
              )}
              <div className="pt-1.5 border-t border-slate-200 text-[10px] text-purple-700 font-mono font-bold flex items-center justify-between">
                <span>Pass ID: {registration.trackingId}</span>
                <span className="text-emerald-600">✓ VERIFIED</span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save / Print Fellow Pass</span>
            </button>
          </div>
        ) : (
          /* LOCKED: APPLICATION UNDER REVIEW */
          <div className="space-y-4 pt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-extrabold uppercase">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Application Under Review</span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                QR Pass Locked (Pending Review)
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Official scannable QR passes are issued exclusively to candidates whose applications have been <strong>Accepted</strong> by the Katalyst admission committee.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1 font-medium text-slate-600">
              <p>&bull; <strong>Tracking ID:</strong> <span className="font-mono text-slate-800 font-bold">{registration.trackingId}</span></p>
              <p>&bull; <strong>Current Status:</strong> <span className="font-bold text-amber-700">{registration.leadStatus || 'REGISTERED (Under Review)'}</span></p>
              <p>&bull; <strong>Next Step:</strong> Complete your application to expedite acceptance.</p>
            </div>

            {registration.trackingId && (
              <Link
                href={`/apply/${registration.trackingId}`}
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-200" />
                <span>Complete Application for Acceptance</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            <button
              onClick={onClose}
              className="w-full py-1 text-xs font-bold text-slate-400 hover:text-slate-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
