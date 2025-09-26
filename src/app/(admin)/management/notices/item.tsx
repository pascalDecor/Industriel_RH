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

    const handleDelete = (id: string) => () => {
        console.log("id", id);
        setLoadingDelete(true);
        HttpService.delete<Notice>({
            url: `/notices/${id}`,
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


                    <Button loadingColor="red" isLoading={loadingDelete} onClick={handleDelete(notice.id)} title="Supprimer" variant="danger" size="sm" className="!rounded-full text-[11px] h-8 w-8 !bg-red-200 !text-red-700 !p-2">
                        {!loadingDelete && <LuTrash2 className="h-5 w-5" />}
                    </Button>
                </div>
                <p className="my-0 text-slate-700 text-sm py-0 font-semibold">
                    crée le {formatDateFr(notice.createdAt ?? new Date())}
                </p>
            </div>

        </Card>
    )
}