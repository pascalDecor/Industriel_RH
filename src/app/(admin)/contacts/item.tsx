import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateFr } from "@/lib/formatDate";
import { Contact } from "@/models/contact";
import { LuPhone, LuTrash2 } from "react-icons/lu";

import { HttpService } from "@/utils/http.services";
import { useState } from "react";
import Image from "next/image";
import { imagePathFinder } from "@/utils/imagePathFinder";
import { FaRegEnvelope } from "react-icons/fa6";
import { TiLocationOutline } from "react-icons/ti";

export default function ItemContacts({ contact, onChange }: { contact: Contact, onChange: (status: any) => void }) {

    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingValidate, setLoadingValidate] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);
    const handleDelete = (id: string) => () => {
        setLoadingDelete(true);
        HttpService.delete<Contact>({
            url: `/contacts/${id}`,
        }).then((res) => {
            console.log(res);
            setLoadingDelete(false);
            if (res) {
                onChange(res);
            }
        })
    }

    const handleValidate = (id: string) => () => {
        setLoadingValidate(true);
        HttpService.update<Contact>({
            url: `/contacts/${id}`,
            data: { "status": "accepted" }
        }).then((res) => {
            console.log(res);
            setLoadingValidate(false);
            if (res) {
                onChange(res);
            }
        })
    }

    const handleReject = (id: string) => () => {
        setLoadingReject(true);
        HttpService.update<Contact>({
            url: `/contacts/${id}`,
            data: { "status": "rejected" }
        }).then((res) => {
            console.log(res);
            setLoadingReject(false);
            if (res) {
                onChange(res);
            }
        })
    }


    return (
        <Card className="p-5 border-none mb-3 shadow-none flex flex-row justify-between items-start" key={contact.id}>
            <div>
                <div className="flex items-center space-x-4 mb-4">
                    <Image loading="lazy" src={imagePathFinder.avatar} alt={contact.lastName + " " + contact.firstName} width={50} height={50} className="rounded-full bg-slate-300" />
                    <div>
                        <div className="flex items-center space-x-2">
                            <p className="mb-0.5 text-slate-700 font-semibold py-0 text-sm">
                                {contact.lastName} {contact.firstName}
                            </p>
                            <div className="bg-slate-200 text-slate-600  rounded-full text-[10px] px-2 py-1">
                                {contact.status}
                            </div>
                        </div>
                        <p className="my-0 text-slate-500 py-0 text-sm flex items-center space-x-2">
                            <FaRegEnvelope />    <span>{contact.workEmail}</span> .
                            <LuPhone /> <span>{contact.workPhone}</span> .
                            <TiLocationOutline /> <span>{contact.postalCode}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center  space-x-2">
                    <div className="bg-green-100 text-green-700 font-semibold rounded-full text-[11px] px-2 py-1">
                        {contact.priority}
                    </div>
                    <p className=" text-slate-700 text-sm">
                        company : <span className="font-semibold mr-5">{contact.companyName}</span> Poste : <span className="font-semibold">{contact.jobTitle}</span>
                    </p>
                </div>

                <p className=" text-slate-500  font-medium text-sm mt-3">
                    {contact.message}
                </p>

            </div>
            <div className="flex flex-col items-end justify-between h-full">
                <div className="flex items-center space-x-2">
                    {contact.status === "pending" && <Button onClick={handleValidate(contact.id)} title="Valider"
                        isLoading={loadingValidate} className="!p-2" variant="success" size="sm">Marquer comme traité</Button>}
                    {(contact.status === "accepted" || contact.status === "pending") && <Button onClick={handleReject(contact.id)} title="Décliner"
                        isLoading={loadingReject} className="!p-2 !text-slate-700" variant="warning" size="sm">Décliner</Button>}
                    <Button loadingColor="red" isLoading={loadingDelete} onClick={handleDelete(contact.id)} title="Supprimer" variant="danger" size="sm" className="!rounded-full text-[11px] h-8 w-8 !bg-red-200 !text-red-700 !p-2">
                        {!loadingDelete && <LuTrash2 className="h-5 w-5" />}
                    </Button>
                </div>
                <p className="my-2.5 text-slate-500 text-sm py-0">
                    crée le {formatDateFr(contact.createdAt ?? new Date())}
                </p>
            </div>

        </Card>
    )
}