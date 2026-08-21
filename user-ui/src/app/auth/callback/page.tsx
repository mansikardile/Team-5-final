'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [statusText, setStatusText] = useState('Verifying Google Account...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isHandled = false;

    async function handleAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          setErrorMsg(error.message);
          return;
        }

        if (session?.user && !isHandled) {
          isHandled = true;
          const user = session.user;
          const email = user.email || '';
          const fullName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            email.split('@')[0] ||
            'Katalyst Student';
          const profileImageUrl =
            user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

          setStatusText('Activating Katalyst Scholar Profile...');

          // Sync with our backend PostgreSQL database
          const res = await api.post('/auth/google', {
            email,
            fullName,
            googleId: user.id,
            profileImageUrl,
          });

          if (res.data?.data?.token) {
            localStorage.setItem('katalyst_student_token', res.data.data.token);
            localStorage.setItem(
              'katalyst_student_user',
              JSON.stringify(res.data.data.student)
            );
          }

          setStatusText('Authentication Successful! Redirecting...');
          setTimeout(() => {
            router.replace('/');
          }, 800);
        }
      } catch (err: any) {
        setErrorMsg(
          err.response?.data?.message || err.message || 'Google authentication sync failed.'
        );
      }
    }

    // Check immediately and also subscribe to auth state changes for OAuth redirect
    handleAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user && !isHandled) {
          handleAuth();
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-xl border border-slate-200/80 text-center">
        {errorMsg ? (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Authentication Error
              </h2>
              <p className="text-xs text-slate-500 mt-1">{errorMsg}</p>
            </div>
            <button
              onClick={() => router.replace('/login')}
              className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
              <div className="w-6 h-6 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Connecting with Google
              </h2>
              <p className="text-xs text-slate-500 mt-1">{statusText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
