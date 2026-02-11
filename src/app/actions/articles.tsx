
"use client";

import { baseApiURL, uploadApiURL } from '@/constant/api';
import { FormState, AddArticleFormSchema, } from '@/lib/definitions'
import { Article } from '@/models/article'
import { User } from '@/models/user';
import { HttpService } from '@/utils/http.services'
import { LocalStorageHelper } from '@/utils/localStorage.helper';
// import { mkdir, writeFile } from 'fs/promises';
// import path from 'path';

export async function addArticle(state: FormState, formData: FormData) {
    // Récupération temporaire de l'ID utilisateur depuis le formulaire
    // Idéalement, ceci devrait venir de la session authentifiée
    const authorIdFromForm = formData.get('authorId')?.toString();
    console.log("AuthorId reçu du formulaire:", authorIdFromForm);

    // Pour le moment, utilisons l'ID du formulaire ou un utilisateur par défaut
    let userId = authorIdFromForm;
    
    // Si aucun ID n'est fourni, essayons le localStorage en backup
    if (!userId) {
        try {
            const userData = LocalStorageHelper.getValue("userLocal");
            console.log("Données brutes du localStorage 'userLocal':", userData);
            
            if (userData) {
                const parsedData = JSON.parse(userData);
                console.log("Données parsées du localStorage:", parsedData);
                const user = User.fromJSON(parsedData);
                console.log("Objet User créé:", user);
                userId = user.id;
                console.log("ID utilisateur depuis localStorage:", userId);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur:", error);
        }
    }

    // Vérifier qu'un utilisateur est trouvé
    if (!userId) {
        console.error("Aucun ID utilisateur trouvé");
        return {
            errors: { general: ["Impossible d'identifier l'utilisateur. Veuillez vous reconnecter."] },
        };
    }

    console.log("ID utilisateur final:", userId);
    
    const contenu = JSON.parse(formData.get('contenu')?.toString() ?? '{}');
    const file = formData.get('image') as File;

    let imagePath = "";
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
    // 
    // Validate form fields
    const validatedFields = AddArticleFormSchema.safeParse({
        titre: formData.get('titre'),
        contenu: contenu,
        image: imagePath,
        published: formData.get('published') === 'true',
        tags: {
            connect: formData.get('tags')
                ?.toString()
                .split(',')
                .filter(Boolean)
                .map((id) => ({ id: id.trim() })),
        },
        specialites: {
            connect: formData.get('specialites')
                ?.toString()
                .split(',')
                .filter(Boolean)
                .map((s) => ({ id: s.trim() })),
        },
        authorId: userId,
    });


    console.log("validatedFields data", validatedFields.data);
    console.log("validatedFields", validatedFields.error);

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    else {
        validatedFields.data.contenu = contenu;
        const temp = await HttpService.add<Article>({
            url: "/articles",
            data: validatedFields.data,
        }).then((res) => {
            console.log(res);
            return res;
        })
        return (temp as any).state;
    }
}