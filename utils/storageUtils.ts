/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CalculationResult, DefectItem, InspectionLevel, InspectionMetadata, InspectionStrictness } from '../types';
import { Language } from './i18n';

const STORAGE_KEYS = {
  METADATA: 'aql_audit_metadata_v1',
  PARAMS: 'aql_audit_params_v1',
  DEFECTS: 'aql_audit_defects_v1',
  SIGNATURES: 'aql_audit_signatures_v1',
  THEME: 'aql_app_theme_v1',
  LANGUAGE: 'aql_app_language_v1',
  LAST_SAVED: 'aql_audit_last_saved_v1',
};

export interface StoredCalculationParams {
  lotSize: number;
  inspectionLevel: InspectionLevel;
  strictness: InspectionStrictness;
  criticalAql: number;
  majorAql: number;
  minorAql: number;
}

export interface StoredSignatures {
  inspectorSignature: string | null;
  representativeSignature: string | null;
  representativeName: string;
}

export interface StoredInspectionDraft {
  metadata: InspectionMetadata | null;
  params: StoredCalculationParams | null;
  defects: DefectItem[] | null;
  signatures: StoredSignatures | null;
  lastSaved: string | null;
}

/**
 * Save complete inspection audit draft to browser local storage.
 * Handles storage quota limitations safely.
 */
export function saveInspectionDraft(
  metadata: InspectionMetadata,
  params: StoredCalculationParams,
  defects: DefectItem[],
  signatures?: StoredSignatures
): { success: boolean; timestamp: string; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, timestamp: '' };
  }

  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  try {
    localStorage.setItem(STORAGE_KEYS.METADATA, JSON.stringify(metadata));
    localStorage.setItem(STORAGE_KEYS.PARAMS, JSON.stringify(params));
    localStorage.setItem(STORAGE_KEYS.DEFECTS, JSON.stringify(defects));

    if (signatures) {
      localStorage.setItem(STORAGE_KEYS.SIGNATURES, JSON.stringify(signatures));
    }

    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, timestamp);
    return { success: true, timestamp };
  } catch (err: unknown) {
    console.warn('LocalStorage save attempt warning:', err);

    // If quota is exceeded (e.g. large photos attached to defects), attempt saving defects with lightweight photos
    try {
      const sanitizedDefects = defects.map((d) => ({
        ...d,
        // If photo is excessively huge (> 500kb), keep it but try saving without if needed
        photoUrl: d.photoUrl && d.photoUrl.length > 500000 ? d.photoUrl.slice(0, 100000) : d.photoUrl,
      }));

      localStorage.setItem(STORAGE_KEYS.DEFECTS, JSON.stringify(sanitizedDefects));
      localStorage.setItem(STORAGE_KEYS.METADATA, JSON.stringify(metadata));
      localStorage.setItem(STORAGE_KEYS.PARAMS, JSON.stringify(params));
      localStorage.setItem(STORAGE_KEYS.LAST_SAVED, timestamp);
      return { success: true, timestamp };
    } catch (fallbackErr) {
      return {
        success: false,
        timestamp,
        error: 'Device storage quota reached. Please export or remove some photos.',
      };
    }
  }
}

/**
 * Restore stored inspection draft from local storage
 */
export function loadInspectionDraft(): StoredInspectionDraft {
  if (typeof window === 'undefined') {
    return { metadata: null, params: null, defects: null, signatures: null, lastSaved: null };
  }

  try {
    const rawMeta = localStorage.getItem(STORAGE_KEYS.METADATA);
    const rawParams = localStorage.getItem(STORAGE_KEYS.PARAMS);
    const rawDefects = localStorage.getItem(STORAGE_KEYS.DEFECTS);
    const rawSigs = localStorage.getItem(STORAGE_KEYS.SIGNATURES);
    const lastSaved = localStorage.getItem(STORAGE_KEYS.LAST_SAVED);

    return {
      metadata: rawMeta ? JSON.parse(rawMeta) : null,
      params: rawParams ? JSON.parse(rawParams) : null,
      defects: rawDefects ? JSON.parse(rawDefects) : null,
      signatures: rawSigs ? JSON.parse(rawSigs) : null,
      lastSaved: lastSaved || null,
    };
  } catch (err) {
    console.error('Error parsing stored draft from LocalStorage:', err);
    return { metadata: null, params: null, defects: null, signatures: null, lastSaved: null };
  }
}

/**
 * Clear stored inspection draft (reset to clean state)
 */
export function clearInspectionDraft(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.METADATA);
    localStorage.removeItem(STORAGE_KEYS.PARAMS);
    localStorage.removeItem(STORAGE_KEYS.DEFECTS);
    localStorage.removeItem(STORAGE_KEYS.SIGNATURES);
    localStorage.removeItem(STORAGE_KEYS.LAST_SAVED);
  } catch (err) {
    console.error('Failed to clear inspection storage:', err);
  }
}

/**
 * Theme persistence (light / dark)
 */
export function getStoredTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    if (stored === 'dark' || stored === 'light') return stored;
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // fallback
  }
  return 'light';
}

export function setStoredTheme(theme: 'light' | 'dark'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (err) {
    console.error('Failed to store theme:', err);
  }
}

/**
 * Language persistence (en / kh / cn)
 */
export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (stored === 'en' || stored === 'kh' || stored === 'cn') {
      return stored as Language;
    }
  } catch {
    // fallback
  }
  return 'en';
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  } catch (err) {
    console.error('Failed to store language:', err);
  }
}
