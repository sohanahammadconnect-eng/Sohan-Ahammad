import { VideoItem } from '../types';

/**
 * Reliable client-side storage using IndexedDB with localStorage fallback
 * Allows storing high-resolution images & videos (data URLs / Blobs) without 5MB quota limits.
 */

const DB_NAME = 'sohan_portfolio_db';
const DB_VERSION = 1;
const STORE_NAME = 'portfolio_media';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function setItem(key: string, val: unknown): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(val, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (err) {
      console.warn('Storage quota exceeded on fallback', err);
    }
  }
}

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve((req.result as T) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    localStorage.removeItem(key);
  }
}

export async function clearAll(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    localStorage.clear();
  }
}

/**
 * Extracts YouTube video ID from standard URLs:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - Plain VIDEO_ID
 */
export function extractYouTubeId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  
  // Direct 11 char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  
  // youtu.be/ID
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // youtube.com/watch?v=ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // youtube.com/shorts/ID
  const shortsMatch = trimmed.match(/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  // youtube.com/embed/ID
  const embedMatch = trimmed.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  return trimmed;
}

const blobUrlCache = new Map<string, string>();

/**
 * Uploads a user-selected video file:
 * 1. Stores binary blob in IndexedDB for immediate local offline playback.
 * 2. Streams to server /api/upload-video to persist as a static server asset (/uploads/...).
 */
export async function uploadVideoFile(file: File): Promise<{ url: string; blobKey: string }> {
  const blobKey = `video_blob_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  // Store blob in IndexedDB
  await setItem(blobKey, file);

  // Attempt server upload
  try {
    const res = await fetch('/api/upload-video', {
      method: 'POST',
      headers: {
        'x-filename': encodeURIComponent(file.name),
        'Content-Type': file.type || 'video/mp4',
      },
      body: file,
    });
    if (res.ok) {
      const data = await res.json();
      if (data.url) {
        return { url: data.url, blobKey };
      }
    }
  } catch (err) {
    console.warn('Server upload not available, using client blob storage', err);
  }

  // Fallback to local Object URL
  const localUrl = URL.createObjectURL(file);
  blobUrlCache.set(blobKey, localUrl);
  return { url: localUrl, blobKey };
}

/**
 * Resolves the playable URL for a video item:
 * - If server asset or remote URL, returns as-is.
 * - If blobKey exists, fetches the Blob from IndexedDB and creates an Object URL.
 */
export async function resolveVideoUrl(video: Partial<VideoItem>): Promise<string> {
  if (video.videoSourceType === 'youtube' && !video.videoUrl) {
    return '';
  }

  // If server path or http URL
  if (video.videoUrl && (video.videoUrl.startsWith('/uploads/') || video.videoUrl.startsWith('http'))) {
    return video.videoUrl;
  }

  // If blobKey exists in IndexedDB
  if (video.blobKey) {
    if (blobUrlCache.has(video.blobKey)) {
      return blobUrlCache.get(video.blobKey)!;
    }
    const blob = await getItem<Blob>(video.blobKey);
    if (blob) {
      const url = URL.createObjectURL(blob);
      blobUrlCache.set(video.blobKey, url);
      return url;
    }
  }

  return video.videoUrl || '';
}
