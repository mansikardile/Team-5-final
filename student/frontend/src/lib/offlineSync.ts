'use client';

import { api } from './api';

export interface OfflineRegistration {
  id: string;
  trackingId: string;
  eventId: string;
  fullName: string;
  email: string;
  phone: string;
  collegeName: string;
  yearOfStudy: string;
  branch: string;
  digitalConsent: boolean;
  signatureDataUrl?: string;
  registeredAt: string;
}

const OFFLINE_STORAGE_KEY = 'katalyst_offline_registrations_queue';

export const getOfflineQueue = (): OfflineRegistration[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(OFFLINE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveOfflineRegistration = (
  reg: Omit<OfflineRegistration, 'id' | 'trackingId' | 'registeredAt'>
): OfflineRegistration => {
  const queue = getOfflineQueue();
  const trackingId = `off_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newRecord: OfflineRegistration = {
    ...reg,
    id: trackingId,
    trackingId,
    registeredAt: new Date().toISOString(),
  };

  queue.push(newRecord);
  localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(queue));
  return newRecord;
};

export const syncOfflineQueue = async (): Promise<{
  syncedCount: number;
  failedCount: number;
}> => {
  const queue = getOfflineQueue();
  if (queue.length === 0) return { syncedCount: 0, failedCount: 0 };

  const remaining: OfflineRegistration[] = [];
  let synced = 0;

  for (const item of queue) {
    try {
      await api.post(`/sessions/${item.eventId}/register`, {
        fullName: item.fullName,
        email: item.email,
        phone: item.phone,
        collegeName: item.collegeName,
        yearOfStudy: item.yearOfStudy,
        branch: item.branch,
        digitalConsent: item.digitalConsent,
        signatureDataUrl: item.signatureDataUrl,
        syncedFromOffline: true,
      });
      synced++;
    } catch (err) {
      console.warn('Offline item sync deferred:', err);
      remaining.push(item);
    }
  }

  localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(remaining));
  return { syncedCount: synced, failedCount: remaining.length };
};
