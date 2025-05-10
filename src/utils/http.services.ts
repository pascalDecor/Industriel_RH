/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { baseApiURL } from "../constant/api";
import { errorToastClassName, successToastClassName } from "./toast.helper";

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

type ShowReturnType<T> = {
  state: boolean;
  response: AxiosResponse;
  data: T;
};

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginatedMeta;
}

type Path = string | Array<string | number>;

/**
 * Récupère un champ profondément imbriqué dans un objet
 * via un chemin du type ['rows', 'data'] ou 'data'.
 */
function getDeep(obj: any, path: Path): any {
  if (!path) return undefined;
  const parts = Array.isArray(path) ? path : [path];
  return parts.reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
}

export class HttpService {
  /**
   * @param url        Endpoint relatif (sans baseApiURL ni query string)
   * @param fromJson   Mapper JSON→T
   * @param params     Query-params envoyés (page, limit, search…)
   * @param axiosConfig  Options axios supplémentaires
   * @param dataPath   Chemin vers le tableau de données dans response.data
   *                   ex. ['rows','data'] ou 'items'; défaut: 'data'
   * @param metaPath   Chemin vers l’objet meta dans response.data
   *                   ex. ['rows','meta'] ou 'pagination'; défaut: 'meta'
   */
  static async index<T>({
    url,
    fromJson,
    params,
    axiosConfig,
    dataPath = "data",
    metaPath = "meta"
  }: {
    url: string;
    fromJson: (json: any) => T;
    params?: Record<string, string | number | boolean>;
    axiosConfig?: AxiosRequestConfig;
    dataPath?: Path;
    metaPath?: Path;
  }): Promise<PaginatedResult<T>> {
    try {
      const response: AxiosResponse = await axios.get(`${baseApiURL}${url}`, {
        params,
        ...axiosConfig
      });

      const payload = response.data;
      // tableau brut
      const rawData = getDeep(payload, dataPath) as any[] | undefined;
      // objet meta brut
      const rawMeta = getDeep(payload, metaPath) as any;

      // si on n’a pas trouvé rawData ou rawMeta, on lève
      if (!Array.isArray(rawData) || typeof rawMeta !== "object") {
        throw new Error(
          `Structure de réponse inattendue. ` +
            `Vérifiez dataPath="${dataPath}" et metaPath="${metaPath}".`
        );
      }

      // mapping et validation
      const data = rawData.map((item) => fromJson(item));
      const meta: PaginatedMeta = {
        total: Number(rawMeta.total) || 0,
        page: Number(rawMeta.page) || 1,
        limit: Number(rawMeta.limit) || data.length,
        totalPages: Number(rawMeta.totalPages) || 1
      };

      return { data, meta };
    } catch (error: any) {
      console.error(error);
      return {
        data: [],
        meta: { total: 0, page: 1, limit: 0, totalPages: 0 }
      };
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
    data?: any;
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

  static async show<T>({
    url,
    fromJson,
    data
  }: {
    url: string;
    fromJson: (json: any) => T;
    data?: any;
  }): Promise<Partial<ShowReturnType<T>>> {
    try {
      const response = await axios.get(`${baseApiURL}${url}`, data);
      if (response.status === 200 || response.status === 201) {
        const convertedData = fromJson(response.data);
        return { state: true, data: convertedData };
      } else {
        throw new Error("Erreur lors de la suppression");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        "Une erreur est survenue lors de la récupération de l'élément",
        {
          className: errorToastClassName,
          description: error.message,
          duration: 5000
        }
      );
      return { state: false };
    }
  }
}
