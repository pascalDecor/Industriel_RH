import { baseApiURL } from "@/constant/api";
import { successToastClassName, errorToastClassName } from "@/utils/toast.helper";
import axios from "axios";
import { toast } from "sonner";



export async function useLogin({email, password} : {email:string,password : string}) : Promise<any> {
    try {
        const response = await axios.post(`${baseApiURL}/auth/login`, { email, password });
        if (response.status === 200 || response.status === 201) {
            toast.success(response.data.message, {
                className: successToastClassName,
                duration: 3000,
            }); 
            return true;
        }
        else {
            toast.error(response.data.message, {
                className: errorToastClassName,
                duration: 5000,
            });
            return false;
        }
    } catch (error: any) {
        toast.error('Une erreur est survenue', {
            className: errorToastClassName,
            description: error.message,
            duration: 5000,
        });
        console.log(error);
        return false;
    }
}

export async function useLoginOTP({email, otp} : {email:string,otp : string}) : Promise<any> {
    try {
        const response = await axios.post(`${baseApiURL}/auth/login/complete`, { email, otp });
        if (response.status === 200 || response.status === 201) {
            toast.success(response.data.message, {
                className: successToastClassName,
                duration: 3000,
            }); 
            return true;
        }
        else {
            toast.error(response.data.message, {
                className: errorToastClassName,
                duration: 5000,
            });
            return false;
        }
    } catch (error: any) {
        toast.error('Une erreur est survenue', {
            className: errorToastClassName,
            description: error.message,
            duration: 5000,
        });
        console.log(error);
        return false;
    }
}

export async function useLogout() : Promise<any> {
    try {
        const response = await axios.post(`${baseApiURL}/auth/logout`);
        if (response.status === 200 || response.status === 201) {
            toast.success(response.data.message, {
                className: successToastClassName,
                duration: 3000,
            }); 
            return true;
        }
        toast.error(response.data.message, {
            className: errorToastClassName,
            duration: 5000,
        });
    } catch (error: any) {
        toast.error('Une erreur est survenue', {
            className: errorToastClassName,
            description: error.message,
            duration: 5000,
        });
        console.log(error);
    }
    return false;
}


