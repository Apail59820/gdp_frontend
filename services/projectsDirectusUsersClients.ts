import { QueryParameters } from '../models/DirectusModel';
import concatenateQueryParameters from '../utils/queryParamsFormatter';
import { retrieveToken } from './auth';
import getConfig from 'next/config';
import { GdpProjectsClientsModel } from '../models/GestionDeProjets/GdpProjectsClientsModel';

const { publicRuntimeConfig } = getConfig();

const defaultFields = ['*'].join(',');

/**
 * Retrieve projects directus users clients respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns List all items that exist in affairs.
 */
export async function getProjectsDirectusUsersClients(
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
 * Retrieve a project_directus_user_client by id
 * @param id id of the project_directus_user_client
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the project_directus_user_client corresponding to the id
 */
export async function getProjectDirectusUserClient(
  id: number,
  fields = defaultFields
): Promise<{ status: number; data?: GdpProjectsClientsModel }> {
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

type createFieldsToOmit = 'id' | 'activities_id';

/**
 * Create a project_directus_user_client.
 * @param projectDirectusUserClient Object containing project_directus_user_client properties.
 * @returns Status and data containing project_directus_user_client properties.
 */
export async function createProjectDirectusUserCollaborator(
  projectDirectusUserClient: createFieldsToOmit
): Promise<{ status: number; data?: GdpProjectsClientsModel }> {
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
    body: JSON.stringify(projectDirectusUserClient),
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
/**
 * Delete one or more projects_directus_users_clients.
 * @param projectsDirectusUsersClientsArray Array of one or more projects_directus_users_clients identifiers in the form of a number.
 * @returns Status.
 */
export async function deleteProjectsDirectusUsersClients(
  projectsDirectusUsersClientsArray: Array<number>
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
    body: JSON.stringify(projectsDirectusUsersClientsArray),
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
