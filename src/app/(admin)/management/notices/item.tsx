import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateFr } from "@/lib/formatDate";
import { Notice } from "@/models/notice";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { LuTrash2 } from "react-icons/lu";
import { MdOutlineModeEditOutline } from "react-icons/md";
import AddNotices from "./add";
import { HttpService } from "@/utils/http.services";
import { useState } from "react";
import { HiOutlineLanguage } from "react-icons/hi2";
import ShowStars from "./showStars";

type ItemNoticesProps = {
    notice: Notice,
    onChange?: (state: any) => void,
}

export default function ItemNotices({ notice, onChange }: ItemNoticesProps) {


    const [changeCount, setchangeCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [showEnglish, setShowEnglish] = useState(false);

    const [loadingDelete, setLoadingDelete] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const executeDelete = () => {
        setLoadingDelete(true);
        HttpService.delete<Notice>({
            url: `/notices/${notice.id}`,
        }).then((res) => {
            setLoadingDelete(false);
            setConfirmDelete(false);
            if (res && onChange) {
                onChange(res);
            }
        }).catch(() => {
            setLoadingDelete(false);
            setConfirmDelete(false);
        });
    };


    return (
        <Card className="p-5 border-none mb-3 shadow-none flex flex-row justify-between items-start cursor-pointer hover:shadow-md"
            key={notice.id}>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <p className="my-0 text-slate-700 font-bold py-0 mb-0">
                        {showEnglish ? (notice.author_en || notice.author) : notice.author}
                    </p>
                    {(notice.content_en || notice.author_en) && (
                        <Button
                            onClick={() => setShowEnglish(!showEnglish)}
                            variant={showEnglish ? "primary" : "secondary"}
                            size="sm"
                            className="!h-6 !px-2 !text-[10px] flex items-center gap-1"
                            title={showEnglish ? "Voir en français" : "Voir en anglais"}
                        >
                            {showEnglish ? (
                                <>
                                    <span className="text-xs">🇫🇷</span>
                                    <span>FR</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-xs">🇬🇧</span>
                                    <span>EN</span>
                                </>
                            )}
                        </Button>
                    )}
                </div>

                <p className="my-0 text-slate-700 text-sm py-0 mb-2">
                    "{showEnglish ? (notice.content_en || notice.content) : notice.content}"
                </p>

                {showEnglish && !notice.content_en && (
                    <p className="text-orange-600 text-xs italic mb-2">Version anglaise non disponible</p>
                )}

                <ShowStars star={notice.stars} />
            </div>
            <div>
                <div className="flex justify-end space-x-2 space-y-2">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger>
                            <Button title="Modifier" variant="success" size="sm" className="!rounded-full text-[11px] h-8 w-8 !bg-green-200 !text-green-700 !p-2">
                                <MdOutlineModeEditOutline className="h-5 w-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <AddNotices notice={notice} onChange={state => {
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


                    <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                        <DialogTrigger asChild>
                            <Button
                                title="Supprimer"
                                variant="danger"
                                size="sm"
                                className="!rounded-full text-[11px] h-8 w-8 !bg-red-200 !text-red-700 !p-2"
                            >
                                <LuTrash2 className="h-5 w-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">Supprimer l&apos;avis</h3>
                            <p className="text-sm text-slate-600 mb-3">
                                Êtes-vous sûr de vouloir supprimer cet avis ? Cette action est irréversible.
                            </p>
                            <p className="text-sm text-slate-500 mb-4 italic">
                                &quot;{notice.content.length > 80 ? notice.content.slice(0, 80) + "…" : notice.content}&quot;
                            </p>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setConfirmDelete(false)}
                                    disabled={loadingDelete}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={executeDelete}
                                    disabled={loadingDelete}
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
                <p className="my-0 text-slate-700 text-sm py-0 font-semibold">
                    crée le {formatDateFr(notice.createdAt ?? new Date())}
                </p>
            </div>

        </Card>
    )
}