import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateFr } from "@/lib/formatDate";
import { Hire } from "@/models/hire";
import { LuDownload, LuPhone, LuTrash2 } from "react-icons/lu";

import { HttpService } from "@/utils/http.services";
import { useState } from "react";
import Image from "next/image";
import { imagePathFinder } from "@/utils/imagePathFinder";
import { FaRegEnvelope } from "react-icons/fa6";
import { getFileIcon } from "@/components/ui/inputFile";

type ItemHiresProps = {
    hire: Hire,
    onChange?: (state: any) => void,
    onActive?: (sector: Hire) => void
}
export default function ItemHires({ hire, onChange, onActive }: ItemHiresProps) {

    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingValidate, setLoadingValidate] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);
    const handleDelete = (id: string) => () => {
        setLoadingDelete(true);
        HttpService.delete<Hire>({
            url: `/hires/${id}`,
        }).then((res) => {
            console.log(res);
            setLoadingDelete(false);
            if (res) {
                 if (onChange) {
                    onChange(res);
                }
            }
        })
    }

    const handleValidate = (id: string) => () => {
        setLoadingValidate(true);
        HttpService.update<Hire>({
            url: `/hires/${id}`,
            data: { "state": "accepted" }
        }).then((res) => {
            console.log(res);
            setLoadingValidate(false);
            if (res) {
                if (onChange) {
                    onChange(res);
                }
            }
        })
    }

    const handleReject = (id: string) => () => {
        setLoadingReject(true);
        HttpService.update<Hire>({
            url: `/hires/${id}`,
            data: { "state": "rejected" }
        }).then((res) => {
            console.log(res);
            setLoadingReject(false);
            if (res) {
                 if (onChange) {
                    onChange(res);
                }
            }
        })
    }


    return (
        <Card className="p-5 border-none mb-3 shadow-none flex flex-row justify-between items-start cursor-pointer" key={hire.id} onClick={() => onActive && onActive(hire)}>
            <div>
                <div className="flex items-center space-x-4 mb-4">
                    <Image src={imagePathFinder.hire} alt={hire.lastName + " " + hire.firstName} width={50} height={50} className="rounded-full bg-blue-200" />
                    <div>
                        <div className="flex items-center space-x-2">
                            <p className="mb-0.5 text-slate-700 font-semibold py-0 text-sm">
                                {hire.lastName} {hire.firstName}
                            </p>
                            <div className="bg-slate-200 text-slate-600  rounded-full text-[10px] px-2 py-1">
                                {hire.state}
                            </div>
                        </div>
                        <p className="my-0 text-slate-500 py-0 text-sm flex items-center space-x-2">
                            <FaRegEnvelope />    <span>{hire.email}</span> .
                            <LuPhone /> <span>{hire.phone}</span> .
                        </p>
                    </div>
                </div>
                <div className="flex items-center  space-x-2">
                    <div className="bg-green-100 text-green-700 font-semibold rounded-full text-sm px-2 py-1">
                        {hire.sectors?.map(s => s.libelle).join(' | ')}
                    </div>
                    <p className=" text-slate-700  font-semibold text-sm">
                        {hire.number_of_positions} poste{hire.number_of_positions > 1 && "s"}
                    </p>
                </div>

            </div>
            <div className="flex flex-col items-end justify-between h-full">
                <div className="flex items-center space-x-2">
                    {hire.state === "pending" && <Button onClick={handleValidate(hire.id)} title="Valider"
                        isLoading={loadingValidate} className="!p-2" variant="success" size="sm">Valider</Button>}
                    {(hire.state === "accepted" || hire.state === "pending") && <Button onClick={handleReject(hire.id)} title="Décliner"
                        isLoading={loadingReject} className="!p-2 !text-slate-700" variant="warning" size="sm">Décliner</Button>}
                    <Button loadingColor="red" isLoading={loadingDelete} onClick={handleDelete(hire.id)} title="Supprimer" variant="danger" size="sm" className="!rounded-full text-[11px] h-8 w-8 !bg-red-200 !text-red-700 !p-2">
                        {!loadingDelete && <LuTrash2 className="h-5 w-5" />}
                    </Button>
                </div>
                <p className="my-2.5 text-slate-500 text-sm py-0">
                    crée le {formatDateFr(hire.createdAt ?? new Date())}
                </p>
                <div className="flex items-center space-x-2">
                    {hire.document_support && <a className="flex items-center space-x-2 text-slate-500 text-sm py-1 px-3 border-2 rounded-full border-slate-200 hover:border-slate-400 hover:text-slate-700 hover:no-underline" href={hire.document_support} target="_blank" rel="noreferrer">
                        {getFileIcon(hire.document_support, "!w-4 !h-4 mx-auto mr-2")}
                        <span>Document support</span>
                        <LuDownload />
                    </a>}
                </div>
            </div>

        </Card>
    )
}