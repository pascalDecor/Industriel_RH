"use client";

import React from 'react';
import { useCacheInvalidation } from '@/hooks/useCacheInvalidation';

// Composant de debug pour tester l'invalidation des caches (à retirer en production)
export const CacheDebugPanel = () => {
  const {
    invalidateSectors,
    invalidateNotices,
    invalidateFunctions,
    invalidateSpecialites,
    invalidateTags,
    invalidateAll
  } = useCacheInvalidation();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Cache Debug</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <button onClick={() => invalidateSectors()} style={{ padding: '4px 8px', fontSize: '11px' }}>
          Refresh Sectors
        </button>
        <button onClick={() => invalidateNotices()} style={{ padding: '4px 8px', fontSize: '11px' }}>
          Refresh Notices
        </button>
        <button onClick={() => invalidateFunctions()} style={{ padding: '4px 8px', fontSize: '11px' }}>
          Refresh Functions
        </button>
        <button onClick={() => invalidateSpecialites()} style={{ padding: '4px 8px', fontSize: '11px' }}>
          Refresh Specialites
        </button>
        <button onClick={() => invalidateTags()} style={{ padding: '4px 8px', fontSize: '11px' }}>
          Refresh Tags
        </button>
        <button
          onClick={() => invalidateAll()}
          style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#ff6b6b' }}
        >
          Refresh ALL
        </button>
      </div>
    </div>
  );
};