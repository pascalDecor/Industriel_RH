import { HttpService } from "@/utils/http.services";
import { Specialite } from "@prisma/client";
import { z } from "zod";

// Definitions

export type FormState =
    | {
        errors?: {
            otp?: string[];
        };
        message?: string;
    }
    | undefined;

export const FormSchema = z.object({
    libelle: z
        .string()
        .min(2, { message: "Libelle must be at least 2 characters long" })
        .trim(),
    id: z.string()
});

export async function addSpecialite(state: FormState, formData: FormData) {
    const validatedFields = FormSchema.safeParse({
        libelle: formData.get('libelle'),
        id: formData.get('id')
    })
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    else {
        console.log("validatedFields.data", validatedFields.data);
        const payload = {
            url: `/specialites/${validatedFields.data.id}`,
            data: validatedFields.data,
        };
        console.log("payload", payload);
        const temp = await (
            validatedFields.data.id.length < 1 ?
                HttpService.add<Specialite>(payload) :
                HttpService.update<Specialite>(payload)).then((res) => {
                    console.log(res);
                    return res;
                })
        return (temp as any).state;
    }
}