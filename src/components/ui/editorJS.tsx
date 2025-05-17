'use client';

import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';

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

export default function EditorJSComponent({ onChange, placeholder = "Commence à écrire ton article ici...", className }: { onChange?: (data: any) => void, placeholder?: string, className?: string }) {
    const editorRef = useRef<EditorJS | null>(null);

    useEffect(() => {
        if (!editorRef.current) {
            const editor = new EditorJS({
                holder: 'editorjs',
                placeholder: placeholder,

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
                                // byFile: '/api/upload', // Tu devras créer cette API route
                                byUrl: '/api/fetchImage', // Optionnel
                            },
                            captionPlaceholder: 'Légende...',
                            buttonContent: 'Choisir une image',
                            uploader: {
                                async uploadByFile(file: File) {
                                    // Exemple d'upload simplifié localement
                                    console.log("upload simplifié localement file", file);
                                    // const formData = new FormData();
                                    // formData.append('image', file);

                                    // const res = await fetch('/api/upload', {
                                    //     method: 'POST',
                                    //     body: formData,
                                    // });

                                    // const result = await res.json();
                                    console.log("upload file URL.createObjectURL(file!)", URL.createObjectURL(file!));

                                    return {
                                        success: 1,
                                        file: {
                                            url: URL.createObjectURL(file!), // L’URL de l’image renvoyée par l’API
                                        },
                                    };
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
        <div
            id="editorjs"
            className={className + " border border-gray-300 rounded-xl p-4 min-h-[300px] w-full overflow-y-auto"}
        />
    );
}
