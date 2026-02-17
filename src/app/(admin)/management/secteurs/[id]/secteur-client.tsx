"use client";

import { AsyncBuilder } from "@/components/ui/asyncBuilder";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Button from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { formatDateFr } from "@/lib/formatDate";
import { LoadingSpinner } from "@/lib/load.helper";
import { Sector } from "@/models/sector";
import { HttpService } from "@/utils/http.services";
import { baseApiURL } from "@/constant/api";
import { Slash } from "lucide-react";
import { LuTrash2 } from "react-icons/lu";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { HiOutlineLanguage } from "react-icons/hi2";
import AddSectors from "../add";
import { useState } from "react";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FonctionsListe from "./functions/liste";
import { SectorSections } from "./sections";
import { toast } from "react-hot-toast";

interface SecteurClientProps {
    sectorId: string;
}

export function SecteurClient({ sectorId }: SecteurClientProps) {
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingToggle, setLoadingToggle] = useState(false);
    const [changeCount, setchangeCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [showEnglish, setShowEnglish] = useState(false);
    const [confirmToggle, setConfirmToggle] = useState<'deactivate' | 'activate' | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteConfirmName, setDeleteConfirmName] = useState("");
    const [loadingSetDefault, setLoadingSetDefault] = useState(false);

    const setAsDefaultConsultingSolutions = (sector: Sector) => {
        setLoadingSetDefault(true);
        fetch(`${baseApiURL}/sectors/${sector.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
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
                if (!res.ok) throw new Error(res.statusText);
                return res.json();
            })
            .then(() => {
                setLoadingSetDefault(false);
                toast.success("Secteur défini comme page consulting-solutions par défaut");
                setchangeCount(c => c + 1);
            })
            .catch(() => {
                setLoadingSetDefault(false);
                toast.error("Erreur lors de la mise à jour");
            });
    };

    const executeToggleActive = (sector: Sector) => {
        setLoadingToggle(true);
        fetch(`${baseApiURL}/sectors/${sector.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ isActive: !sector.isActive }),
        })
            .then((res) => {
                if (!res.ok) throw new Error(res.statusText);
                return res.json();
            })
            .then(() => {
                setLoadingToggle(false);
                setConfirmToggle(null);
                toast.success(sector.isActive ? 'Secteur désactivé' : 'Secteur réactivé');
                setchangeCount(c => c + 1);
            })
            .catch(() => {
                setLoadingToggle(false);
                setConfirmToggle(null);
                toast.error('Erreur lors de la mise à jour');
            });
    };

    const executeDelete = (id: string) => {
        setLoadingDelete(true);
        HttpService.delete<Sector>({ url: `/sectors/${id}` })
            .then((res) => {
                setLoadingDelete(false);
                setConfirmDelete(false);
                if (res) redirect('/management/secteurs');
            })
            .catch(() => {
                setLoadingDelete(false);
                setConfirmDelete(false);
            });
    };

    return (
        <AsyncBuilder
            promise={async () => {
                return HttpService.show<Sector>({
                    url: `/sectors/${sectorId}`,
                    fromJson: (json: any) => Sector.fromJSON(json)
                });
            }}
            callDataListen={changeCount}
            loadingComponent={<LoadingSpinner color="#0F766E" />}
            hasData={(data) => {
                const { data: sector } = data;
                return (
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
                        <div className="col-span-6">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/management/secteurs">Secteurs</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator>
                                        <Slash />
                                    </BreadcrumbSeparator>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="#">{sector?.libelle}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="col-span-6">
                            <div className="flex flex-row justify-between items-center w-full">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        {!sector?.isActive && (
                                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                                                Désactivé
                                            </span>
                                        )}
                                        {sector?.isDefaultConsultingSolutions && (
                                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-teal-100 text-teal-800">
                                                Page consulting-solutions par défaut
                                            </span>
                                        )}
                                        <h2 className="text-3xl font-bold tracking-tight mb-0">
                                            {showEnglish ? (sector?.libelle_en || sector?.libelle) : sector?.libelle}
                                        </h2>
                                        {(sector?.libelle_en || sector?.description_en) && (
                                            <Button
                                                onClick={() => setShowEnglish(!showEnglish)}
                                                variant={showEnglish ? "primary" : "secondary"}
                                                size="sm"
                                                className="!h-7 !px-3 !text-[11px] flex items-center gap-2"
                                                title={showEnglish ? "Voir en français" : "Voir en anglais"}
                                            >
                                                {showEnglish ? (
                                                    <>
                                                        <span className="text-sm">🇫🇷</span>
                                                        <span>FR</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-sm">🇬🇧</span>
                                                        <span>EN</span>
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>

                                    {sector?.description && (
                                        <p className="my-0 text-slate-600 text-base py-0 mb-2 italic">
                                            {showEnglish ? (sector?.description_en || sector?.description) : sector?.description}
                                        </p>
                                    )}

                                    {showEnglish && !sector?.libelle_en && (
                                        <p className="text-orange-600 text-sm italic mb-2">Version anglaise non disponible</p>
                                    )}

                                    <p className="my-0 text-slate-700 text-sm py-0">
                                        {sector?.functionsCount} fonction(s) . crée le {formatDateFr(sector?.createdAt ?? new Date())}
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    {!sector?.isDefaultConsultingSolutions && (
                                        <Button
                                            title="Définir comme page consulting-solutions par défaut"
                                            variant="secondary"
                                            size="sm"
                                            className="!rounded-full text-xs font-medium px-3 py-1.5 !bg-teal-50 !text-teal-700 hover:!bg-teal-100 whitespace-nowrap"
                                            onClick={() => sector && setAsDefaultConsultingSolutions(sector)}
                                            disabled={loadingSetDefault}
                                        >
                                            {loadingSetDefault ? (
                                                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                                            ) : (
                                                "Par défaut consulting"
                                            )}
                                        </Button>
                                    )}
                                    <Button
                                        title={
                                            sector?.isDefaultConsultingSolutions && sector?.isActive
                                                ? "Impossible de désactiver le secteur par défaut. Définissez d'abord un autre secteur par défaut."
                                                : sector?.isActive
                                                    ? 'Désactiver le secteur (masquer du site)'
                                                    : 'Activer le secteur'
                                        }
                                        variant={sector?.isActive ? 'secondary' : 'primary'}
                                        size="sm"
                                        className={`!rounded-full text-xs font-medium px-3 py-1.5 whitespace-nowrap ${sector?.isActive ? '!bg-slate-200 !text-slate-700' : '!bg-emerald-200 !text-emerald-800'}`}
                                        onClick={() => setConfirmToggle(sector?.isActive ? 'deactivate' : 'activate')}
                                        disabled={loadingToggle || (!!sector?.isDefaultConsultingSolutions && !!sector?.isActive)}
                                    >
                                        {loadingToggle ? (
                                            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                                        ) : sector?.isActive ? (
                                            'Désactiver'
                                        ) : (
                                            'Activer'
                                        )}
                                    </Button>
                                    <Dialog open={open} onOpenChange={setOpen}>
                                        <DialogTrigger asChild>
                                            <Button title="Modifier" variant="success" size="sm" className="!rounded-full text-[11px] h-8 w-8 !bg-green-200 !text-green-700 !p-2">
                                                <MdOutlineModeEditOutline className="h-5 w-5" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <AddSectors sector={sector ?? Sector.fromJSON(({} as any))} onChange={state => {
                                                if (state) {
                                                    setchangeCount(c => c + 1);
                                                    setOpen(false);
                                                }
                                            }} />
                                        </DialogContent>
                                    </Dialog>

                                    <Button
                                        title={sector?.isDefaultConsultingSolutions ? "Impossible de supprimer le secteur par défaut (page consulting-solutions)" : "Supprimer"}
                                        variant="danger"
                                        size="sm"
                                        className="!rounded-full text-[11px] h-8 w-8 !bg-red-200 !text-red-700 !p-2"
                                        onClick={() => setConfirmDelete(true)}
                                        disabled={loadingDelete || sector?.isDefaultConsultingSolutions}
                                    >
                                        {loadingDelete ? (
                                            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                                        ) : (
                                            <LuTrash2 className="h-5 w-5" />
                                        )}
                                    </Button>

                                    {/* Modal confirmation Désactiver / Activer */}
                                    <Dialog open={confirmToggle !== null} onOpenChange={(open) => !open && setConfirmToggle(null)}>
                                        <DialogContent className="max-w-md">
                                            <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                                {confirmToggle === 'deactivate' && 'Désactiver le secteur'}
                                                {confirmToggle === 'activate' && 'Activer le secteur'}
                                            </h3>
                                            <p className="text-sm text-slate-600 mb-6">
                                                {confirmToggle === 'deactivate' && 'Êtes-vous sûr de vouloir désactiver ce secteur ? Il ne sera plus visible sur le site public.'}
                                                {confirmToggle === 'activate' && 'Êtes-vous sûr de vouloir activer ce secteur ? Il sera à nouveau visible sur le site.'}
                                            </p>
                                            <div className="flex justify-end gap-2">
                                                <Button variant="secondary" size="sm" onClick={() => setConfirmToggle(null)} disabled={loadingToggle}>
                                                    Annuler
                                                </Button>
                                                <Button variant="primary" size="sm" onClick={() => sector && executeToggleActive(sector)} disabled={loadingToggle}>
                                                    {loadingToggle ? (
                                                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                                                    ) : (
                                                        'Confirmer'
                                                    )}
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Modal confirmation Supprimer */}
                                    <Dialog open={confirmDelete} onOpenChange={(open) => {
                                        setConfirmDelete(open);
                                        if (!open) setDeleteConfirmName("");
                                    }}>
                                        <DialogContent className="max-w-md">
                                            <h3 className="text-lg font-semibold text-slate-800 mb-2">Supprimer le secteur</h3>
                                            <p className="text-sm text-slate-600 mb-3">
                                                Êtes-vous sûr de vouloir supprimer ce secteur ? Cette action est irréversible.
                                            </p>
                                            <p className="text-sm text-slate-600 mb-2">
                                                Pour confirmer, saisissez le nom du secteur : <strong className="text-slate-800">{sector?.libelle}</strong>
                                            </p>
                                            <input
                                                type="text"
                                                value={deleteConfirmName}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeleteConfirmName(e.target.value)}
                                                placeholder={sector?.libelle}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-teal-500 mb-4"
                                                autoFocus
                                            />
                                            <div className="flex justify-end gap-2">
                                                <Button variant="secondary" size="sm" onClick={() => { setConfirmDelete(false); setDeleteConfirmName(""); }} disabled={loadingDelete}>
                                                    Annuler
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => sector?.id && executeDelete(sector.id)}
                                                    disabled={loadingDelete || deleteConfirmName.trim() !== (sector?.libelle ?? "")}
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
                        </div>
                        <div className="col-span-6">
                            <Tabs defaultValue="fonctions" className="w-full">
                                <div className="bg-slate-200 py-0 px-0 w-full rounded-xl">
                                    <TabsList className="w-fit px-0 py-5 bg-slate-200">
                                        <TabsTrigger className="py-5 px-10 cursor-pointer w-fit" value="fonctions">Fonctions</TabsTrigger>
                                        <TabsTrigger className="py-5 px-10 cursor-pointer" value="Sections">Sections</TabsTrigger>
                                    </TabsList>
                                </div>
                                <TabsContent value="fonctions">
                                    <FonctionsListe sectorId={sector?.id ?? ''} />
                                </TabsContent>
                                <TabsContent value="Sections">
                                    <SectorSections sector={sector!} />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                );
            }}
        />
    );
}