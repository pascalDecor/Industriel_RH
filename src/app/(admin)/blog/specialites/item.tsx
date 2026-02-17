import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateFr } from "@/lib/formatDate";
import { Specialite } from "@/models/specialite";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { LuTrash2 } from "react-icons/lu";
import { MdOutlineModeEditOutline } from "react-icons/md";
import AddSpecialites from "./add";
import { HttpService } from "@/utils/http.services";
import { useState } from "react";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { toast } from "sonner";

export default function ItemSpecialites({ specialite, isEnglishView, onChange }: { specialite: Specialite, isEnglishView: boolean, onChange: (state: any) => void }) {

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const handleConfirmDelete = async () => {
        setLoadingDelete(true);
        try {
            await HttpService.delete<unknown>({ url: `/specialites/${specialite.id}` });
            onChange(true);
        } catch (e) {
            toast.error("Impossible de supprimer la spécialité");
            throw e;
        } finally {
            setLoadingDelete(false);
        }
    };

    const label = isEnglishView ? (specialite.libelle_en || specialite.libelle) : specialite.libelle;
    const count = specialite.articleCount ?? 0;

    return (
        <Card className="p-5 border-none mb-3 shadow-none flex flex-row justify-between items-center" key={specialite.id}>
            <div>
                <p className="my-0 text-slate-700 font-semibold py-0">
                    {isEnglishView ? specialite.libelle_en : specialite.libelle} 
                </p>
                <p className="my-0 text-slate-700 text-sm py-0">
                    {specialite.articleCount} article(s) . crée le {formatDateFr(specialite.createdAt ?? new Date())}
                </p>
            </div>
            <div className="flex space-x-2">

                <Dialog>
                    <DialogTrigger>
                        <Button title="Modifier" variant="success" size="sm" className="!rounded-full text-[11px] h-8 w-8 !bg-green-200 !text-green-700 !p-2">
                            <MdOutlineModeEditOutline className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <AddSpecialites specialite={specialite} onChange={onChange} />
                    </DialogContent>
                </Dialog>

                <Button
                    title="Supprimer"
                    variant="danger"
                    size="sm"
                    className="!rounded-full text-[11px] h-8 w-8 !bg-red-200 !text-red-700 !p-2"
                    onClick={(e) => { e.preventDefault(); setDeleteModalOpen(true); }}
                >
                    <LuTrash2 className="h-5 w-5" />
                </Button>
            </div>

            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Supprimer la spécialité"
                description={
                    count > 0
                        ? <>La spécialité « {label} » est utilisée par {count} article(s). Supprimer quand même ?</>
                        : <>Supprimer la spécialité « {label} » ?</>
                }
                loading={loadingDelete}
            />
        </Card>
    )
}