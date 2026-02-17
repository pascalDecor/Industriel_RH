"use client";

import Button from "@/components/ui/button";
import { formatDateFr } from "@/lib/formatDate";
import { TeamMember } from "@/models/teamMember";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LuTrash2 } from "react-icons/lu";
import { MdOutlineModeEditOutline } from "react-icons/md";
import AddTeamMember from "./add";
import { HttpService } from "@/utils/http.services";
import { useState } from "react";
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaGlobe } from "react-icons/fa";
import { useImage } from "@/hooks/useImage";

function MemberAvatar({ imageKey }: { imageKey: string }) {
  const imageData = useImage(imageKey, "fr");
  if (!imageData.src) return null;
  return (
    <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageData.src} alt="" className="w-full h-full object-cover" />
    </div>
  );
}

type ItemTeamMemberProps = {
  member: TeamMember;
  onChange?: (state: unknown) => void;
};

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  LinkedIn: FaLinkedin,
  Twitter: FaTwitter,
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  "Site web": FaGlobe,
};

export default function ItemTeamMember({ member, onChange }: ItemTeamMemberProps) {
  const [open, setOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const fullName = `${member.prenom} ${member.nom}`;

  const executeDelete = () => {
    setLoadingDelete(true);
    HttpService.delete<TeamMember>({ url: `/team-members/${member.id}` })
      .then((res) => {
        setLoadingDelete(false);
        if (res?.state) {
          setConfirmDelete(false);
          setDeleteConfirmName("");
          if (onChange) onChange(res);
        }
      })
      .catch(() => {
        setLoadingDelete(false);
        setConfirmDelete(false);
      });
  };

  const links = member.socialLinks;

  return (
    <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-row justify-between items-start gap-4">
      {member.imageKey && <MemberAvatar imageKey={member.imageKey} />}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-slate-800 font-bold text-lg mb-0">
            {member.prenom} {member.nom}
          </p>
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-600" title="Ordre d'affichage">
            #{member.order}
          </span>
        </div>
        <p className="text-slate-600 text-sm mb-2">{member.post}</p>
        {links.length > 0 && (
          <div className="flex flex-wrap gap-3 items-center">
            {links.map(({ label, url }) => {
              const Icon = socialIcons[label];
              return (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-500 hover:text-teal-600 text-sm"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{label}</span>
                </a>
              );
            })}
          </div>
        )}
        <p className="text-slate-400 text-xs mt-2">
          Créé le {formatDateFr(member.createdAt ?? new Date())}
        </p>
      </div>
      <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              title="Modifier"
              variant="success"
              size="sm"
              className="rounded-full text-[11px] h-8 w-8 bg-green-200 text-green-700 p-2"
            >
              <MdOutlineModeEditOutline className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AddTeamMember
              member={member}
              onChange={(state) => {
                if (state) {
                  setOpen(false);
                  if (onChange) onChange(state);
                }
              }}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={confirmDelete}
          onOpenChange={(open) => {
            setConfirmDelete(open);
            if (!open) setDeleteConfirmName("");
          }}
        >
          <DialogTrigger asChild>
            <Button
              title="Supprimer"
              variant="danger"
              size="sm"
              className="rounded-full text-[11px] h-8 w-8 bg-red-200 text-red-700 p-2"
            >
              <LuTrash2 className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Supprimer le membre</h3>
            <p className="text-sm text-slate-600 mb-3">
              Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible.
            </p>
            <p className="text-sm text-slate-600 mb-2">
              Pour confirmer, saisissez le nom complet : <strong className="text-slate-800">{fullName}</strong>
            </p>
            <input
              type="text"
              value={deleteConfirmName}
              onChange={(e) => setDeleteConfirmName(e.target.value)}
              placeholder={fullName}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-teal-500 mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => { setConfirmDelete(false); setDeleteConfirmName(""); }} disabled={loadingDelete}>
                Annuler
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={executeDelete}
                disabled={loadingDelete || deleteConfirmName.trim() !== fullName}
              >
                {loadingDelete ? (
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                ) : (
                  "Supprimer"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
