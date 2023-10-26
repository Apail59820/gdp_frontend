import { GdpFilesModel } from '../../models/GdPModels';
import { QueryParameters } from '../../models/DirectusModel';
import concatenateQueryParameters from '../../utils/queryParamsFormatter';
import { retrieveToken } from '../auth';
import getConfig from 'next/config';
import {isRequestSuccessful} from "../../utils/isRequestSuccessful";
import axios, {AxiosProgressEvent} from "axios";
import {message} from "antd";
import {Readable} from "stream";
import {fileToReadableStream} from "../../utils/fileToStream";

const { publicRuntimeConfig } = getConfig();

const defaultFields = ['*'].join(',');

/**
 * Retrieve gdp  files
 * @returns Promise containing the request status and the gdp file corresponding to the id
 * @param props queryParams
 */
export async function getGdpFiles(
  props: QueryParameters = {}
): Promise<{ status: number; data?: Partial<GdpFilesModel>[]; ok: boolean }> {
  if (!props.fields) props.fields = defaultFields;
  const token = await retrieveToken();
  if (!token) return Promise.resolve({ status: 401, ok: false });

  const myHeaders = new Headers({
    Authorization: `Bearer ${token}`,
  });

  const myInit: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
  };

  return fetch(
    `${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/files?${concatenateQueryParameters(props)}`,
    myInit
  ).then((res) => {
    if (res.status === 200) {
      return res.json().then((responseData) => {
        return { status: res.status, data: responseData.data, ok: res.ok };
      });
    } else {
      return { status: res.status, ok: res.ok };
    }
  });
}

/**
 * Retrieve a gdp file by id
 * @param id id of the gdp file
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the gdp file corresponding to the id
 */
export async function getGdpFile(
  id: string,
  fields = defaultFields
): Promise<{ status: number; data?: Partial<GdpFilesModel> }> {
  const token = await retrieveToken();
  if (!token) return Promise.resolve({ status: 401 });

  const myHeaders = new Headers({
    Authorization: `Bearer ${token}`,
  });

  const myInit: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
  };

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/files/${id}?fields=${fields}`, myInit).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        return { status: res.status, data: data.data };
      });
    } else {
      return { status: res.status };
    }
  });
}

/**
 * @description Download an asset/file from the server.
 *
 * @return an object with the request STATUS and the file url as DATA
 * @example
 * //this is how you can download the file
 * if (file.id) getAsset(file.id).then(res => {
 *   if (res.status === 200) {
 *     const w = window.open(res.data, '_blank');
 *     w && w.focus();
 *   }
 * })
 * @param id
 * @param param
 */
export async function downloadGdPFile(id: string, param?: string): Promise<{ status: number; data?: string }> {
  const token = await retrieveToken();
  if (!token) return Promise.resolve({ status: 401 });
  const myHeaders = new Headers({
    Authorization: `Bearer ${token}`,
  });

  const myInit: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
  };

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/assets/${id}${param ? '?' + param : ''}`, myInit)
    .then((res) => {
      if (res.status === 200 || res.status === 204)
        return res.blob().then((blob) => {
          return { status: res.status, data: URL.createObjectURL(blob) };
        });
      else return { status: res.status };
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      return { status: 500 };
    });
}

type createFieldsToOmit = 'id' | 'uploaded_by' | 'uploaded_on' | 'modified_by' | 'modified_on' | 'activities_id';

/**
 *
 * @param fileProperties
 * @param file the file data as string or blob
 *
 * @return an object with the request STATUS and the file DATA
 */
export async function uploadGdpFile(
  fileProperties: Partial<Omit<GdpFilesModel, createFieldsToOmit>>,
  file: string | Blob
): Promise<{ status: number; data?: Partial<GdpFilesModel> }> {
  function isValidKeyOfCreateAssetModel(value: string): value is keyof typeof fileProperties {
    return value in fileProperties;
  }

  const token = await retrieveToken();
  if (!token) return Promise.resolve({ status: 401 });
  const formData = new FormData();

  for (const prop in fileProperties) {
    if (isValidKeyOfCreateAssetModel(prop))
      formData.set(
        prop,
        typeof fileProperties[prop] === 'string'
          ? (fileProperties[prop] as string)
          : JSON.stringify(fileProperties[prop])
      );
  }
  formData.set('file', file);

  const myHeaders = new Headers({
    Authorization: `Bearer ${token}`,
  });

  const myInit: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
    body: formData,
  };

  const res = await fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/files`, myInit);
  if (!res || (res.status !== 200 && res.status !== 204)) return { status: 500 };
  try {
    const resData: { data: Partial<GdpFilesModel> } | undefined = await res.json();
    if (!resData) return { status: res.status };
    return { status: res.status, data: resData.data };
  } catch {
    return { status: res.status };
  }
}

async function uploadGdpFileViaSignedUrl(
    file: { properties: Partial<Omit<GdpFilesModel, createFieldsToOmit>>; data: Blob | string },
    url: string,
    onUploadProgress?: (progressEvent: ProgressEvent) => void
): Promise<{ status: number; data?: Partial<GdpFilesModel> }> {
  const token = await retrieveToken();
  if (!token) return Promise.resolve({ status: 401 });

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    //@ts-ignore
    xhr.setRequestHeader('Content-Type', file.data?.type);

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve({ status: 200 });
      } else {
        reject({ status: 500 });
      }
    };

    xhr.onerror = () => {
      reject({ status: 500 });
    };

    if (onUploadProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        onUploadProgress(e);
      });
    }

    xhr.send(file.data);
  });
}

/**
 * Upload With Progress
 * @param file Objet du fichier à uploader
 * @param onUploadProgress Fonction pour suivre la progression de l'upload
 */
export async function uploadGdpFileWithProgress(
    file: { properties: Partial<Omit<GdpFilesModel, createFieldsToOmit>>; data: Blob | string },
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<{ status: number; data?: Partial<GdpFilesModel>[] | Partial<GdpFilesModel> }> {

  const token = await retrieveToken();
  if (!token) return Promise.resolve({ status: 401 });

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      //@ts-ignore
      "Content-Type": file.data?.type
    },
  };


  const axiosInstance = axios.create(axiosConfig);

  const formData = new FormData();

  for(const prop in file.properties) {
      formData.append(
          prop,
          typeof file.properties[prop as keyof typeof file.properties] === 'string'
              ? (file.properties[prop as keyof typeof file.properties] as string)
              : JSON.stringify(file.properties[prop as keyof typeof file.properties])
      );
  }

  formData.append('file', file.data);

  let exceptSignedUrl = ((file.properties.filesize / (1024 * 1024)) > 32);

  let fetchUrl = publicRuntimeConfig.GESTION_DE_PROJET_API_URL + ((exceptSignedUrl) ? '/signed-url/write' : '/files');

  return await axiosInstance.post(fetchUrl, formData).then(async(res) => {

    if(isRequestSuccessful(res.status)){
      if(exceptSignedUrl)
      {
        const signed_url = res.data?.url;
        if(signed_url){
          const response = await uploadGdpFileViaSignedUrl(file, signed_url, onUploadProgress as any);
          if(isRequestSuccessful(response.status)){
            return {status : response.status};
          }
        }
      }
    }
    return {status : 500};
  });

}

/**
 *
 * @param files the files data
 * @param setUploading
 * @return an object with the request STATUS and the file DATA
 */
export async function uploadGpdFiles(
  files: { properties: Omit<GdpFilesModel, createFieldsToOmit>; data: Blob | string }[],
  setUploading?: (value: React.SetStateAction<boolean>) => void
): Promise<{ status: number; data?: Partial<GdpFilesModel>[] }> {
  if (setUploading) setUploading(true);

  const token = await retrieveToken();
  if (!token) return Promise.resolve({ status: 401 });
  const formData = new FormData();

  for (const file of files) {
    for (const prop in file.properties) {
      formData.append(
        prop,
        typeof file.properties[prop as keyof typeof file.properties] === 'string'
          ? (file.properties[prop as keyof typeof file.properties] as string)
          : JSON.stringify(file.properties[prop as keyof typeof file.properties])
      );
    }
    formData.append('file', file.data);
  }

  const myHeaders = new Headers({
    Authorization: `Bearer ${token}`,
  });

  const myInit: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
    body: formData,
  };

  const res = await fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/files`, myInit);

  if (!res || (res.status !== 200 && res.status !== 204)) return { status: 500 };
  try {
    const resData: { data: Partial<GdpFilesModel>[] } | undefined = await res.json();
    if (!resData) return { status: res.status };
    return { status: res.status, data: resData.data };
  } catch {
    return { status: res.status };
  }
}

type updateFieldsToOmit = 'id' | 'uploaded_by' | 'uploaded_on' | 'modified_by' | 'modified_on' | 'activities_id';

/**
 * Update gdp file properties.
 * @param id gdp file ID.
 * @param data Properties to update.
 * @returns Status and updated gdp file properties.
 */
export async function updateGdpFile(
  id: string,
  data: Partial<Omit<GdpFilesModel, updateFieldsToOmit>>
): Promise<{ status: number; data?: Partial<GdpFilesModel>; error?: string }> {
  const token = await retrieveToken();
  if (!token) return Promise.resolve({ status: 401 });
  const myHeaders = new Headers({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  const myInit: RequestInit = {
    method: 'PATCH',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(data),
  };

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/files/${id}`, myInit)
    .then((response) => {
      if (response.status === 200) {
        return response
          .json()
          .then((responseData: { data: Partial<GdpFilesModel> }) => {
            return { status: response.status, data: responseData.data };
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            return { status: response.status };
          });
      } else {
        return response
          .json()
          .then((responseData) => {
            return { status: response.status, error: responseData.errors[0].message };
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            return { status: response.status };
          });
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      return { status: 500 };
    });
}

export async function deleteGdpFile(id: string): Promise<{ status: number }> {
  const token = await retrieveToken();
  if (!token) return Promise.resolve({ status: 401 });
  const myHeaders = new Headers({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  const myInit: RequestInit = {
    method: 'DELETE',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
  };

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/files/${id}`, myInit)
      .then((response) => {
        return { status: response.status };
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        return { status: 500 };
      });
}

