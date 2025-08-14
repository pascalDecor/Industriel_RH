import { useState } from "react";
import { HttpService } from "@/utils/http.services";
import { useBlogData } from "@/hooks/useBlogData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit2Icon } from "lucide-react";
import Button from "@/components/ui/button";
import MultiSelect from "@/components/ui/multiSelect";
import { Article } from "@/models/article";

interface EditSpecialitiesProps {
    article: Article;
    onChange: (state: any) => void;
}

export default function EditSpecialities({ article, onChange }: EditSpecialitiesProps) {
    const { specialites, isLoading: dataLoading } = useBlogData();
    const [editingSpecialites, setEditingSpecialites] = useState(false);
    const [tempSpecialites, setTempSpecialites] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSaveSpecialites = async (article: Article) => {
        setIsLoading(true);
        try {
            await HttpService.update({
                url: `/articles/${article.id}`,
                data: {
                    specialites: tempSpecialites.map(s => s.value)
                }
            });
            setIsLoading(false);
            onChange(true); // Rafraîchir la liste
        } catch (error) {
            console.error('Erreur lors de la mise à jour des spécialités:', error);
            alert('Erreur lors de la mise à jour des spécialités');
        }

        setEditingSpecialites(false);
    };

    return (
        <Dialog open={editingSpecialites} onOpenChange={setEditingSpecialites}>
            <DialogTrigger asChild>
                <Button
                    variant="success"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0 h-8 w-8"
                    onClick={() => {
                        setTempSpecialites(article.specialites.filter(s => s.id && s.libelle).map(s => ({ value: s.id, label: s.libelle })));
                        setEditingSpecialites(true);
                    }}
                >
                    <Edit2Icon className="w-3 h-3 text-dark bg-dark" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier les spécialités</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {!dataLoading && (
                        <MultiSelect
                            placeholder="Sélectionner les spécialités"
                            items={specialites.filter(s => s.id && s.libelle).map((s) => ({ value: s.id, label: s.libelle }))}
                            defaultValue={tempSpecialites}
                            onChange={setTempSpecialites} />
                    )}
                    <div className="flex justify-end space-x-2">
                        <Button variant="light" onClick={() => setEditingSpecialites(false)}>
                            Annuler
                        </Button>
                        <Button
                            isLoading={isLoading}
                            disabled={isLoading}
                            onClick={() => {
                                return handleSaveSpecialites(article);
                            }}>
                            Sauvegarder
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}   