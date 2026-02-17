import Button from "@/components/ui/button";
import { formatDateFr } from "@/lib/formatDate";
import { Sector } from "@/models/sector";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { LuTrash2 } from "react-icons/lu";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { HiOutlineLanguage } from "react-icons/hi2";
import AddSectors from "./add";
import { HttpService } from "@/utils/http.services";
import { useState } from "react";

type ItemSectorsProps = {
    sector: Sector,
    onChange?: (state: any) => void,
    onActive?: (sector: Sector) => void
}

export default function ItemSectors({ sector, onChange, onActive }: ItemSectorsProps) {

    const [changeCount, setchangeCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [showEnglish, setShowEnglish] = useState(false);

    const [loadingDelete, setLoadingDelete] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteConfirmName, setDeleteConfirmName] = useState("");
    const [loadingSetDefault, setLoadingSetDefault] = useState(false);

    const executeDelete = () => {
        setLoadingDelete(true);
        HttpService.delete<Sector>({
            url: `/sectors/${sector.id}`,
        }).then((res) => {
            setLoadingDelete(false);
            if (res?.state) {
                setConfirmDelete(false);
                if (onChange) onChange(res);
            }
        }).catch(() => {
            setLoadingDelete(false);
            setConfirmDelete(false);
        });
    };

    const setAsDefaultConsultingSolutions = () => {
        setLoadingSetDefault(true);
        fetch(`/api/sectors/${sector.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                libelle: sector.libelle,
                libelle_en: sector.libelle_en ?? null,
                description: sector.description ?? null,
                description_en: sector.description_en ?? null,
                alternativeDescriptions: sector.alternativeDescriptions ?? [],
                isActive: sector.isActive,
                isDefaultConsultingSolutions: true,
            }),
        })
            .then((res) => {
                setLoadingSetDefault(false);
                if (res.ok && onChange) onChange({});
            })
            .catch(() => setLoadingSetDefault(false));
    };


    return (
        <div className={`p-5 !border-none !shadow-none flex flex-row justify-between items-start cursor-pointer hover:shadow-md ${!sector.isActive ? 'opacity-75 bg-slate-50' : ''}`}
            key={sector.id} onClick={() => onActive && onActive(sector)}>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {!sector.isActive && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            Désactivé
                        </span>
                    )}
                    {sector.isDefaultConsultingSolutions && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                            Page consulting-solutions par défaut
                        </span>
                    )}
                    <p className="my-0 text-slate-700 font-semibold py-0 mb-0">
                        {showEnglish ? (sector.libelle_en || sector.libelle) : sector.libelle}
                    </p>
                    {(sector.libelle_en || sector.description_en) && (
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowEnglish(!showEnglish);
                            }}
                            variant={showEnglish ? "primary" : "secondary"}
                            size="sm"
                            className="!h-6 !px-2 !text-[10px] flex items-center gap-1"
                            title={showEnglish ? "Voir en français" : "Voir en anglais"}
                        >
                            <HiOutlineLanguage className="h-3 w-3" />
                            {showEnglish ? 'FR' : 'EN'}
                        </Button>
                    )}
                </div>

                {sector.description && (
                    <p className="my-0 text-slate-600 text-sm py-0 mb-1 italic">
                        {showEnglish ? (sector.description_en || sector.description) : sector.description}
                    </p>
                )}

                {showEnglish && !sector.libelle_en && (
                    <p className="text-orange-600 text-xs italic mb-1">Version anglaise non disponible</p>
                )}

                <p className="my-0 text-slate-700 text-sm py-0">
                    {sector.functionsCount} fonction(s) . crée le {formatDateFr(sector.createdAt ?? new Date())}
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {!sector.isDefaultConsultingSolutions && (
                    <Button
                        title="Définir comme page consulting-solutions par défaut"
                        variant="secondary"
                        size="sm"
                        className="!rounded-full text-[11px] h-8 !bg-teal-50 !text-teal-700 hover:!bg-teal-100"
                        onClick={setAsDefaultConsultingSolutions}
                        disabled={loadingSetDefault}
                    >
                        {loadingSetDefault ? (
                            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                        ) : (
                            "Par défaut consulting"
                        )}
                    </Button>
                )}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                        <Button title="Modifier" variant="success" size="sm" className="!rounded-full text-[11px] h-8 w-8 !bg-green-200 !text-green-700 !p-2">
                            <MdOutlineModeEditOutline className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <AddSectors sector={sector} onChange={state => {
                            if (state) {
                                setchangeCount(c => c + 1);
                                setOpen(false);
                                if (onChange) {
                                    onChange(state);
                                }
                            }
                        }} />
                    </DialogContent>
                </Dialog>

                <Dialog open={confirmDelete} onOpenChange={(open) => {
                    setConfirmDelete(open);
                    if (!open) setDeleteConfirmName("");
                }}>
                    <DialogTrigger asChild>
                        <Button
                            title={sector.isDefaultConsultingSolutions ? "Impossible de supprimer le secteur par défaut (page consulting-solutions)" : "Supprimer"}
                            variant="danger"
                            size="sm"
                            className="!rounded-full text-[11px] h-8 w-8 !bg-red-200 !text-red-700 !p-2"
                            disabled={sector.isDefaultConsultingSolutions}
                        >
                            <LuTrash2 className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Supprimer le secteur</h3>
                        <p className="text-sm text-slate-600 mb-3">
                            Êtes-vous sûr de vouloir supprimer ce secteur ? Cette action est irréversible.
                        </p>
                        <p className="text-sm text-slate-600 mb-2">
                            Pour confirmer, saisissez le nom du secteur : <strong className="text-slate-800">{sector.libelle}</strong>
                        </p>
                        <input
                            type="text"
                            value={deleteConfirmName}
                            onChange={(e) => setDeleteConfirmName(e.target.value)}
                            placeholder={sector.libelle}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-teal-500 mb-4"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => { setConfirmDelete(false); setDeleteConfirmName(""); }}
                                disabled={loadingDelete}
                            >
                                Annuler
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={executeDelete}
                                disabled={loadingDelete || deleteConfirmName.trim() !== sector.libelle}
                            >
                                {loadingDelete ? (
                                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                                ) : (
                                    'Supprimer'
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}