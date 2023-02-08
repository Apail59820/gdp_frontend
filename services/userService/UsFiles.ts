import { UsFilesModel } from '../../models/UsModels';
import { QueryParameters } from '../../models/DirectusModel';
import concatenateQueryParameters from '../../utils/queryParamsFormatter';
import { retrieveToken } from '../auth';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const defaultFields = ['*'].join(',');

/**
 * Retrieve files respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns List all items that exist in files.
 */
export async function getUsFiles(
  props: QueryParameters = {}
): Promise<{ status: number; data?: Partial<UsFilesModel>[] }> {
  if (!props.fields) props.fields = defaultFields;
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

  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/files?${concatenateQueryParameters(props)}`, myInit)
    .then((res) => {
      if (res.status == 200)
        return res.json().then((data) => {
          return { status: res.status, data: data.data };
        });
      else return { status: res.status };
    })
    .catch(() => {
      return { status: 500 };
    });
}

/**
 * Retrieve a file by id from userService
 * @param id id of the file
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the us file corresponding to the id
 */
export async function getUsFile(
  id: number,
  fields = defaultFields
): Promise<{ status: number; data?: Partial<UsFilesModel> }> {
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

  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/files/${id}?fields=${fields}`, myInit).then((res) => {
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
export async function downloadUsPFile(id: string, param?: string): Promise<{ status: number; data?: string }> {
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

  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/assets/${id}${param ? '?' + param : ''}`, myInit)
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
export async function uploadUsFile(
  fileProperties: Omit<UsFilesModel, createFieldsToOmit>,
  file: string | Blob
): Promise<{ status: number; data?: Partial<UsFilesModel> }> {
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

  const res = await fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/files`, myInit);
  if (!res || (res.status !== 200 && res.status !== 204)) return { status: 500 };
  try {
    const resData: { data: Partial<UsFilesModel> } | undefined = await res.json();
    if (!resData) return { status: res.status };
    return { status: res.status, data: resData.data };
  } catch {
    return { status: res.status };
  }
}

/**
 *
 * @param files the files data
 * @param setUploading
 * @return an object with the request STATUS and the file DATA
 */
export async function uploadUsFiles(
  files: { properties: Omit<UsFilesModel, createFieldsToOmit>; data: Blob | string }[],
  setUploading?: (value: React.SetStateAction<boolean>) => void
): Promise<{ status: number; data?: Partial<UsFilesModel>[] }> {
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

  const res = await fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/files`, myInit);

  if (!res || (res.status !== 200 && res.status !== 204)) return { status: 500 };
  try {
    const resData: { data: Partial<UsFilesModel>[] } | undefined = await res.json();
    if (!resData) return { status: res.status };
    return { status: res.status, data: resData.data };
  } catch {
    return { status: res.status };
  }
}

type updateFieldsToOmit = 'id' | 'uploaded_by' | 'uploaded_on' | 'modified_by' | 'modified_on' | 'activities_id';

/**
 * Update us file properties.
 * @param id us file ID.
 * @param data Properties to update.
 * @returns Status and updated us file properties.
 */
export async function updateUsFile(
  id: string,
  data: Partial<Omit<UsFilesModel, updateFieldsToOmit>>
): Promise<{ status: number; data?: Partial<UsFilesModel>; error?: string }> {
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

  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/files/${id}`, myInit)
    .then((response) => {
      if (response.status === 200) {
        return response
          .json()
          .then((responseData: { data: Partial<UsFilesModel> }) => {
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
