import { useState } from "react";
import { HttpService } from "@/utils/http.services";
import { useBlogData } from "@/hooks/useBlogData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit2Icon } from "lucide-react";
import Button from "@/components/ui/button";
import FloatingLabelInput from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface EditTitleProps {
    article: any;
    onChange: (state: any) => void;
}

export default function EditTitle({ article, onChange }: EditTitleProps) {
    const { isLoading: dataLoading } = useBlogData();
    const [editingTitle, setEditingTitle] = useState(false);
    const [tempTitle, setTempTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSaveTitle = async (article: any) => {
        setIsLoading(true);
        try {
            await HttpService.update({
                url: `/articles/${article.id}`,
                data: { titre: tempTitle }
            });
            setIsLoading(false);
            onChange(true); // Rafraîchir la liste
        } catch (error) {
            console.error('Erreur lors de la mise à jour du titre:', error);
            alert('Erreur lors de la mise à jour du titre');
        }

        setEditingTitle(false);
    };

    return (
        <Dialog open={editingTitle} onOpenChange={setEditingTitle}>
            <DialogTrigger asChild>
                <Button
                    variant="success"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0 h-8 w-8"
                    onClick={() => {
                        setTempTitle(article.titre);
                        setEditingTitle(true);
                    }}
                >
                    <Edit2Icon className="w-3 h-3 text-dark bg-dark" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier le titre</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <FloatingLabelInput
                        label="Nouveau titre"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        placeholder="Entrez le nouveau titre" />
                    <div className="flex justify-end space-x-2">
                        <Button variant="light" onClick={() => setEditingTitle(false)}>
                            Annuler
                        </Button>
                        <Button
                            isLoading={isLoading}
                            disabled={isLoading}
                            onClick={() => handleSaveTitle(article)}>
                            Sauvegarder
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}