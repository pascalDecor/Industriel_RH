"use client";

import Button from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import FloatingLabelInput from "@/components/ui/input";
import { TeamMember } from "@/models/teamMember";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { baseApiURL } from "@/constant/api";
import { ImagePicker } from "./ImagePicker";
import { useImage } from "@/hooks/useImage";

function TeamMemberImagePreview({ imageKey }: { imageKey: string }) {
  const { src, isLoading } = useImage(imageKey, "fr");
  if (isLoading || !src) return <div className="w-full h-full bg-slate-200 animate-pulse" />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="w-full h-full object-cover" />
  );
}

export default function AddTeamMember({
  member,
  onChange,
}: {
  member: TeamMember;
  onChange: (state: unknown) => void;
}) {
  const [pending, setPending] = useState(false);
  const [nom, setNom] = useState(member.nom);
  const [prenom, setPrenom] = useState(member.prenom);
  const [post, setPost] = useState(member.post);
  const [order, setOrder] = useState<number>(member.order ?? 0);
  const [imageKey, setImageKey] = useState<string | null>(member.imageKey ?? null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [linkedin, setLinkedin] = useState(member.linkedin ?? "");
  const [twitter, setTwitter] = useState(member.twitter ?? "");
  const [facebook, setFacebook] = useState(member.facebook ?? "");
  const [instagram, setInstagram] = useState(member.instagram ?? "");
  const [website, setWebsite] = useState(member.website ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !prenom.trim() || !post.trim()) {
      toast.error("Nom, prénom et poste sont obligatoires.");
      return;
    }
    setPending(true);
    const payload = {
      nom: nom.trim(),
      prenom: prenom.trim(),
      post: post.trim(),
      order: typeof order === "number" && !Number.isNaN(order) ? Math.max(0, Math.floor(order)) : 0,
      imageKey: imageKey?.trim() || null,
      linkedin: linkedin.trim() || null,
      twitter: twitter.trim() || null,
      facebook: facebook.trim() || null,
      instagram: instagram.trim() || null,
      website: website.trim() || null,
    };
    const url = member.id ? `${baseApiURL}/team-members/${member.id}` : `${baseApiURL}/team-members`;
    const method = member.id ? "PATCH" : "POST";
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(() => {
        setPending(false);
        toast.success(member.id ? "Membre mis à jour." : "Membre ajouté.");
        onChange(true);
      })
      .catch(() => {
        setPending(false);
        toast.error("Erreur lors de l'enregistrement.");
      });
  };

  return (
    <>
      <DialogHeader className="text-slate-800">
        <DialogTitle className="text-slate-800 font-semibold">
          {member.id ? "Modifier le membre" : "Ajouter un membre"}
        </DialogTitle>
        <DialogDescription>
          {member.id ? `${member.prenom} ${member.nom}` : "Nouveau membre de l'équipe"}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FloatingLabelInput
            className="w-full"
            label="Nom"
            name="nom"
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
          <FloatingLabelInput
            className="w-full"
            label="Prénom"
            name="prenom"
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
        </div>
        <FloatingLabelInput
          className="w-full mb-4"
          label="Poste"
          name="post"
          placeholder="Ex: Directeur RH, Consultant..."
          value={post}
          onChange={(e) => setPost(e.target.value)}
          required
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 mb-2">Ordre d&apos;affichage</label>
          <input
            type="number"
            min={0}
            value={order}
            onChange={(e) => setOrder(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-teal-500"
          />
          <p className="text-xs text-slate-500 mt-1">Plus le nombre est bas, plus le membre apparaît en premier (page À propos).</p>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-slate-600 mb-2">Photo</p>
          <div className="flex items-center gap-3">
            {imageKey ? (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <TeamMemberImagePreview key={imageKey} imageKey={imageKey} />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 text-xs">
                Aucune
              </div>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setPickerOpen(true)}>
                {imageKey ? "Changer" : "Sélectionner une image"}
              </Button>
              {imageKey && (
                <Button type="button" variant="secondary" size="sm" onClick={() => setImageKey(null)}>
                  Retirer
                </Button>
              )}
            </div>
          </div>
        </div>
        <ImagePicker
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          currentKey={imageKey}
          onSelect={setImageKey}
          uploadKeyPrefix={member.id || `new_${Date.now()}`}
        />

        <p className="text-sm font-medium text-slate-600 mb-2">Réseaux sociaux (optionnel)</p>
        <div className="space-y-3 mb-4">
          <FloatingLabelInput
            className="w-full"
            label="LinkedIn"
            name="linkedin"
            placeholder="https://linkedin.com/in/..."
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
          />
          <FloatingLabelInput
            className="w-full"
            label="Twitter / X"
            name="twitter"
            placeholder="https://twitter.com/..."
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
          />
          <FloatingLabelInput
            className="w-full"
            label="Facebook"
            name="facebook"
            placeholder="https://facebook.com/..."
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
          />
          <FloatingLabelInput
            className="w-full"
            label="Instagram"
            name="instagram"
            placeholder="https://instagram.com/..."
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
          <FloatingLabelInput
            className="w-full"
            label="Site web"
            name="website"
            placeholder="https://..."
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            variant={member.id ? "success" : "primary"}
            className="mt-2"
            isLoading={pending}
            disabled={pending || !nom.trim() || !prenom.trim() || !post.trim()}
          >
            {member.id ? "Modifier" : "Ajouter"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
