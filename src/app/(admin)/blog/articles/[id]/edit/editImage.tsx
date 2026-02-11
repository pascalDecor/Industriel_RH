import { useRef, useState } from "react";
import { HttpService } from "@/utils/http.services";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit2Icon, Save } from "lucide-react";
import Button from "@/components/ui/button";
import FloatingLabelInput from "@/components/ui/input";
import { Article } from "@/models/article";
import InputError from "@/components/ui/inputError";
import FileUpload from "@/components/ui/inputFile";
import { errors } from "jose";
import { uploadApiURL } from "@/constant/api";

interface EditImageProps {
    article: Article;
    onChange: (state: any) => void;
}

export default function EditImage({ article, onChange }: EditImageProps) {
    const [editingImage, setEditingImage] = useState(false);
    const [tempImage, setTempImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);



    const handleUpload = async (e: File) => {
        if (e && inputRef.current) {
            const dt = new DataTransfer();
            dt.items.add(e);
            inputRef.current.files = dt.files;
        }
    };

    const saveImage = async (file: File) => {
        console.log("Saving image:", file);
        let imagePath = '';
        try {
            // Upload image
            const formDataImage = new FormData();
            formDataImage.append('image', file);

            const res = await fetch(uploadApiURL, {
                method: 'POST',
                body: formDataImage,
            });
            const result = await res.json();
            imagePath = result.file.url;
            console.log("imagePath", imagePath);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'image:', error);
            alert('Erreur lors de la mise à jour de l\'image : ' + error);
            setIsLoading(false);
        }
        return imagePath;
    };

    const handleSaveImage = async (article: any) => {
        setIsLoading(true);
        try {
            // Préparer les données pour l'API
            let finalImageURL = tempImage.trim() !== '' ? tempImage : article.image;
            console.log("File selected 0:", inputRef.current?.files?.[0]);
            // Gérer l'image si elle a changé
            if (inputRef.current?.files?.[0] && inputRef.current.files[0] !== null) {
                console.log("File selected:", inputRef.current.files[0]);
                // Si l'URL de l'image a été modifiée, sauvegarder l'image
                finalImageURL = await saveImage(inputRef.current.files[0]);
            } else if (tempImage !== article?.image) {
                console.log("File selected 1", tempImage);
                // Si l'URL de l'image a été modifiée, sauvegarder l'image
                finalImageURL = tempImage;
            }
            console.log("finalImageURL", finalImageURL);

            if (finalImageURL !== article?.image) {
                await HttpService.update({
                    url: `/articles/${article.id}`,
                    data: { image: finalImageURL }
                });
            }

            setIsLoading(false);
            onChange(true); // Rafraîchir la liste
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'image:', error);
            alert('Erreur lors de la mise à jour de l\'image  : ' + error);
            setIsLoading(false);
        }

        setEditingImage(false);
    };

    return (
        <Dialog open={editingImage} onOpenChange={setEditingImage}>
            <DialogTrigger asChild>
                <Button
                    variant="success"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-0 h-8 w-8"
                    onClick={() => {
                        setTempImage(article.image || '');
                        setEditingImage(true);
                    }}
                >
                    <Edit2Icon className="w-3 h-3 text-dark bg-dark" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier l'image</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <input type="file" hidden name="image" accept="image/*" ref={inputRef} onChange={(e) => handleUpload(e.target.files![0])} />
                    <FloatingLabelInput
                        label="URL de l'image"
                        value={tempImage}
                        onChange={(e) => setTempImage(e.target.value)}
                        placeholder="https://exemple.com/image.jpg" />

                    {/* Edition de l'image */}
                    <FileUpload
                        showPreview={false}
                        className='w-full'
                        label="Modifier l\'image"
                        accept={{ 'image': ["image/*"] }}
                        onFileSelect={(file) => {
                            if (file) {
                                handleUpload(file as File);
                                const imageUrl = URL.createObjectURL(file);
                                setTempImage(imageUrl);
                            }
                        }}
                    />
                    {/* {tempImage && tempImage?.trim() !== '' && (
                        <Image
                            loading="lazy"
                            src={tempImage}
                            alt={article?.titre || "Image sélectionnée"}
                            width={500}
                            height={500}
                            className="w-full mt-5 rounded-lg"
                        />
                    )} */}
                    {/* <InputError messages={errors?.image} inputName="image" /> */}
                    {/* Fin edition de l'image */}
                    {tempImage && (
                        <div className="mt-4">
                            <img
                                src={tempImage}
                                alt="Aperçu"
                                className="max-w-xs h-auto rounded border"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }} />
                        </div>
                    )}
                    <div className="flex justify-end space-x-2">
                        <Button variant="light" onClick={() => setEditingImage(false)}>
                            Annuler
                        </Button>
                        <Button
                            isLoading={isLoading}
                            disabled={isLoading}
                            onClick={() => handleSaveImage(article)}>
                            Sauvegarder
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}   