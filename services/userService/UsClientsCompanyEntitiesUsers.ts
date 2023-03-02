import { UsClientsCompanyEntitiesUsersModel } from '../../models/UsModels';
import { QueryParameters } from '../../models/DirectusModel';
import concatenateQueryParameters from '../../utils/queryParamsFormatter';
import { retrieveToken } from '../auth';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const defaultFields = ['*'].join(',');

/**
 * Retrieve clients company entities users respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns List all items that exist in clients company entities users.
 */
export async function getUsClientsCompanyEntitiesUsers(
  props: QueryParameters = {}
): Promise<{ status: number; data?: Partial<UsClientsCompanyEntitiesUsersModel>[] }> {
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
    `${
      publicRuntimeConfig.USER_SERVICE_API_URL
    }/items/clients_company_entities_directus_users?${concatenateQueryParameters(props)}`,
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
 * Retrieve a client company entity user by id
 * @param id id of the client company entity user
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the client company entity user corresponding to the id
 */
export async function getUsClientCompanyEntityUser(
  id: number,
  fields = defaultFields
): Promise<{ status: number; data?: Partial<UsClientsCompanyEntitiesUsersModel> }> {
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
    `${publicRuntimeConfig.USER_SERVICE_API_URL}/items/clients_company_entities_directus_users/${id}?fields=${fields}`,
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

type createFieldsToOmit = 'id' | 'user_created' | 'user_updated' | 'date_created' | 'date_updated' | 'activities_id';
/**
 * Create a client company entity user.
 * @param clientCompanyEntityUser Object containing client company entity user properties.
 * @returns Status and data containing client company entity user properties.
 */
export async function createUsClientCompanyEntityUser(
  clientCompanyEntityUser: Omit<UsClientsCompanyEntitiesUsersModel, createFieldsToOmit>
): Promise<{ status: number; data?: Partial<UsClientsCompanyEntitiesUsersModel> }> {
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
    body: JSON.stringify(clientCompanyEntityUser),
  };

  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/items/clients_company_entities_directus_users`, myInit)
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

type updateFieldsToOmit =
  | 'id'
  | 'user_created'
  | 'user_updated'
  | 'date_created'
  | 'date_updated'
  | 'clients_company_entities_id'
  | 'directus_users_id'
  | 'activities_id';
/**
 * Update client company entity user properties.
 * @param id Affclient company entity user ID.
 * @param data Properties to update.
 * @returns Status and updated client company entity user properties.
 */
export async function updateUsClientCompanyEntityUser(
  id: string,
  data: Partial<Omit<UsClientsCompanyEntitiesUsersModel, updateFieldsToOmit>>
): Promise<{ status: number; data?: Partial<UsClientsCompanyEntitiesUsersModel>; error?: string }> {
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

  return fetch(
    `${publicRuntimeConfig.USER_SERVICE_API_URL}/items/clients_company_entities_directus_users/${id}`,
    myInit
  )
    .then((response) => {
      if (response.status === 200) {
        return response
          .json()
          .then((responseData: { data: UsClientsCompanyEntitiesUsersModel }) => {
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
