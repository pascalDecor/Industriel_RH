"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/contexts/LanguageContext";
import Button from "@/components/ui/button";
import FloatingLabelInput from "@/components/ui/input";

interface Tag {
  id: string;
  libelle: string;
  libelle_en: string | null;
}

interface Specialite {
  id: string;
  libelle: string;
  libelle_en: string | null;
}

export default function TranslationsPage() {
  const { t } = useTranslation();
  const [tags, setTags] = useState<Tag[]>([]);
  const [specialites, setSpecialites] = useState<Specialite[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Récupérer les tags
      const tagsResponse = await fetch('/api/tags');
      const tagsData = await tagsResponse.json();
      setTags(tagsData.data || []);

      // Récupérer les spécialités
      const specialitesResponse = await fetch('/api/specialites');
      const specialitesData = await specialitesResponse.json();
      setSpecialites(specialitesData.data || []);

    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTagTranslation = async (tagId: string, libelle_en: string) => {
    try {
      setSaving(`tag-${tagId}`);

      const response = await fetch(`/api/tags/${tagId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          libelle_en: libelle_en.trim() || null
        }),
      });

      if (response.ok) {
        setTags(prev => prev.map(tag =>
          tag.id === tagId ? { ...tag, libelle_en: libelle_en.trim() || null } : tag
        ));
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSaving(null);
    }
  };

  const updateSpecialiteTranslation = async (specialiteId: string, libelle_en: string) => {
    try {
      setSaving(`specialite-${specialiteId}`);

      const response = await fetch(`/api/specialites/${specialiteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          libelle_en: libelle_en.trim() || null
        }),
      });

      if (response.ok) {
        setSpecialites(prev => prev.map(spec =>
          spec.id === specialiteId ? { ...spec, libelle_en: libelle_en.trim() || null } : spec
        ));
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Gestion des traductions
        </h1>

        {/* Tags */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Tags</h2>
          <div className="space-y-4">
            {tags.map((tag) => (
              <div key={tag.id} className="grid grid-cols-3 gap-4 items-center p-4 border rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Français
                  </label>
                  <div className="text-gray-900">{tag.libelle}</div>
                </div>
                <div>
                  <FloatingLabelInput
                    label="Traduction anglaise"
                    value={tag.libelle_en || ''}
                    onChange={(e) => {
                      setTags(prev => prev.map(t =>
                        t.id === tag.id ? { ...t, libelle_en: e.target.value } : t
                      ));
                    }}
                    placeholder="English translation"
                  />
                </div>
                <div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => updateTagTranslation(tag.id, tag.libelle_en || '')}
                    disabled={saving === `tag-${tag.id}`}
                    className="w-full"
                  >
                    {saving === `tag-${tag.id}` ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spécialités */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Spécialités</h2>
          <div className="space-y-4">
            {specialites.map((specialite) => (
              <div key={specialite.id} className="grid grid-cols-3 gap-4 items-center p-4 border rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Français
                  </label>
                  <div className="text-gray-900">{specialite.libelle}</div>
                </div>
                <div>
                  <FloatingLabelInput
                    label="Traduction anglaise"
                    value={specialite.libelle_en || ''}
                    onChange={(e) => {
                      setSpecialites(prev => prev.map(s =>
                        s.id === specialite.id ? { ...s, libelle_en: e.target.value } : s
                      ));
                    }}
                    placeholder="English translation"
                  />
                </div>
                <div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => updateSpecialiteTranslation(specialite.id, specialite.libelle_en || '')}
                    disabled={saving === `specialite-${specialite.id}`}
                    className="w-full"
                  >
                    {saving === `specialite-${specialite.id}` ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}