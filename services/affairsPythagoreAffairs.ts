import { QueryParameters } from '../models/DirectusModel';
import concatenateQueryParameters from '../utils/queryParamsFormatter';
import { retrieveToken } from './auth';
import getConfig from 'next/config';
import { GdpAffairsPythagoreAffairesModel } from '../models/GdPModels';

const { publicRuntimeConfig } = getConfig();

const defaultFields = ['*', 'pythagore_affaires_id.*', 'affairs_id.*', 'activities_id.*'].join(',');

/**
 * Retrieve affairs pythagore affairs respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns List all items that exist in affairs pythagore affairs.
 */
export async function getAffairsPythagoreAffairs(
  props: QueryParameters = {}
): Promise<{ status: number; data?: Partial<GdpAffairsPythagoreAffairesModel>[] }> {
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

  return fetch(
    `${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/affairs_pythagore_affaires?${concatenateQueryParameters(
      props
    )}`,
    myInit
  )
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
 * Retrieve a affair pythagore affair by id
 * @param id id of the affair pythagore affair
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the affair pythagore affair corresponding to the id
 */
export async function getAffairPythagoreAffair(
  id: number,
  fields = defaultFields
): Promise<{ status: number; data?: GdpAffairsPythagoreAffairesModel }> {
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

  return fetch(
    `${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/affairs_pythagore_affaires/${id}?fields=${fields}`,
    myInit
  ).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        return { status: res.status, data: data.data };
      });
    } else {
      return { status: res.status };
    }
  });
}
type createFieldsToOmit = 'id' | 'activities_id';

/**
 * Create an affair pythagore affair.
 * @param project Object containing affair pythagore affair properties.
 * @returns Status and data containing affair pythagore affair properties.
 */
export async function createAffairPythagoreAffair(
  project: Partial<Omit<GdpAffairsPythagoreAffairesModel, createFieldsToOmit>>
): Promise<{ status: number; data?: Partial<GdpAffairsPythagoreAffairesModel> }> {
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
    body: JSON.stringify(project),
  };

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/affairs_pythagore_affaires`, myInit)
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
 * Delete one or more projects.
 * @param affairsPythagoreAffairsArray Array of one or more projects identifiers in the form of a number.
 * @returns Status.
 */
export async function deleteAffairPythagoreAffair(
  affairsPythagoreAffairsArray: Array<number>
): Promise<{ status: number }> {
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
    body: JSON.stringify(affairsPythagoreAffairsArray),
  };

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/affairs_pythagore_affaires`, myInit)
    .then((response) => {
      return { status: response.status };
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      return { status: 500 };
    });
}
