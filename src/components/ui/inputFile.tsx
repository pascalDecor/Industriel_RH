"use client";
import { useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { FileText, Upload } from "lucide-react";
import clsx from "clsx";
import { BsFilePdf } from "react-icons/bs";
import Image from "next/image";

interface FileUploadProps {
    label?: string;
    onFileSelect?: (file: File | null) => void;
    accept?: Accept;
    className?: string;
}

export default function FileUpload({
    label = "Click or drag a file to this area to upload",
    onFileSelect,
    accept = { 'image': ["image/*"], 'application': ["application/*"] },
    className = "",
}: Readonly<FileUploadProps>) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const onDrop = (acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            if (onFileSelect) onFileSelect(selectedFile);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple: false,
    });


    // Déterminer l'icône selon le type de fichier
    const getFileIcon = () => {
        if (!file) return null;
        if (file.type.includes("pdf")) return <BsFilePdf className="text-red-500 w-10 h-10" />;
        if (file.type.includes("text") || file.name.endsWith(".doc") || file.name.endsWith(".docx"))
            return <FileText className="text-blue-500 w-10 h-10" />;
        return <Upload className="text-gray-500 w-10 h-10" />;
    };

    return (
        <div className="w-full flex items-center justify-center">
            <div
                {...getRootProps()}
                className={clsx(
                    "w-full flex flex-col items-center justify-center p-6 border-2 bg-white border-dashed rounded-xl transition cursor-pointer",
                    isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300",
                    className
                )}
            >
                <input {...getInputProps()} />
                <Upload className="w-10 h-10 text-gray-400" />
                <p className="text-gray-500 text-sm">{label}</p>
            </div>

            {/* Aperçu du fichier sélectionné */}
            {file && (
                <div className="ml-3 flex flex-col items-center">
                    {preview ? (
                        <Image
                            src={preview}
                            alt="Preview"
                            className="mt-2 w-32 h-28 object-cover rounded-lg shadow"
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                            {getFileIcon()}
                            <a
                                href={URL.createObjectURL(file)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-sm"
                            >
                                {file.name}
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
