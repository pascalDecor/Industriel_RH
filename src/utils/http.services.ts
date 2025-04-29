/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";
import { baseApiURL } from "../constant/api";
import { errorToastClassName, successToastClassName } from "./toast.helper";
import { getApiConfig } from "./apiConfig";

type AddOrupdateReturnType<T> = {
  state: boolean;
  response: AxiosResponse;
  convertData: T;
};

type DeleteReturnType<T> = {
  state: boolean;
  response: AxiosResponse;
  convertData: T;
};

export class HttpService {
  static async index<T>({
    url,
    fromJson
  }: {
    url: string;
    fromJson: (json: any) => T;
  }): Promise<T[]> {
    try {
      const response = await axios.get<T[]>(`${baseApiURL}${url}`);
      if (response.status === 200 || response.status === 201) {
        return response.data.map((dataItem: any) => fromJson(dataItem ?? {}));
      } else {
        throw new Error("Erreur lors de la récupération des données");
      }
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }

  static async add<T>({
    url,
    fromJson,
    data
  }: {
    url: string;
    fromJson?: (json: any) => T;
    data: any;
  }): Promise<Partial<AddOrupdateReturnType<T>>> {
    try {
      const response = await axios.post(`${baseApiURL}${url}`, data);
      if (response.status === 200 || response.status === 201) {
        toast.success("Ajout effectué avec succès", {
          className: successToastClassName,
          duration: 3000
        });
        if (fromJson) {
          const convertedData = fromJson(response.data);
          return { state: true, convertData: convertedData };
        } else {
          return { state: true, response: response };
        }
      } else {
        throw new Error("Erreur lors de l'ajout");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout", {
        className: errorToastClassName,
        description: error.message,
        duration: 5000
      });
      return { state: false };
    }
  }

  static async update<T>({
    url,
    fromJson,
    data
  }: {
    url: string;
    fromJson?: (json: any) => T;
    data: any;
  }): Promise<Partial<AddOrupdateReturnType<T>>> {
    try {
      const response = await axios.put(baseApiURL + url, data);
      if (response.status === 200 || response.status === 201) {
        toast.success("Modification effectué avec succès", {
          className: successToastClassName,
          duration: 3000
        });
        if (fromJson) {
          const convertedData = fromJson(response.data);
          return { state: true, convertData: convertedData };
        } else {
          return { state: true, response: response };
        }
      } else {
        throw new Error("Erreur lors de l'ajout");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Une erreur est survenue lors de la modification", {
        className: errorToastClassName,
        description: error.message,
        duration: 5000
      });
      return { state: false };
    }
  }

  static async delete<T>({
    url,
    fromJson,
    data
  }: {
    url: string;
    fromJson?: (json: any) => T;
    data: any;
  }): Promise<Partial<DeleteReturnType<T>>> {
    try {
      const response = await axios.delete(`${baseApiURL}${url}`, data);
      if (response.status === 200 || response.status === 201) {
        toast.success("Suppression effectué avec succès", {
          className: successToastClassName,
          duration: 3000
        });
        if (fromJson) {
          const convertedData = fromJson(response.data);
          return { state: true, convertData: convertedData };
        } else {
          return { state: true, response: response };
        }
      } else {
        throw new Error("Erreur lors de la suppression");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Une erreur est survenue lors de la suppression", {
        className: errorToastClassName,
        description: error.message,
        duration: 5000
      });
      return { state: false };
    }
  }

  static _getJsonHierachieValueWithJsonHierarchieKeys(
    response: AxiosResponse,
    jsonKeyHierachie: string[]
  ): any {
    let temp = response.data;

    if (jsonKeyHierachie.length > 0) {
      for (const element of jsonKeyHierachie) {
        const jsonKeyHierachieItem = element;
        const oldTemp = temp;
        temp = oldTemp[jsonKeyHierachieItem];
      }
    }
    return temp;
  }
}
