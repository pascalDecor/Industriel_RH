'use client';

import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import '@/styles/editorjs.css';

// Importations dynamiques des outils
const Header = require('@editorjs/header');
const List = require('@editorjs/list');
const Quote = require('@editorjs/quote');
const Checklist = require('@editorjs/checklist');
const Table = require('@editorjs/table');
const CodeTool = require('@editorjs/code');
const Paragraph = require('@editorjs/paragraph');
const Embed = require('@editorjs/embed');
const ImageTool = require('@editorjs/image');

export default function EditorJSComponent({ onChange, initialData, placeholder = "Commence à écrire ton article ici...", className }: { onChange?: (data: any) => void, initialData?: any, placeholder?: string, className?: string }) {
    const editorRef = useRef<EditorJS | null>(null);

    useEffect(() => {
        if (!editorRef.current) {
            const editor = new EditorJS({
                holder: 'editorjs',
                placeholder: placeholder,

                data: initialData,
                onReady: () => {
                    console.log('Editor.js is ready to work!');
                },
                async onChange(api) {
                    const data = await editorRef.current!.save();
                    onChange?.(data);
                },
                tools: {
                    header: {
                        class: Header,
                        inlineToolbar: true,
                        config: {
                            levels: [2, 3, 4],
                            defaultLevel: 2,
                        },
                    },
                    paragraph: {
                        class: Paragraph,
                        inlineToolbar: true,
                    },
                    list: {
                        class: List,
                        inlineToolbar: true,
                    },
                    quote: {
                        class: Quote,
                        inlineToolbar: true,
                        config: {
                            quotePlaceholder: 'Citation...',
                            captionPlaceholder: 'Auteur',
                        },
                    },
                    checklist: {
                        class: Checklist,
                        inlineToolbar: true,
                    },
                    table: {
                        class: Table,
                        inlineToolbar: true,
                        config: {
                            rows: 2,
                            cols: 3,
                        },
                    },
                    code: CodeTool,
                    embed: {
                        class: Embed,
                        config: {
                            services: {
                                youtube: true,
                                coub: true,
                                instagram: true,
                            },
                        },
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            endpoints: {
                                byFile: '/api/upload',
                                byUrl: '/api/fetchImage', // Optionnel
                            },
                            captionPlaceholder: 'Légende de l\'image...',
                            buttonContent: 'Sélectionner une image',
                            uploader: {
                                async uploadByFile(file: File) {
                                    try {
                                        console.log("Uploading file:", file.name);

                                        const formData = new FormData();
                                        formData.append('image', file);

                                        const response = await fetch('/api/upload', {
                                            method: 'POST',
                                            credentials: 'include',
                                            body: formData,
                                        });

                                        const result = await response.json();
                                        console.log("Upload result:", result);

                                        if (result.success === 1) {
                                            return {
                                                success: 1,
                                                file: {
                                                    url: result.file.url,
                                                },
                                            };
                                        } else {
                                            throw new Error(result.error || 'Upload failed');
                                        }
                                    } catch (error) {
                                        console.error('Error uploading file:', error);
                                        return {
                                            success: 0,
                                            message: 'Erreur lors de l\'upload de l\'image',
                                        };
                                    }
                                },
                                async uploadByUrl(url: string) {
                                    try {
                                        const response = await fetch('/api/fetchImage', {
                                            method: 'POST',
                                            credentials: 'include',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({ url }),
                                        });

                                        const result = await response.json();

                                        if (result.success === 1) {
                                            return {
                                                success: 1,
                                                file: {
                                                    url: result.file.url,
                                                },
                                            };
                                        } else {
                                            throw new Error(result.error || 'Fetch failed');
                                        }
                                    } catch (error) {
                                        console.error('Error fetching image:', error);
                                        return {
                                            success: 0,
                                            message: 'Erreur lors de la récupération de l\'image',
                                        };
                                    }
                                },
                            },
                        },
                    },
                },
            });

            editorRef.current = editor;
        }

        return () => {
            const isMounted = false;
            if (editorRef.current && typeof editorRef.current.destroy === 'function') {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, []);

    return (
        <div className="w-full">
            <div
                id="editorjs"
                className={className + " border border-gray-300 rounded-xl p-4 min-h-[300px] w-full overflow-y-auto"}
            />
            <p className="text-xs text-gray-500 mt-2">
                💡 <strong>Astuce :</strong> Cliquez sur le bouton "+" à gauche pour ajouter des images, tableaux et plus encore.
            </p>
        </div>
    );
}
