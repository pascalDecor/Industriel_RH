import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateFr } from "@/lib/formatDate";
import { Contact } from "@/models/contact";
import { LuPhone, LuTrash2, LuMail } from "react-icons/lu";
import Image from "next/image";
import { HttpService } from "@/utils/http.services";
import { useState } from "react";
import { imagePathFinder } from "@/utils/imagePathFinder";
import { FaRegEnvelope } from "react-icons/fa6";
import { TiLocationOutline } from "react-icons/ti";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import ConfirmActionModal from "@/components/ui/ConfirmActionModal";
import { toast } from "sonner";

export default function ItemContacts({ contact, onChange }: { contact: Contact; onChange: (status: any) => void }) {
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingValidate, setLoadingValidate] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);
    const [loadingRead, setLoadingRead] = useState(false);
    const [validateModalOpen, setValidateModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const name = `${contact.lastName} ${contact.firstName}`;

    const handleConfirmValidate = async () => {
        setLoadingValidate(true);
        try {
            await HttpService.update<Contact>({ url: `/contacts/${contact.id}`, data: { status: "accepted" } });
            onChange(true);
        } catch (e) {
            toast.error("Impossible de valider le contact");
            throw e;
        } finally {
            setLoadingValidate(false);
        }
    };

    const handleConfirmReject = async () => {
        setLoadingReject(true);
        try {
            await HttpService.update<Contact>({ url: `/contacts/${contact.id}`, data: { status: "rejected" } });
            onChange(true);
        } catch (e) {
            toast.error("Impossible de décliner le contact");
            throw e;
        } finally {
            setLoadingReject(false);
        }
    };

    const handleConfirmDelete = async () => {
        setLoadingDelete(true);
        try {
            await HttpService.delete<unknown>({ url: `/contacts/${contact.id}` });
            onChange(true);
        } catch (e) {
            toast.error("Impossible de supprimer le contact");
            throw e;
        } finally {
            setLoadingDelete(false);
        }
    };

    const handleMarkAsRead = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (contact.isRead) return;
        setLoadingRead(true);
        try {
            await HttpService.update<Contact>({ url: `/contacts/${contact.id}`, data: { isRead: true } });
            onChange(true);
        } catch (e) {
            toast.error("Impossible de marquer comme lu");
        } finally {
            setLoadingRead(false);
        }
    };

    return (
        <Card className="p-5 border-none mb-3 shadow-none flex flex-row justify-between items-start" key={contact.id}>
            <div>
                <div className="flex items-center space-x-4 mb-4">
                    <Image loading="lazy" src={imagePathFinder.avatar} alt={name} width={50} height={50} className="rounded-full bg-slate-300" />
                    <div>
                        <div className="flex items-center space-x-2">
                            <p className="mb-0.5 text-slate-700 font-semibold py-0 text-sm">
                                {contact.lastName} {contact.firstName}
                            </p>
                            <div className="bg-slate-200 text-slate-600 rounded-full text-[10px] px-2 py-1">
                                {contact.status}
                            </div>
                            {!contact.isRead && (
                                <span className="bg-blue-100 text-blue-700 rounded-full text-[10px] px-2 py-1">Non lu</span>
                            )}
                        </div>
                        <p className="my-0 text-slate-500 py-0 text-sm flex items-center space-x-2">
                            <FaRegEnvelope /> <span>{contact.workEmail}</span> .
                            <LuPhone /> <span>{contact.workPhone}</span> .
                            <TiLocationOutline /> <span>{contact.postalCode}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="bg-green-100 text-green-700 font-semibold rounded-full text-[11px] px-2 py-1">
                        {contact.priority}
                    </div>
                    <p className="text-slate-700 text-sm">
                        company : <span className="font-semibold mr-5">{contact.companyName}</span> Poste : <span className="font-semibold">{contact.jobTitle}</span>
                    </p>
                </div>
                <p className="text-slate-500 font-medium text-sm mt-3">
                    {contact.message}
                </p>
            </div>
            <div className="flex flex-col items-end justify-between h-full">
                <div className="flex items-center space-x-2 flex-wrap justify-end">
                    {!contact.isRead && (
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
                    {contact.status === "pending" && (
                        <Button
                            title="Valider"
                            variant="success"
                            size="sm"
                            className="!p-2"
                            onClick={() => setValidateModalOpen(true)}
                        >
                            Marquer comme traité
                        </Button>
                    )}
                    {(contact.status === "accepted" || contact.status === "pending") && (
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
                    crée le {formatDateFr(contact.createdAt ?? new Date())}
                </p>
            </div>

            <ConfirmActionModal
                isOpen={validateModalOpen}
                onClose={() => setValidateModalOpen(false)}
                onConfirm={handleConfirmValidate}
                title="Valider le contact"
                description={<>Marquer le contact « {name} » comme traité ?</>}
                confirmLabel="Valider"
                variant="success"
                loading={loadingValidate}
            />
            <ConfirmActionModal
                isOpen={rejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                onConfirm={handleConfirmReject}
                title="Décliner le contact"
                description={<>Décliner le contact « {name} » ? Il sera déplacé dans Rejetées.</>}
                confirmLabel="Décliner"
                variant="warning"
                loading={loadingReject}
            />
            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Supprimer le contact"
                description={<>Supprimer définitivement le contact « {name} » ?</>}
                loading={loadingDelete}
            />
        </Card>
    );
}