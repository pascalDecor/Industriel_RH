"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Shield,
  Plus,
  Pencil,
  Users,
  Loader2,
  AlertCircle,
  Check
} from 'lucide-react';

export interface RolePermissionItem {
  id: string;
  code: string;
  label: string;
  category: string | null;
}

export interface RoleItem {
  id: string;
  code: string;
  label: string;
  description: string | null;
  level: number;
  createdAt: string;
  updatedAt: string;
  permissions: RolePermissionItem[];
  userCount: number;
}

interface PermissionsByCategory {
  [category: string]: RolePermissionItem[];
}

export default function RoleConfig() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissionsList, setPermissionsList] = useState<RolePermissionItem[]>([]);
  const [byCategory, setByCategory] = useState<PermissionsByCategory>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [rolesRes, permsRes] = await Promise.all([
        fetch('/api/admin/roles', { credentials: 'include' }),
        fetch('/api/admin/permissions', { credentials: 'include' })
      ]);
      if (!rolesRes.ok) {
        const data = await rolesRes.json().catch(() => ({}));
        throw new Error(data.error || 'Erreur chargement des rôles');
      }
      if (!permsRes.ok) {
        const data = await permsRes.json().catch(() => ({}));
        throw new Error(data.error || 'Erreur chargement des permissions');
      }
      const rolesData = await rolesRes.json();
      const permsData = await permsRes.json();
      setRoles(rolesData.roles ?? []);
      setPermissionsList(permsData.permissions ?? []);
      setByCategory(permsData.byCategory ?? {});
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
      setRoles([]);
      setPermissionsList([]);
      setByCategory({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const openCreate = () => {
    setFormError(null);
    setCreateOpen(true);
  };

  const openEdit = (role: RoleItem) => {
    setEditingRole(role);
    setFormError(null);
    setEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Configuration des rôles</h2>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Créer un rôle
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
          <Button variant="secondary" size="sm" onClick={() => loadRoles()}>
            Réessayer
          </Button>
        </div>
      )}

      {loading ? (
        <Card className="p-12 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-gray-600">Chargement des rôles...</p>
        </Card>
      ) : (
        <Card className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 font-medium text-gray-700">Rôle</th>
                  <th className="pb-3 font-medium text-gray-700">Code</th>
                  <th className="pb-3 font-medium text-gray-700">Niveau</th>
                  <th className="pb-3 font-medium text-gray-700">Permissions</th>
                  <th className="pb-3 font-medium text-gray-700">Utilisateurs</th>
                  <th className="pb-3 font-medium text-gray-700 w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{role.label}</span>
                      </div>
                      {role.description && (
                        <p className="text-sm text-gray-500 mt-0.5">{role.description}</p>
                      )}
                    </td>
                    <td className="py-3 text-gray-600 font-mono text-sm">{role.code}</td>
                    <td className="py-3 text-gray-600">{role.level}</td>
                    <td className="py-3 text-gray-600">{role.permissions.length}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 text-gray-600">
                        <Users className="h-4 w-4" />
                        {role.userCount}
                      </span>
                    </td>
                    <td className="py-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openEdit(role)}
                        className="flex items-center gap-1"
                      >
                        <Pencil className="h-4 w-4" />
                        Modifier
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {roles.length === 0 && !loading && (
            <div className="py-12 text-center text-gray-500">
              Aucun rôle. Cliquez sur « Créer un rôle » pour en ajouter un.
            </div>
          )}
        </Card>
      )}

      <CreateRoleModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {
          setCreateOpen(false);
          loadRoles();
        }}
        actionLoading={actionLoading}
        setActionLoading={setActionLoading}
        formError={formError}
        setFormError={setFormError}
      />

      {editingRole && (
        <EditRoleModal
          role={editingRole}
          byCategory={byCategory}
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setEditingRole(null);
          }}
          onSuccess={() => {
            setEditOpen(false);
            setEditingRole(null);
            loadRoles();
          }}
          actionLoading={actionLoading}
          setActionLoading={setActionLoading}
          formError={formError}
          setFormError={setFormError}
        />
      )}
    </div>
  );
}

interface CreateRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionLoading: string | null;
  setActionLoading: (v: string | null) => void;
  formError: string | null;
  setFormError: (v: string | null) => void;
}

function CreateRoleModal({
  open,
  onClose,
  onSuccess,
  actionLoading,
  setActionLoading,
  formError,
  setFormError
}: CreateRoleModalProps) {
  const [code, setCode] = useState('');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const codeNorm = code.trim().toUpperCase().replace(/\s+/g, '_');
    if (!codeNorm) {
      setFormError('Le code est requis');
      return;
    }
    if (!label.trim()) {
      setFormError('Le libellé est requis');
      return;
    }
    setActionLoading('create');
    try {
      const res = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          code: codeNorm,
          label: label.trim(),
          description: description.trim() || null,
          level: Number(level) || 0
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(data.error || 'Erreur lors de la création');
        return;
      }
      onSuccess();
      setCode('');
      setLabel('');
      setDescription('');
      setLevel(0);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un nouveau rôle</DialogTitle>
          <DialogDescription>
            Définissez le code, le libellé et le niveau hiérarchique. Les permissions pourront être ajoutées après création.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-800 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {formError}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ex: MANAGER_PROJET"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Majuscules, chiffres et underscores uniquement (sera normalisé)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Libellé</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="ex: Manager de projet"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Niveau (0 = bas, 7 = super admin)</label>
            <input
              type="number"
              min={0}
              max={10}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={actionLoading === 'create'}>
              {actionLoading === 'create' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Création...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Créer le rôle
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface EditRoleModalProps {
  role: RoleItem;
  byCategory: PermissionsByCategory;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionLoading: string | null;
  setActionLoading: (v: string | null) => void;
  formError: string | null;
  setFormError: (v: string | null) => void;
}

function EditRoleModal({
  role,
  byCategory,
  open,
  onClose,
  onSuccess,
  actionLoading,
  setActionLoading,
  formError,
  setFormError
}: EditRoleModalProps) {
  const [label, setLabel] = useState(role.label);
  const [description, setDescription] = useState(role.description ?? '');
  const [level, setLevel] = useState(role.level);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<string>>(() =>
    new Set(role.permissions.map((p) => p.id))
  );

  useEffect(() => {
    if (open && role) {
      setLabel(role.label);
      setDescription(role.description ?? '');
      setLevel(role.level);
      setSelectedPermissionIds(new Set(role.permissions.map((p) => p.id)));
    }
  }, [open, role?.id]);

  const togglePermission = (id: string) => {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllInCategory = (category: string) => {
    const perms = byCategory[category] ?? [];
    const allSelected = perms.every((p) => selectedPermissionIds.has(p.id));
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      if (allSelected) perms.forEach((p) => next.delete(p.id));
      else perms.forEach((p) => next.add(p.id));
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!label.trim()) {
      setFormError('Le libellé est requis');
      return;
    }
    setActionLoading('edit');
    try {
      const resRole = await fetch(`/api/admin/roles/${role.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          label: label.trim(),
          description: description.trim() || null,
          level: Number(level) ?? role.level
        })
      });
      if (!resRole.ok) {
        const data = await resRole.json().catch(() => ({}));
        setFormError(data.error || 'Erreur lors de la mise à jour du rôle');
        return;
      }
      const resPerms = await fetch(`/api/admin/roles/${role.id}/permissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ permissionIds: Array.from(selectedPermissionIds) })
      });
      if (!resPerms.ok) {
        const data = await resPerms.json().catch(() => ({}));
        setFormError(data.error || 'Erreur lors de la mise à jour des permissions');
        return;
      }
      onSuccess();
    } finally {
      setActionLoading(null);
    }
  };

  const categories = Object.keys(byCategory).sort();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le rôle : {role.code}</DialogTitle>
          <DialogDescription>
            Modifiez le libellé, la description, le niveau et les permissions associées.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-800 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {formError}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Libellé</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <input
                type="number"
                min={0}
                max={10}
                value={level}
                onChange={(e) => setLevel(Number(e.target.value) ?? 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Permissions</h4>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-64 overflow-y-auto">
              {categories.map((cat) => {
                const perms = byCategory[cat] ?? [];
                const allSelected = perms.length > 0 && perms.every((p) => selectedPermissionIds.has(p.id));
                return (
                  <div key={cat} className="p-3">
                    <button
                      type="button"
                      onClick={() => selectAllInCategory(cat)}
                      className="text-sm font-medium text-gray-800 hover:text-blue-600 mb-2 block w-full text-left"
                    >
                      {cat} {allSelected ? '✓ (tout désélectionner)' : '(tout sélectionner)'}
                    </button>
                    <div className="flex flex-wrap gap-3">
                      {perms.map((p) => (
                        <label
                          key={p.id}
                          className="inline-flex items-center gap-2 cursor-pointer text-sm text-gray-700"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissionIds.has(p.id)}
                            onChange={() => togglePermission(p.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>{p.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={actionLoading === 'edit'}>
              {actionLoading === 'edit' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
