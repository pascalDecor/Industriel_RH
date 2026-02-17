import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateFr } from "@/lib/formatDate";
import { Hire } from "@/models/hire";
import { LuDownload, LuPhone, LuTrash2 } from "react-icons/lu";
import Image from "next/image";
import { HttpService } from "@/utils/http.services";
import { useState } from "react";
import { imagePathFinder } from "@/utils/imagePathFinder";
import { FaRegEnvelope } from "react-icons/fa6";
import { getFileIcon } from "@/components/ui/inputFile";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import ConfirmActionModal from "@/components/ui/ConfirmActionModal";
import { toast } from "sonner";

type ItemHiresProps = {
    hire: Hire;
    onChange?: (state: any) => void;
    onActive?: (hire: Hire) => void;
};

export default function ItemHires({ hire, onChange, onActive }: ItemHiresProps) {
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingValidate, setLoadingValidate] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);
    const [validateModalOpen, setValidateModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const name = `${hire.lastName} ${hire.firstName}`;

    const handleConfirmValidate = async () => {
        setLoadingValidate(true);
        try {
            await HttpService.update<Hire>({ url: `/hires/${hire.id}`, data: { state: "accepted" } });
            onChange?.(true);
        } catch (e) {
            toast.error("Impossible de valider l'embauche");
            throw e;
        } finally {
            setLoadingValidate(false);
        }
    };

    const handleConfirmReject = async () => {
        setLoadingReject(true);
        try {
            await HttpService.update<Hire>({ url: `/hires/${hire.id}`, data: { state: "rejected" } });
            onChange?.(true);
        } catch (e) {
            toast.error("Impossible de décliner l'embauche");
            throw e;
        } finally {
            setLoadingReject(false);
        }
    };

    const handleConfirmDelete = async () => {
        setLoadingDelete(true);
        try {
            await HttpService.delete<unknown>({ url: `/hires/${hire.id}` });
            onChange?.(true);
        } catch (e) {
            toast.error("Impossible de supprimer l'embauche");
            throw e;
        } finally {
            setLoadingDelete(false);
        }
    };

    const handleCardClick = () => {
        onActive?.(hire);
    };

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <Card
            className="p-5 border-none mb-3 shadow-none flex flex-row justify-between items-start cursor-pointer"
            key={hire.id}
            onClick={handleCardClick}
        >
            <div>
                <div className="flex items-center space-x-4 mb-4">
                    <Image loading="lazy" src={imagePathFinder.hire} alt={name} width={50} height={50} className="rounded-full bg-blue-200" />
                    <div>
                        <div className="flex items-center space-x-2">
                            <p className="mb-0.5 text-slate-700 font-semibold py-0 text-sm">
                                {hire.lastName} {hire.firstName}
                            </p>
                            <div className="bg-slate-200 text-slate-600 rounded-full text-[10px] px-2 py-1">
                                {hire.state}
                            </div>
                        </div>
                        <p className="my-0 text-slate-500 py-0 text-sm flex items-center space-x-2">
                            <FaRegEnvelope /> <span>{hire.email}</span> .
                            <LuPhone /> <span>{hire.phone}</span> .
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="bg-green-100 text-green-700 font-semibold rounded-full text-sm px-2 py-1">
                        {hire.sectors?.map((s) => s.libelle).join(" | ")}
                    </div>
                    <p className="text-slate-700 font-semibold text-sm">
                        {hire.number_of_positions} poste{hire.number_of_positions > 1 && "s"}
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-end justify-between h-full" onClick={stopPropagation}>
                <div className="flex items-center space-x-2">
                    {hire.state === "pending" && (
                        <Button title="Valider" variant="success" size="sm" className="!p-2" onClick={() => setValidateModalOpen(true)}>
                            Valider
                        </Button>
                    )}
                    {(hire.state === "accepted" || hire.state === "pending") && (
                        <Button
                            title="Décliner"
                            variant="warning"
                            size="sm"
                            className="!p-2 !text-slate-700"
                            onClick={() => setRejectModalOpen(true)}
                        >
                            Décliner
                        </Button>
                    )}
                    <Button
                        title="Supprimer"
                        variant="danger"
                        size="sm"
                        className="!rounded-full text-[11px] h-8 w-8 !bg-red-200 !text-red-700 !p-2"
                        onClick={() => setDeleteModalOpen(true)}
                    >
                        <LuTrash2 className="h-5 w-5" />
                    </Button>
                </div>
                <p className="my-2.5 text-slate-500 text-sm py-0">
                    crée le {formatDateFr(hire.createdAt ?? new Date())}
                </p>
                <div className="flex items-center space-x-2">
                    {hire.document_support && (
                        <a
                            className="flex items-center space-x-2 text-slate-500 text-sm py-1 px-3 border-2 rounded-full border-slate-200 hover:border-slate-400 hover:text-slate-700 hover:no-underline"
                            href={hire.document_support}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {getFileIcon(hire.document_support, "!w-4 !h-4 mx-auto mr-2")}
                            <span>Document support</span>
                            <LuDownload />
                        </a>
                    )}
                </div>
            </div>

            <ConfirmActionModal
                isOpen={validateModalOpen}
                onClose={() => setValidateModalOpen(false)}
                onConfirm={handleConfirmValidate}
                title="Valider l'embauche"
                description={<>Valider l'embauche « {name} » ?</>}
                confirmLabel="Valider"
                variant="success"
                loading={loadingValidate}
            />
            <ConfirmActionModal
                isOpen={rejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                onConfirm={handleConfirmReject}
                title="Décliner l'embauche"
                description={<>Décliner l'embauche « {name} » ? Elle sera déplacée dans Rejetées.</>}
                confirmLabel="Décliner"
                variant="warning"
                loading={loadingReject}
            />
            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Supprimer l'embauche"
                description={<>Supprimer définitivement l'embauche « {name} » ?</>}
                loading={loadingDelete}
            />
        </Card>
    );
}