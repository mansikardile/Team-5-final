'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '@/lib/translations';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageSwitcher({
  currentLang,
  onLanguageChange,
}: LanguageSwitcherProps) {
  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200 shadow-inner">
      <div className="pl-1.5 pr-1 text-slate-400">
        <Globe className="w-3.5 h-3.5" />
      </div>
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => onLanguageChange(l.code)}
          className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
            currentLang === l.code
              ? 'bg-white text-rose-600 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
