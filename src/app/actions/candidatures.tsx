import { baseApiURL } from '@/constant/api';
import { FormStateAddApplication, AddApplicationFormSchema, } from '@/lib/definitions'
import { Application } from '@/models/application';
import { HttpService } from '@/utils/http.services'


export async function addCandidature(state: FormStateAddApplication, formData: FormData) {
    const fileCv = formData.get('cv') as File;
    const fileLetter = formData.get('coverLetter') as File;

    let imageCvPath = "";
    let imageLetterPath = "";
    // Upload cv
    const formDataImage = new FormData();
    formDataImage.append('image', fileCv);

    const res = await fetch(baseApiURL + '/upload', {
        method: 'POST',
        body: formDataImage,
    });
    const result = await res.json();
    imageCvPath = result.file.url;
    console.log("imagePath", imageCvPath);
    // 
    // Upload letter
    const formDataLetter = new FormData();
    formDataLetter.append('image', fileLetter);

    const resLetter = await fetch(baseApiURL + '/upload', {
        method: 'POST',
        body: formDataLetter,
    });
    const resultLetter = await resLetter.json();
    imageLetterPath = resultLetter.file.url;
    console.log("imagePath", imageLetterPath);
    //
    // Validate form fields
    const validatedFields = AddApplicationFormSchema.safeParse({
        lastName: formData.get('name'),
        firstName: formData.get('firstName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        adresse: formData.get('adresse'),
        year_of_experience: parseInt((formData.get('year_of_experience') as string) ?? "0"),
        cv: imageCvPath,
        coverLetter: imageLetterPath,
        state: formData.get('state') ?? "pending",
        sectorId: formData.get('sector'),
        functionId: formData.get('function'),
        civilityId: formData.get('civility'),
        cityId: formData.get('city'),
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
        const temp = await HttpService.add<Application>({
            url: "/applications",
            data: validatedFields.data,
        }).then((res) => {
            console.log(res);
            return res;
        })
        return (temp as any).state;
    }
}