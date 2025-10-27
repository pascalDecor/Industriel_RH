"use client";

import React, { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";

interface EditableTextProps {
  translationKey: string;
  currentText: string;
  language: 'fr' | 'en';
  translationId: string;
  onUpdate: (id: string, fr: string, en: string) => void;
  className?: string;
  as?: React.ElementType;
  allTranslations: { id: string; key: string; fr: string; en: string }[];
}

export function EditableText({
  translationKey,
  currentText,
  language,
  translationId,
  onUpdate,
  className = "",
  as: Component = "span",
  allTranslations
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [frText, setFrText] = useState("");
  const [enText, setEnText] = useState("");
  const [saving, setSaving] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const translation = allTranslations.find(t => t.key === translationKey);

  const handleClick = (e: React.MouseEvent) => {
    // Prevent link navigation and stop event propagation
    e.preventDefault();
    e.stopPropagation();

    // Prevent parent links from being clicked
    const parentLink = (e.target as HTMLElement).closest('a');
    if (parentLink) {
      e.nativeEvent.stopImmediatePropagation();
    }

    if (translation) {
      setFrText(translation.fr);
      setEnText(translation.en);
      setIsEditing(true);

      // Calculate position for popover
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;

        // Position below the element by default
        setPopoverPosition({
          top: rect.bottom + scrollY + 8,
          left: rect.left + scrollX
        });
      }
    }
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!translation) return;

    try {
      setSaving(true);

      const response = await fetch('/api/translations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: translation.id,
          key: translationKey,
          fr: frText,
          en: enText,
          category: translation.key.split('.')[0]
        }),
      });

      const data = await response.json();

      if (data.success) {
        onUpdate(translation.id, frText, enText);
        setIsEditing(false);
        toast.success('✅ Texte mis à jour');
      } else {
        toast.error('❌ Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // Close popover when clicking outside
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  // Adjust popover position if it goes off-screen
  useEffect(() => {
    if (isEditing && popoverRef.current) {
      const rect = popoverRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedPosition = { ...popoverPosition };

      // Adjust horizontal position if popover goes off right edge
      if (rect.right > viewportWidth) {
        adjustedPosition.left = viewportWidth - rect.width - 16;
      }

      // Adjust horizontal position if popover goes off left edge
      if (rect.left < 0) {
        adjustedPosition.left = 16;
      }

      // Adjust vertical position if popover goes off bottom edge
      if (rect.bottom > viewportHeight && triggerRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        adjustedPosition.top = triggerRect.top + window.scrollY - rect.height - 8;
      }

      setPopoverPosition(adjustedPosition);
    }
  }, [isEditing]);

  return (
    <>
      <Component
        ref={triggerRef as any}
        className={`${className} cursor-pointer hover:bg-yellow-100 hover:outline hover:outline-2 hover:outline-blue-400 transition-all rounded px-1 relative group`}
        onClick={handleClick}
        title="Cliquez pour modifier"
      >
        {currentText}
        <span className="absolute -top-6 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
          ✏️ Cliquer pour modifier
        </span>
      </Component>

      {isEditing && (
        <>
          {/* Popover */}
          <div
            ref={popoverRef}
            className="fixed bg-white rounded-lg shadow-2xl border-2 border-blue-400 z-[9999] w-[500px] max-w-[90vw]"
            style={{
              top: `${popoverPosition.top}px`,
              left: `${popoverPosition.left}px`,
            }}
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-4 border-b pb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Modifier le texte
                  </h3>
                  <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                    {translationKey}
                  </code>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                  disabled={saving}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Français */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🇫🇷 Français
                  </label>
                  <textarea
                    value={frText}
                    onChange={(e) => setFrText(e.target.value)}
                    className="w-full !text-gray px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    rows={3}
                    placeholder="Entrez le texte en français..."
                    disabled={saving}
                  />
                </div>

                {/* Anglais */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🇬🇧 English
                  </label>
                  <textarea
                    value={enText}
                    onChange={(e) => setEnText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    rows={3}
                    placeholder="Enter text in English..."
                    disabled={saving}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-3 border-t">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={saving || !frText || !enText}
                  className="flex-1"
                  size="sm"
                >
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
                <Button
                  variant="dark"
                  onClick={handleClose}
                  disabled={saving}
                  size="sm"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
