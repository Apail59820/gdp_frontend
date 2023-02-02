import { GdpAffairModel, CreateAffairModel, UpdateAffairModel } from '../models/GestionDeProjets/GdpAffairModel';
import { QueryParameters } from '../models/DirectusModel';
import concatenateQueryParameters from '../utils/queryParamsFormatter';
import { retrieveToken } from './auth';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

// const defaultFields = ['*', 'user_access.*', 'affairs_satisfaction.*', 'pythagore_ids.*'].join(',');
const defaultFields = ['*'].join(',');
/**
 * Retrieve affairs respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns List all items that exist in affairs.
 */
export async function getAffairs(props: QueryParameters = {}): Promise<{ status: number; data?: GdpAffairModel[] }> {
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

  return (
    fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/affairs?${concatenateQueryParameters(props)}`, myInit)
      // return fetch(`  ${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/${concatenateQueryParameters(props)}`, myInit)
      .then((res) => {
        if (res.status == 200)
          return res.json().then((data) => {
            return { status: res.status, data: data.data };
          });
        else return { status: res.status };
      })
      .catch(() => {
        return { status: 500 };
      })
  );
}

/**
 * Retrieve an Affair by id
 * @param id id of the affair
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the affair corresponding to the id
 */
export async function getAffair(id: number, fields = defaultFields): Promise<{ status: number; data?: GdpAffairModel }> {
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

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/affairs/${id}?fields=${fields}`, myInit).then((res) => {
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
 * Create an affair.
 * @param affair Object containing affair properties.
 * @returns Status and data containing affair properties.
 */
export async function createAffair(affair: CreateAffairModel): Promise<{ status: number; data?: GdpAffairModel }> {
  const token = await retrieveToken();
  if (!token) return Promise.resolve({ status: 401 });
  const myHeaders = new Headers({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  const myInit: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(affair),
  };

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/affairs`, myInit)
    .then((response) => {
      if (response.status === 200 || response.status === 204) {
        return response
          .json()
          .then((responseData) => {
            return { status: response.status, data: responseData.data };
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            return { status: response.status };
          });
      } else {
        return { status: response.status };
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      return { status: 500 };
    });
}

/**
 * Update affair properties.
 * @param id Affair ID.
 * @param data Properties to update.
 * @returns Status and updated affair properties.
 */
export async function updateAffair(
  id: string,
  data: UpdateAffairModel
): Promise<{ status: number; data?: GdpAffairModel; error?: string }> {
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

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/affairs/${id}`, myInit)
    .then((response) => {
      if (response.status === 200) {
        return response
          .json()
          .then((responseData: { data: GdpAffairModel }) => {
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

/**
 * Delete one or more affairs.
 * @param affairsArray Array of one or more affairs identifiers in the form of a number.
 * @returns Status.
 */
export async function deleteAffairs(affairsArray: Array<number>): Promise<{ status: number }> {
  const token = await retrieveToken();
  if (!token) return Promise.resolve({ status: 401 });
  const myHeaders = new Headers({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  const myInit: RequestInit = {
    method: 'DELETE',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(affairsArray),
  };

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/affairs`, myInit)
    .then((response) => {
      return { status: response.status };
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      return { status: 500 };
    });
}
