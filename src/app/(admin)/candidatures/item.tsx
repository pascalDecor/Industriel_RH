import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateFr } from "@/lib/formatDate";
import { Application } from "@/models/application";
import { LuDownload, LuPhone, LuTrash2, LuMail } from "react-icons/lu";
import Image from "next/image";
import { HttpService } from "@/utils/http.services";
import { useState } from "react";
import { imagePathFinder } from "@/utils/imagePathFinder";
import { FaRegEnvelope } from "react-icons/fa6";
import { TiLocationOutline } from "react-icons/ti";
import { getFileIcon } from "@/components/ui/inputFile";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import ConfirmActionModal from "@/components/ui/ConfirmActionModal";
import { toast } from "sonner";

export default function ItemCandidatures({ candidature, onChange }: { candidature: Application; onChange: (state: any) => void }) {
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingValidate, setLoadingValidate] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);
    const [loadingRead, setLoadingRead] = useState(false);
    const [validateModalOpen, setValidateModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const name = `${candidature.lastName} ${candidature.firstName}`;

    const handleConfirmValidate = async () => {
        setLoadingValidate(true);
        try {
            await HttpService.update<Application>({ url: `/applications/${candidature.id}`, data: { state: "accepted" } });
            onChange(true);
        } catch (e) {
            toast.error("Impossible de valider la candidature");
            throw e;
        } finally {
            setLoadingValidate(false);
        }
    };

    const handleConfirmReject = async () => {
        setLoadingReject(true);
        try {
            await HttpService.update<Application>({ url: `/applications/${candidature.id}`, data: { state: "rejected" } });
            onChange(true);
        } catch (e) {
            toast.error("Impossible de décliner la candidature");
            throw e;
        } finally {
            setLoadingReject(false);
        }
    };

    const handleConfirmDelete = async () => {
        setLoadingDelete(true);
        try {
            await HttpService.delete<unknown>({ url: `/applications/${candidature.id}` });
            onChange(true);
        } catch (e) {
            toast.error("Impossible de supprimer la candidature");
            throw e;
        } finally {
            setLoadingDelete(false);
        }
    };

    const handleMarkAsRead = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (candidature.isRead) return;
        setLoadingRead(true);
        try {
            await HttpService.update<Application>({ url: `/applications/${candidature.id}`, data: { isRead: true } });
            onChange(true);
        } catch (e) {
            toast.error("Impossible de marquer comme lu");
        } finally {
            setLoadingRead(false);
        }
    };

    return (
        <Card className="p-5 border-none mb-3 shadow-none flex flex-row justify-between items-start" key={candidature.id}>
            <div>
                <div className="flex items-center space-x-4 mb-4">
                    <Image loading="lazy" src={imagePathFinder.avatar} alt={name} width={50} height={50} className="rounded-full bg-slate-300" />
                    <div>
                        <div className="flex items-center space-x-2">
                            <p className="mb-0.5 text-slate-700 font-semibold py-0 text-sm">
                                {candidature.lastName} {candidature.firstName}
                            </p>
                            <div className="bg-slate-200 text-slate-600 rounded-full text-[10px] px-2 py-1">
                                {candidature.state}
                            </div>
                            {!candidature.isRead && (
                                <span className="bg-blue-100 text-blue-700 rounded-full text-[10px] px-2 py-1">Non lu</span>
                            )}
                        </div>
                        <p className="my-0 text-slate-500 py-0 text-sm flex items-center space-x-2">
                            <FaRegEnvelope /> <span>{candidature.email}</span> .
                            <LuPhone /> <span>{candidature.phone}</span> .
                            <TiLocationOutline /> <span>{candidature.city?.libelle}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="bg-green-100 text-green-700 font-semibold rounded-full text-sm px-2 py-1">
                        {candidature.sector?.libelle}
                    </div>
                    <p className="text-slate-700 font-semibold text-sm">
                        {candidature.function?.libelle} . {candidature.year_of_experience} années d'expérience
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-end justify-between h-full">
                <div className="flex items-center space-x-2 flex-wrap justify-end">
                    {!candidature.isRead && (
                        <Button
                            title="Marquer comme lu"
                            variant="light"
                            size="sm"
                            className="!p-2"
                            onClick={handleMarkAsRead}
                            disabled={loadingRead}
                        >
                            <LuMail className="h-4 w-4 mr-1" />
                            Lu
                        </Button>
                    )}
                    {candidature.state === "pending" && (
                        <Button title="Valider" variant="success" size="sm" className="!p-2" onClick={() => setValidateModalOpen(true)}>
                            Valider
                        </Button>
                    )}
                    {(candidature.state === "accepted" || candidature.state === "pending") && (
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
                    crée le {formatDateFr(candidature.createdAt ?? new Date())}
                </p>
                <div className="flex items-center space-x-2">
                    <a className="flex items-center space-x-2 text-slate-500 text-sm py-1 px-3 border-2 rounded-full border-slate-200 hover:border-slate-400 hover:text-slate-700 hover:no-underline" href={candidature.cv} target="_blank" rel="noreferrer">
                        {getFileIcon(candidature.cv, "!w-4 !h-4 mx-auto mr-2")}
                        <span>Curriculum Vitae</span>
                        <LuDownload />
                    </a>
                    <a className="flex items-center space-x-2 text-slate-500 text-sm py-1 px-3 border-2 rounded-full border-slate-200 hover:border-slate-400 hover:text-slate-700 hover:no-underline" href={candidature.coverLetter} target="_blank" rel="noreferrer">
                        {getFileIcon(candidature.coverLetter, "!w-4 !h-4 mx-auto mr-2")}
                        <span>Lettre de présentation</span>
                        <LuDownload />
                    </a>
                </div>
            </div>

            <ConfirmActionModal
                isOpen={validateModalOpen}
                onClose={() => setValidateModalOpen(false)}
                onConfirm={handleConfirmValidate}
                title="Valider la candidature"
                description={<>Valider la candidature de « {name} » ?</>}
                confirmLabel="Valider"
                variant="success"
                loading={loadingValidate}
            />
            <ConfirmActionModal
                isOpen={rejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                onConfirm={handleConfirmReject}
                title="Décliner la candidature"
                description={<>Décliner la candidature de « {name} » ? Elle sera déplacée dans Rejetées.</>}
                confirmLabel="Décliner"
                variant="warning"
                loading={loadingReject}
            />
            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Supprimer la candidature"
                description={<>Supprimer définitivement la candidature de « {name} » ?</>}
                loading={loadingDelete}
            />
        </Card>
    );
}