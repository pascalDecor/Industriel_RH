"use client";

import { useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { baseApiURL } from '@/constant/api';
import { toast } from 'sonner';
import { errorToastClassName } from '@/utils/toast.helper';

interface RefreshTokenOptions {
  onRefreshSuccess?: () => void;
  onRefreshError?: () => void;
  enableAutoRefresh?: boolean;
}

export function useRefreshToken(options: RefreshTokenOptions = {}) {
  const {
    onRefreshSuccess,
    onRefreshError,
    enableAutoRefresh = true
  } = options;

  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  /**
   * Rafraîchit le token d'accès
   */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (isRefreshingRef.current) {
      return false;
    }

    try {
      isRefreshingRef.current = true;
      
      const response = await axios.post(`${baseApiURL}/auth/refresh`, {}, {
        withCredentials: true
      });

      if (response.status === 200) {
        onRefreshSuccess?.();
        
        // Programmer le prochain refresh (1h45 = 105 minutes)
        if (enableAutoRefresh) {
          scheduleNextRefresh();
        }
        
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Erreur lors du refresh token:', error);
      
      // Si le refresh échoue, déconnecter l'utilisateur
      onRefreshError?.();
      
      if (error.response?.status === 401) {
        toast.error('Session expirée', {
          className: errorToastClassName,
          description: 'Veuillez vous reconnecter',
          duration: 5000
        });
      }
      
      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  }, [onRefreshSuccess, onRefreshError, enableAutoRefresh]);

  /**
   * Programme le prochain rafraîchissement automatique
   */
  const scheduleNextRefresh = useCallback(() => {
    // Nettoyer le timeout précédent
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Programmer le refresh 15 minutes avant l'expiration (1h45 = 105 minutes)
    refreshTimeoutRef.current = setTimeout(() => {
      refreshToken();
    }, 105 * 60 * 1000); // 105 minutes en millisecondes
  }, [refreshToken]);

  /**
   * Démarre le système de refresh automatique
   */
  const startAutoRefresh = useCallback(() => {
    if (enableAutoRefresh) {
      scheduleNextRefresh();
    }
  }, [enableAutoRefresh, scheduleNextRefresh]);

  /**
   * Arrête le système de refresh automatique
   */
  const stopAutoRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  }, []);

  // Démarrer le refresh automatique au montage du composant
  useEffect(() => {
    if (enableAutoRefresh) {
      startAutoRefresh();
    }

    // Nettoyer au démontage
    return () => {
      stopAutoRefresh();
    };
  }, [enableAutoRefresh, startAutoRefresh, stopAutoRefresh]);

  // Nettoyer les timeouts lors du démontage
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  return {
    refreshToken,
    startAutoRefresh,
    stopAutoRefresh,
    isRefreshing: isRefreshingRef.current
  };
}