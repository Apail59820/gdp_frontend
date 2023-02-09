import { QueryParameters } from '../../models/DirectusModel';
import concatenateQueryParameters from '../../utils/queryParamsFormatter';
import { retrieveToken } from '../auth';
import getConfig from 'next/config';
import { GdpProjectsClientsModel } from '../../models/GdPModels';

const { publicRuntimeConfig } = getConfig();

const defaultFields = ['*'].join(',');

/**
 * Retrieve gdp projects directus users clients respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns List all items that exist in affairs.
 */
export async function getGdpProjectsUsersClients(
  props: QueryParameters = {}
): Promise<{ status: number; data?: Partial<GdpProjectsClientsModel>[] }> {
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
      publicRuntimeConfig.GESTION_DE_PROJET_API_URL
    }/items/projects_directus_users_clients?${concatenateQueryParameters(props)}`,
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
 * Retrieve a gdp project_directus_user_client by id
 * @param id id of the gdp project_directus_user_client
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the gdp project_directus_user_client corresponding to the id
 */
export async function getGdpProjectUserClientById(
  id: number,
  fields = defaultFields
): Promise<{ status: number; data?: Partial<GdpProjectsClientsModel> }> {
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
    `${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/project_directus_user_clients/${id}?fields=${fields}`,
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

type createFieldsToOmit = 'id' | 'activities_id' | 'show_notifications';

/**
 * Create a gdp project_directus_user_client.
 * @param projectUsersClients array of items.
 * @returns Status and data containing gdp project_directus_user_client properties.
 */
export async function createGdpProjectUsersClients(
  projectUsersClients: Omit<GdpProjectsClientsModel, createFieldsToOmit>[]
): Promise<{ status: number; data?: Partial<GdpProjectsClientsModel>[] }> {
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
    body: JSON.stringify(projectUsersClients),
  };

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/projects_directus_users_clients`, myInit)
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

type updateFieldsToOmit = 'id' | 'projects_id' | 'directus_users_id' | 'activities_id';
/**
 * Update project directus user collaborator properties.
 * @param id Affair ID.
 * @param data Properties to update.
 * @returns Status and updated project directus user collaborator properties.
 */
export async function updateGdpProjectUserClient(
  id: string,
  data: Partial<Omit<GdpProjectsClientsModel, updateFieldsToOmit>>
): Promise<{ status: number; data?: Partial<GdpProjectsClientsModel>; error?: string }> {
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

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/projects_directus_users_clients/${id}`, myInit)
    .then((response) => {
      if (response.status === 200) {
        return response
          .json()
          .then((responseData: { data: Partial<GdpProjectsClientsModel> }) => {
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
 * Delete one or more gdp project directus user clients.
 * @param projectsUsersClientsIds Array of one or more gdp project directus user collaborator identifiers in the form of a number.
 * @returns Status.
 */
export async function deleteProjectsUsersClient(projectsUsersClientsIds: number[]): Promise<{ status: number }> {
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
    body: JSON.stringify(projectsUsersClientsIds),
  };

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/projects_directus_users_clients`, myInit)
    .then((response) => {
      return { status: response.status };
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      return { status: 500 };
    });
}
