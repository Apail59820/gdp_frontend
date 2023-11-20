import { QueryParameters } from '../../models/DirectusModel';
import concatenateQueryParameters from '../../utils/queryParamsFormatter';
import { retrieveToken } from '../auth';
import getConfig from 'next/config';
import { UsUserModel } from '../../models/UsModels';

const { publicRuntimeConfig } = getConfig();

const defaultFields = [
  'id',
  'email',
  'first_name',
  'last_name',
  'description',
  'number',
  'status',
  'company',
  'web_link',
  'role',
  'avatar',
  'clients_interactions_id.*', //todo a détailler ?
  'company_entities.*', //todo a détailler ?
].join(',');

/**
 * Retrieve users respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns List all items that exist in users.
 */
export async function getUsUsers(
  props: QueryParameters = {}
): Promise<{ status: number; data?: Partial<UsUserModel>[] }> {
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

  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/users?${concatenateQueryParameters(props)}`, myInit)
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
 * Retrieve a user by id
 * @param id of the user
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the user corresponding to the id
 */
export async function getUsUser(
  id: string,
  fields = defaultFields
): Promise<{ status: number; data?: Partial<UsUserModel> }> {
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

  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/users/${id}?fields=${fields}`, myInit).then((res) => {
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
 * Retrieve the profile of the connected user
 * @return a Promise with the request status and the user data in case of success
 */
export async function getMyUsProfile(
  fields = defaultFields
): Promise<{ status: number; data?: Partial<UsUserModel> | undefined }> {
  return getUsUser('me', fields);
}

type updateFieldsToOmit =
  | 'id'
  | 'email'
  | 'status'
  | 'role'
  | 'last_page'
  | 'last_access'
  | 'provider'
  | 'external_identifier'
  | 'user_created'
  | 'user_updated'
  | 'date_created'
  | 'date_updated'
  | 'activities_id'
  | 'clients_interactions_id'
  | 'clients_company_entities'
  | 'company_entities';

/**
 * Update item.
 * @param payload Object with ids of targets and data to update.
 * @returns Status and updated user access properties.
 */
export async function updateUsUsers(payload: {
  keys: string[];
  data: Partial<Omit<UsUserModel, updateFieldsToOmit>>;
}): Promise<{ status: number; data?: Partial<UsUserModel> }> {
  if (!payload.keys) return Promise.resolve({ status: 400 });
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

  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/users`, myInit)
    .then((response) => {
      if (response.status === 200) {
        return response
          .json()
          .then((responseData: { data: Partial<UsUserModel> }) => {
            return { status: response.status, data: responseData.data };
          })
          .catch(() => {
            return { status: response.status };
          });
      } else {
        return { status: response.status };
      }
    })
    .catch(() => {
      return { status: 500 };
    });
}

/**
 * @param key of the user to update
 * @param data properties to update
 * @return a Promise with the request status and the user data in case of success
 */
export async function updateUsUser(
  key: string,
  data: Partial<Omit<UsUserModel, updateFieldsToOmit>>
): Promise<{ status: number; data?: Partial<UsUserModel> }> {
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

  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/users/${key}`, myInit)
    .then((response) => {
      if (response.status === 200) {
        return response
          .json()
          .then((responseData: { data: Partial<UsUserModel> }) => {
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

export async function updateMyUsProfile(
  data: Partial<Omit<UsUserModel, updateFieldsToOmit>>
): Promise<{ status: number; data?: Partial<UsUserModel> }> {
  return updateUsUser('me', data);
}
