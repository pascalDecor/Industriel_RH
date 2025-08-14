import { useState } from "react";
import { HttpService } from "@/utils/http.services";
import { useBlogData } from "@/hooks/useBlogData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit2Icon } from "lucide-react";
import Button from "@/components/ui/button";
import MultiSelect from "@/components/ui/multiSelect";
import { Article } from "@/models/article";

interface EditTagsProps {
    article: Article;
    onChange: (state: any) => void;
}

export default function EditTags({ article, onChange }: EditTagsProps) {
    const { tags, isLoading: dataLoading } = useBlogData();
    const [editingTags, setEditingTags] = useState(false);
    const [tempTags, setTempTags] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSaveTags = async (article: Article) => {
        setIsLoading(true);
        try {
            await HttpService.update({
                url: `/articles/${article.id}`,
                data: {
                    tags: tempTags.map(t => t.value)
                }
            });
            setIsLoading(false);
            onChange(true); // Rafraîchir la liste
        } catch (error) {
            console.error('Erreur lors de la mise à jour des tags:', error);
            alert('Erreur lors de la mise à jour des tags');
        }

        setEditingTags(false);
    };

    return (
        <Dialog open={editingTags} onOpenChange={setEditingTags}>
            <DialogTrigger asChild>
                <Button
                    variant="success"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0 h-8 w-8"
                    onClick={() => {
                        setTempTags(article.tags.filter(t => t.id && t.libelle).map(t => ({ value: t.id, label: t.libelle })));
                        setEditingTags(true);
                    }}
                >
                    <Edit2Icon className="w-3 h-3 text-dark bg-dark" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier les tags</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {!dataLoading && (
                        <MultiSelect
                            enableCreate={true}
                            placeholder="Sélectionner les tags"
                            items={tags.filter(t => t.id && t.libelle).map((t) => ({ value: t.id, label: t.libelle }))}
                            defaultValue={tempTags}
                            onChange={setTempTags} />
                    )}
                    <div className="flex justify-end space-x-2">
                        <Button variant="light" onClick={() => setEditingTags(false)}>
                            Annuler
                        </Button>
                        <Button
                            isLoading={isLoading}
                            disabled={isLoading}
                            onClick={() => handleSaveTags(article)}>
                            Sauvegarder
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}