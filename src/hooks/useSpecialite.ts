import { baseApiURL } from "@/constant/api";
import { LocalStorageHelper } from "@/utils/localStorage.helper";
import {
  successToastClassName,
  errorToastClassName
} from "@/utils/toast.helper";
import axios from "axios";
import { toast } from "sonner";

export async function useAddSpecialite({
  libelle
}: {
  libelle: string;
}): Promise<any> {
  try {
    const response = await axios.post(`${baseApiURL}/specialites`, {
      libelle
    });
    if (response.status === 200 || response.status === 201) {
      toast.success(response.data.message, {
        className: successToastClassName,
        duration: 3000
      });
      return true;
    } else {
      toast.error(response.data.message, {
        className: errorToastClassName,
        duration: 5000
      });
      return false;
    }
  } catch (error: any) {
    toast.error("Une erreur est survenue", {
      className: errorToastClassName,
      description: error.message,
      duration: 5000
    });
    console.log(error);
    return false;
  }
}
