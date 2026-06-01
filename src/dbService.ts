/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RSVP } from './types';

const CLOUD_KV_URL = 'https://kvdb.io/ketrolin_sharon_joyal_christo_royal_wedding_v7/rsvps';
const LOCAL_STORAGE_KEY = 'ketrolin_joyal_rsvps_v3';

// Helper to check if our Express local API is working
let isExpressBackendActive: boolean | null = null;

async function checkBackendActive(): Promise<boolean> {
  if (isExpressBackendActive !== null) {
    return isExpressBackendActive;
  }
  try {
    const res = await fetch('/api/rsvps', { method: 'GET' });
    // If it returns HTML (like index.html in fallback SPA routings), it's static hosting, not the Express backend API
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      isExpressBackendActive = true;
      return true;
    }
    isExpressBackendActive = false;
    return false;
  } catch (err) {
    isExpressBackendActive = false;
    return false;
  }
}

/**
 * Retrieves the full list of RSVPs / Blessings
 */
export async function getRSVPs(): Promise<RSVP[]> {
  const isBackend = await checkBackendActive();
  
  if (isBackend) {
    try {
      const res = await fetch('/api/rsvps');
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('Failed to retrieve from Express backend, fallback to cloud:', e);
    }
  }

  // 2. Try Cloud remote key-value storage
  try {
    const cloudRes = await fetch(CLOUD_KV_URL);
    if (cloudRes.ok) {
      const data = await cloudRes.json();
      if (Array.isArray(data)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    } else if (cloudRes.status === 404) {
      // First time loading - cloud bucket is empty, seed defaults
      console.log('Cloud database initialized for the first time');
      return [];
    }
  } catch (e) {
    console.warn('Failed to retrieve from Cloud KV, fallback to Local Storage:', e);
  }

  // 3. Last resort: local storage
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  return [];
}

/**
 * Adds a new RSVP blessing
 */
export async function addRSVP(name: string, attendance: 'yes' | 'no' | 'maybe', guests: number, message: string): Promise<RSVP> {
  const isBackend = await checkBackendActive();

  const newRSVP: RSVP = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
    name: name.trim(),
    attendance,
    guests: attendance === 'yes' ? guests : 0,
    message: message.trim(),
    createdAt: new Date().toISOString()
  };

  if (isBackend) {
    try {
      const res = await fetch('/api/rsvps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRSVP)
      });
      if (res.ok) {
        const saved = await res.json();
        // Sync local storage
        const current = await getRSVPs();
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return saved;
      }
    } catch (e) {
      console.warn('Failed to save to Express backend, fallback to cloud:', e);
    }
  }

  // Cloud & Local backup storage flow
  try {
    // Read current first so we don't overwrite other people's submissions
    let current: RSVP[] = [];
    const cloudRes = await fetch(CLOUD_KV_URL);
    if (cloudRes.ok) {
      const parsed = await cloudRes.json();
      if (Array.isArray(parsed)) {
        current = parsed;
      }
    }
    
    // Add new RSVP on top of current list
    current = [newRSVP, ...current.filter(item => item.id !== newRSVP.id)];
    
    // Put back to cloud
    await fetch(CLOUD_KV_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(current)
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
    return newRSVP;

  } catch (e) {
    console.warn('Failed to save to Cloud KV, writing locally only:', e);
    // Offline local storage fallback
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const localList: RSVP[] = raw ? JSON.parse(raw) : [];
    localList.unshift(newRSVP);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localList));
    return newRSVP;
  }
}

/**
 * Deletes an RSVP blessing (optional administrative endpoint)
 */
export async function deleteRSVP(id: string): Promise<boolean> {
  const isBackend = await checkBackendActive();

  // Local sync
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  let localList: RSVP[] = raw ? JSON.parse(raw) : [];
  localList = localList.filter(item => item.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localList));

  if (isBackend) {
    try {
      await fetch(`/api/rsvps/${id}`, { method: 'DELETE' });
      return true;
    } catch (e) {
      console.warn('Express backend delete failed:', e);
    }
  }

  // Cloud sync
  try {
    let current: RSVP[] = [];
    const cloudRes = await fetch(CLOUD_KV_URL);
    if (cloudRes.ok) {
      current = await cloudRes.json();
    }
    current = current.filter(item => item.id !== id);
    
    await fetch(CLOUD_KV_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(current)
    });
    return true;
  } catch (err) {
    console.warn('Cloud KV delete failed:', err);
    return false;
  }
}
