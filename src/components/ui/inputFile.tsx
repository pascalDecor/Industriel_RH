"use client";
import { useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import Image from "next/image";
import { imageTypes } from "@/constant/types";

import {
    FaFilePdf,
    FaFileWord,
    FaFileExcel,
    FaFilePowerpoint,
    FaRegFileImage,
    FaFileVideo,
    FaFileAudio,
    FaFileArchive,
    FaFileCode,
    FaFileAlt,
} from 'react-icons/fa'
import clsx from 'clsx'

interface FileUploadProps {
    label?: string;
    onFileSelect?: (file: File | null) => void;
    accept?: Accept;
    className?: string;
    showPreview?: boolean;
}

type FileLike = File | { url: string; name?: string; type?: string } | string;

// Déterminer l'icône selon le type de fichier
export const getFileIcon = (fileInput?: FileLike, className?: string) => {
    if (!fileInput) return null

    // Extraire nom et mime
    let name = ''
    let mime = ''

    if (typeof fileInput === 'string') {
        // URL passée directement
        try {
            const url = new URL(fileInput, window && window.location.origin)
            const parts = url.pathname.split('/')
            name = parts.pop() || fileInput
        } catch {
            name = fileInput
        }
    } else if (fileInput instanceof File) {
        name = fileInput.name
        mime = fileInput.type
    } else {
        // Objet avec url, nom, type
        if (fileInput.name) {
            name = fileInput.name
        } else {
            try {
                const url = new URL(fileInput.url, window && window.location.origin)
                const parts = url.pathname.split('/')
                name = parts.pop() || fileInput.url
            } catch {
                name = fileInput.url
            }
        }
        mime = fileInput.type || ''
    }

    const ext = name.split('.').pop()?.toLowerCase() || ''
    const baseClasses = clsx('w-10 h-10', className)

    switch (true) {
        case mime === 'application/pdf' || ext === 'pdf':
            return <FaFilePdf className={clsx('text-red-500', baseClasses)} />

        case
            mime === 'application/msword' ||
            mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            ['doc', 'docx'].includes(ext):
            return <FaFileWord className={clsx('text-blue-700', baseClasses)} />

        case
            mime === 'application/vnd.ms-excel' ||
            mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            ext === 'csv':
            return <FaFileExcel className={clsx('text-green-600', baseClasses)} />

        case
            mime === 'application/vnd.ms-powerpoint' ||
            mime === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
            ['ppt', 'pptx'].includes(ext):
            return <FaFilePowerpoint className={clsx('text-orange-600', baseClasses)} />

        case mime.startsWith('image/') ||
            ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'].includes(ext):
            return <FaRegFileImage className={clsx('text-purple-500', baseClasses)} />

        case mime.startsWith('video/') ||
            ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext):
            return <FaFileVideo className={clsx('text-yellow-500', baseClasses)} />

        case mime.startsWith('audio/') ||
            ['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(ext):
            return <FaFileAudio className={clsx('text-indigo-500', baseClasses)} />

        case ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext):
            return <FaFileArchive className={clsx('text-gray-500', baseClasses)} />

        case ['js', 'ts', 'jsx', 'tsx', 'json', 'html', 'css', 'md', 'xml', 'yml', 'yaml'].includes(ext):
            return <FaFileCode className={clsx('text-blue-400', baseClasses)} />

        case mime.startsWith('text/') || ['txt', 'rtf'].includes(ext):
            return <FaFileAlt className={clsx('text-blue-500', baseClasses)} />

        default:
            return <FaFileAlt className={clsx('text-gray-400', baseClasses)} />
    }
}


export default function FileUpload({
    label = "Click or drag a file to this area to upload",
    onFileSelect,
    accept = { 'image': ["image/*"], 'application': ["application/*"] },
    className = "",
    showPreview = true,
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
            {(file && showPreview) && (
                <div className="ml-3 flex flex-col items-center">
                    {(preview && imageTypes.includes(file.type)) ? (
                        <a
                            href={URL.createObjectURL(file)}
                            target="_blank"
                            rel="noopener noreferrer">
                            <Image src={preview}
                                alt="Preview" width={100} height={100}
                                className="mt-2 w-32 h-28 object-cover rounded-lg shadow" />
                        </a>
                    ) : (
                        <div className="text-center gap-2 bg-white px-2 py-3 rounded-lg h-full shadow">
                            {getFileIcon(file, "w-5 h-5 mx-auto")}
                            <a
                                href={URL.createObjectURL(file)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-600 underline text-sm"
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
