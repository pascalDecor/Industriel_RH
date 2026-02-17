"use client";

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import { Plus, AlertCircle, CheckCircle, Mail } from 'lucide-react';

interface AssignableRole {
  id: string;
  code: string;
  label: string;
  level: number;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

export default function AddUserModal({ isOpen, onClose, onUserAdded }: AddUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [assignableRoles, setAssignableRoles] = useState<AssignableRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Charger les rôles assignables depuis l'API (référentiel en base)
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setRolesLoading(true);
    fetch('/api/admin/roles/assignable', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Erreur chargement des rôles'))))
      .then((data) => {
        if (!cancelled && data.roles?.length) {
          setAssignableRoles(data.roles);
          setFormData((prev) => ({
            ...prev,
            role: prev.role && data.roles.some((r: AssignableRole) => r.code === prev.role) ? prev.role : data.roles[0].code
          }));
        } else if (!cancelled) {
          setAssignableRoles([]);
          setFormData((prev) => ({ ...prev, role: '' }));
        }
      })
      .catch(() => {
        if (!cancelled) setAssignableRoles([]);
      })
      .finally(() => {
        if (!cancelled) setRolesLoading(false);
      });
    return () => { cancelled = true; };
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validation du nom
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }


    // Validation du rôle
    if (!formData.role || !assignableRoles.some((r) => r.code === formData.role)) {
      newErrors.role = 'Veuillez sélectionner un rôle assignable';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          role: formData.role.trim().toUpperCase()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de l\'utilisateur');
      }

      // Succès
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        role: assignableRoles[0]?.code ?? ''
      });
      
      // Notifier le parent pour actualiser la liste
      onUserAdded();
      
      // Fermer le modal après un court délai
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur du champ quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        email: '',
        role: assignableRoles[0]?.code ?? ''
      });
      setErrors({});
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ajouter un nouvel utilisateur
          </DialogTitle>
          <DialogDescription>
            Un email sera automatiquement envoyé à l'utilisateur avec ses identifiants de connexion
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-lg font-medium text-green-700">Utilisateur créé avec succès !</p>
              <p className="text-sm text-gray-600 mt-2 flex items-center justify-center gap-1">
                <Mail className="h-4 w-4" />
                Email d'invitation envoyé
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Nom complet */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nom complet *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Jean Dupont"
                disabled={loading}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Adresse email *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="jean.dupont@exemple.com"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Rôle (liste depuis l'API = référentiel en base) */}
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-gray-700">
                Rôle *
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.role ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={loading || rolesLoading}
              >
                {rolesLoading ? (
                  <option value="">Chargement des rôles...</option>
                ) : assignableRoles.length === 0 ? (
                  <option value="">Aucun rôle assignable</option>
                ) : (
                  assignableRoles.map((r) => (
                    <option key={r.id} value={r.code}>
                      {r.label}
                    </option>
                  ))
                )}
              </select>
              {errors.role && (
                <p className="text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            {/* Info sécurité */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">Connexion sécurisée</p>
                  <p>Un mot de passe temporaire sera généré automatiquement et envoyé par email. L'utilisateur devra le changer lors de sa première connexion.</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Création...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Créer l'utilisateur
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}