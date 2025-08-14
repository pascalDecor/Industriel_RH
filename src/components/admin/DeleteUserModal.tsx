"use client";

import React, { useState } from 'react';
import Button from '@/components/ui/button';
import { 
  Trash2, 
  AlertTriangle,
  X,
  Shield
} from 'lucide-react';

interface DeleteUserModalProps {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteUserModal({ 
  user, 
  isOpen, 
  onClose, 
  onConfirm, 
  loading = false 
}: DeleteUserModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const expectedText = 'SUPPRIMER DEFINITIVEMENT';

  const handleConfirm = () => {
    if (confirmText === expectedText) {
      onConfirm();
    }
  };

  const resetAndClose = () => {
    setConfirmText('');
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-red-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Supprimer l'utilisateur
                </h2>
                <p className="text-sm text-gray-600">
                  Action irréversible
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={resetAndClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* User info */}
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-200 flex items-center justify-center">
                <span className="text-sm font-medium text-red-800">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                {user.role && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Shield className="h-3 w-3" />
                    {user.role}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-2">⚠️ Attention - Cette action est irréversible !</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Toutes les données de l'utilisateur seront définitivement supprimées</li>
                  <li>L'historique de ses actions sera perdu</li>
                  <li>Les documents associés pourraient devenir orphelins</li>
                  <li>Cette action ne peut pas être annulée</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Confirmation input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pour confirmer, tapez exactement : 
              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-red-600 ml-1">
                {expectedText}
              </span>
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Tapez le texte de confirmation"
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={resetAndClose}
              className="flex-1"
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={confirmText !== expectedText || loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {loading ? 'Suppression...' : 'Supprimer définitivement'}
            </Button>
          </div>

          {/* Additional warning */}
          <p className="text-xs text-gray-500 text-center pt-2 border-t">
            Cette action supprimera définitivement le compte de {user.name} et toutes ses données associées.
            Assurez-vous d'avoir sauvegardé toutes les informations importantes avant de continuer.
          </p>
        </div>
      </div>
    </div>
  );
}