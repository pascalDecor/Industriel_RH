"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Button from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { baseApiURL } from "@/constant/api";
import { Upload } from "lucide-react";

interface MediaAsset {
  key: string;
  publicUrl: string;
  fileName: string;
  category: string | null;
}

interface ImagePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentKey: string | null;
  onSelect: (key: string) => void;
  /** Pour l'upload, préfixe de la clé (ex: member.id ou un id temporaire) */
  uploadKeyPrefix: string;
}

export function ImagePicker({
  open,
  onOpenChange,
  currentKey,
  onSelect,
  uploadKeyPrefix,
}: ImagePickerProps) {
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"library" | "upload">("library");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`${baseApiURL}/media`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur chargement médias");
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.media)) {
          setMediaList(data.media);
        }
      })
      .catch(() => toast.error("Impossible de charger la médiathèque"))
      .finally(() => setLoading(false));
  }, [open]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }
    const key = `team_member_${uploadKeyPrefix}_${Date.now()}`;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "team");
    fetch(`${baseApiURL}/media/${encodeURIComponent(key)}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          onSelect(key);
          onOpenChange(false);
          toast.success("Image téléversée");
        } else {
          toast.error(data.error || "Erreur upload");
        }
      })
      .catch(() => toast.error("Erreur lors du téléversement"))
      .finally(() => {
        setUploading(false);
        e.target.value = "";
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Sélectionner une image</h3>
        <div className="flex gap-2 mb-4 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setTab("library")}
            className={`px-3 py-2 text-sm font-medium rounded-t ${tab === "library" ? "bg-slate-100 text-slate-800 border border-b-0 border-slate-200" : "text-slate-500"}`}
          >
            Médiathèque
          </button>
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`px-3 py-2 text-sm font-medium rounded-t ${tab === "upload" ? "bg-slate-100 text-slate-800 border border-b-0 border-slate-200" : "text-slate-500"}`}
          >
            Téléverser
          </button>
        </div>

        {tab === "library" && (
          <div className="flex-1 overflow-y-auto min-h-[200px]">
            {loading ? (
              <p className="text-slate-500 text-sm">Chargement...</p>
            ) : mediaList.length === 0 ? (
              <p className="text-slate-500 text-sm">Aucune image dans la médiathèque.</p>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {mediaList.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => {
                      onSelect(m.key);
                      onOpenChange(false);
                    }}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                      currentKey === m.key ? "border-teal-500 ring-2 ring-teal-200" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.publicUrl}
                      alt={m.fileName}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "upload" && (
          <div className="flex flex-col items-center justify-center py-8 border border-dashed border-slate-300 rounded-xl bg-slate-50">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
              id="team-member-image-upload"
            />
            <label
              htmlFor="team-member-image-upload"
              className="flex flex-col items-center gap-2 cursor-pointer text-slate-600 hover:text-teal-600"
            >
              {uploading ? (
                <span className="text-sm">Téléversement...</span>
              ) : (
                <>
                  <Upload className="h-10 w-10" />
                  <span className="text-sm font-medium">Cliquez pour choisir une image</span>
                </>
              )}
            </label>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
