import { baseApiURL } from '@/constant/api';
import { FormState, AddArticleFormSchema, } from '@/lib/definitions'
import { Article } from '@/models/article'
import { User } from '@/models/user';
import { HttpService } from '@/utils/http.services'
import { LocalStorageHelper } from '@/utils/localStorage.helper';
// import { mkdir, writeFile } from 'fs/promises';
// import path from 'path';

export async function addArticle(state: FormState, formData: FormData) {
    const user = User.fromJSON(JSON.parse(LocalStorageHelper.getValue("user")) ?? {});
    const contenu = JSON.parse(formData.get('contenu')?.toString() ?? '{}');
    const file = formData.get('image') as File;

    let imagePath = "";
    // Upload image
    const formDataImage = new FormData();
    formDataImage.append('image', file);

    const res = await fetch(baseApiURL + '/upload', {
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
        authorId: user.id,
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