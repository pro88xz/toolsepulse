"use client";

/**
 * Tool Inbox — workflow runtime for passing files between tools.
 * Single-slot IndexedDB store, 1-hour TTL, gracefully no-ops if IndexedDB unavailable.
 */

const DB_NAME = "toolsepulse-inbox";
const STORE = "current";
const SLOT_KEY = "active";
const EXPIRY_MS = 60 * 60 * 1000;

export type InboxItem = {
  blob: Blob;
  fileName: string;
  sourceTool: string;
  mimeType: string;
  placedAt: number;
};

export type InboxPreview = {
  fileName: string;
  sourceTool: string;
  size: number;
  ageMs: number;
};

function openDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      resolve(null);
      return;
    }
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function placeInInbox(blob: Blob, fileName: string, sourceTool: string): Promise<boolean> {
  const db = await openDB();
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      const item: InboxItem = { blob, fileName, sourceTool, mimeType: blob.type || "application/octet-stream", placedAt: Date.now() };
      store.put(item, SLOT_KEY);
      tx.oncomplete = () => { db.close(); resolve(true); };
      tx.onerror = () => { db.close(); resolve(false); };
    } catch {
      db.close();
      resolve(false);
    }
  });
}

export async function peekInbox(): Promise<InboxPreview | null> {
  const db = await openDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(SLOT_KEY);
      req.onsuccess = () => {
        const item = req.result as InboxItem | undefined;
        db.close();
        if (!item) return resolve(null);
        const ageMs = Date.now() - item.placedAt;
        if (ageMs > EXPIRY_MS) return resolve(null);
        resolve({ fileName: item.fileName, sourceTool: item.sourceTool, size: item.blob.size, ageMs });
      };
      req.onerror = () => { db.close(); resolve(null); };
    } catch {
      db.close();
      resolve(null);
    }
  });
}

export async function takeFromInbox(): Promise<InboxItem | null> {
  const db = await openDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      const req = store.get(SLOT_KEY);
      req.onsuccess = () => {
        const item = req.result as InboxItem | undefined;
        if (!item) { db.close(); return resolve(null); }
        const ageMs = Date.now() - item.placedAt;
        if (ageMs > EXPIRY_MS) {
          store.delete(SLOT_KEY);
          db.close();
          return resolve(null);
        }
        store.delete(SLOT_KEY);
        tx.oncomplete = () => { db.close(); resolve(item); };
      };
      req.onerror = () => { db.close(); resolve(null); };
    } catch {
      db.close();
      resolve(null);
    }
  });
}

export async function clearInbox(): Promise<void> {
  const db = await openDB();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(SLOT_KEY);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); resolve(); };
    } catch {
      db.close();
      resolve();
    }
  });
}

export function inboxItemToFile(item: InboxItem): File {
  return new File([item.blob], item.fileName, { type: item.mimeType });
}

// ─── STRING INBOX (for text-only tools) ──────────────────────────────────
// Same store/DB, separate slot key. Strings flow alongside files.

const SLOT_KEY_STRING = "active-string";

export type InboxStringItem = {
  text: string;
  sourceTool: string;
  placedAt: number;
};

export type InboxStringPreview = {
  sourceTool: string;
  chars: number;
  ageMs: number;
};

export async function placeStringInInbox(text: string, sourceTool: string): Promise<boolean> {
  const db = await openDB();
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, "readwrite");
      const item: InboxStringItem = { text, sourceTool, placedAt: Date.now() };
      tx.objectStore(STORE).put(item, SLOT_KEY_STRING);
      tx.oncomplete = () => { db.close(); resolve(true); };
      tx.onerror = () => { db.close(); resolve(false); };
    } catch {
      db.close();
      resolve(false);
    }
  });
}

export async function peekStringInbox(): Promise<InboxStringPreview | null> {
  const db = await openDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(SLOT_KEY_STRING);
      req.onsuccess = () => {
        const item = req.result as InboxStringItem | undefined;
        db.close();
        if (!item) return resolve(null);
        const ageMs = Date.now() - item.placedAt;
        if (ageMs > EXPIRY_MS) return resolve(null);
        resolve({ sourceTool: item.sourceTool, chars: item.text.length, ageMs });
      };
      req.onerror = () => { db.close(); resolve(null); };
    } catch {
      db.close();
      resolve(null);
    }
  });
}

export async function takeStringFromInbox(): Promise<InboxStringItem | null> {
  const db = await openDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      const req = store.get(SLOT_KEY_STRING);
      req.onsuccess = () => {
        const item = req.result as InboxStringItem | undefined;
        if (!item) { db.close(); return resolve(null); }
        const ageMs = Date.now() - item.placedAt;
        if (ageMs > EXPIRY_MS) {
          store.delete(SLOT_KEY_STRING);
          db.close();
          return resolve(null);
        }
        store.delete(SLOT_KEY_STRING);
        tx.oncomplete = () => { db.close(); resolve(item); };
      };
      req.onerror = () => { db.close(); resolve(null); };
    } catch {
      db.close();
      resolve(null);
    }
  });
}

export async function clearStringInbox(): Promise<void> {
  const db = await openDB();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(SLOT_KEY_STRING);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); resolve(); };
    } catch {
      db.close();
      resolve();
    }
  });
}
