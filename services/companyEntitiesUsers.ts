import { QueryParameters } from '../models/DirectusModel';
import concatenateQueryParameters from '../utils/queryParamsFormatter';
import { retrieveToken } from './auth';
import getConfig from 'next/config';
import { UsCompanyEntitiesUsersModel } from '../models/UserService/UsCompanyEntitiesUsersModel';
import { GdpAffairsUsersModel } from '../models/GestionDeProjets/GdpAffairsUsersModel';

const { publicRuntimeConfig } = getConfig();

const defaultFields = ['*'].join(',');

/**
 * Retrieve company entities directus users respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns List all items that exist in company entities directus users.
 */
export async function getCompanyEntitiesUsers(
  props: QueryParameters = {}
): Promise<{ status: number; data?: Partial<UsCompanyEntitiesUsersModel>[] }> {
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
    `${publicRuntimeConfig.USER_SERVICE_API_URL}/items/company_entities_directus_users?${concatenateQueryParameters(
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
 * Retrieve a company entities directus users by id
 * @param id id of the company entities directus users
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the company entities directus users corresponding to the id
 */
export async function getCompanyEntityUser(
  id: number,
  fields = defaultFields
): Promise<{ status: number; data?: Partial<UsCompanyEntitiesUsersModel> }> {
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
    `${publicRuntimeConfig.USER_SERVICE_API_URL}/items/company_entities_directus_users/${id}?fields=${fields}`,
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

type createFieldsToOmit = 'id' | 'show_notifications' | 'activities_id';
/**
 * Create a new item.
 * @returns Status and data containing affair properties.
 * @param affairUsers
 */
export async function createAffairUsers(
  affairUsers: Partial<Omit<GdpAffairsUsersModel, createFieldsToOmit>>[]
): Promise<{ status: number; data?: Partial<GdpAffairsUsersModel>[] }> {
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
    body: JSON.stringify(affairUsers),
  };

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/affairs_directus_users`, myInit)
    .then((response) => {
      if (response.status === 200) {
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

type updateFieldsToOmit = 'id' | 'affairs_id' | 'directus_users_id' | 'activities_id';
/**
 * Update item.
 * @param payload Object with ids of targets and data to update.
 * @returns Status and updated affair user access properties.
 */
export async function updateAffairUsers(payload: {
  keys: number[];
  query?: QueryParameters;
  data: Partial<GdpAffairsUsersModel>;
}): Promise<{ status: number; data?: Partial<Omit<GdpAffairsUsersModel, updateFieldsToOmit>> }> {
  if (!payload.query && !payload.keys) return Promise.resolve({ status: 400 });
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
    body: JSON.stringify(payload),
  };

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/affairs_directus_users`, myInit)
    .then((response) => {
      if (response.status === 200) {
        return response
          .json()
          .then((responseData: { data: Partial<GdpAffairsUsersModel> }) => {
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
 * Delete one or more affairs user access.
 * @param affairsUsers Array of one or more affairs user access identifiers in the form of a number.
 * @returns Status.
 */
export async function deleteAffairUsers(affairsUsers: Array<number>): Promise<{ status: number }> {
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
    body: JSON.stringify(affairsUsers),
  };

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/affairs_directus_users`, myInit)
    .then((response) => {
      return { status: response.status };
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      return { status: 500 };
    });
}
