/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { RSVP } from './types';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
// Establish connection with the provisioned Firestore database
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const LOCAL_STORAGE_KEY = 'ketrolin_joyal_rsvps_v3';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

/**
 * Custom function to handle and log Firestore errors with metadata
 */
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Retrieves the full list of RSVPs / Blessings persistently from Firestore
 */
export async function getRSVPs(): Promise<RSVP[]> {
  try {
    const q = query(collection(db, 'rsvps'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const results: RSVP[] = [];
    
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      results.push({
        id: docSnap.id,
        name: data.name || '',
        attendance: data.attendance || 'yes',
        guests: Number(data.guests) || 1,
        message: data.message || '',
        createdAt: data.createdAt || new Date().toISOString(),
      });
    });

    // Save to local storage for quick access in fallback
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(results));
    return results;
  } catch (error) {
    console.warn('Firestore fetch failed, checking local storage fallback:', error);
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
}

/**
 * Adds a new RSVP blessing persistently to our Cloud Firestore database
 */
export async function addRSVP(
  name: string,
  attendance: 'yes' | 'no' | 'maybe',
  guests: number,
  message: string
): Promise<RSVP> {
  const newId = typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2, 15);

  const newRSVP: RSVP = {
    id: newId,
    name: name.trim(),
    attendance,
    guests: attendance === 'yes' ? guests : 0,
    message: message.trim(),
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = doc(db, 'rsvps', newId);
    await setDoc(docRef, {
      id: newRSVP.id,
      name: newRSVP.name,
      attendance: newRSVP.attendance,
      guests: Number(newRSVP.guests),
      message: newRSVP.message,
      createdAt: newRSVP.createdAt
    });

    // Sync local list smoothly
    try {
      const current = await getRSVPs();
      const updated = [newRSVP, ...current.filter(item => item.id !== newRSVP.id)];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore inner getRSVPs errors
    }

    return newRSVP;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `rsvps/${newId}`);
    throw error;
  }
}

/**
 * Deletes an RSVP blessing persistently from Firestore
 */
export async function deleteRSVP(id: string): Promise<boolean> {
  // Sync locally first
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  let localList: RSVP[] = raw ? JSON.parse(raw) : [];
  localList = localList.filter(item => item.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localList));

  try {
    await deleteDoc(doc(db, 'rsvps', id));
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `rsvps/${id}`);
    return false;
  }
}
