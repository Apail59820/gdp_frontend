import { QueryParameters } from '../models/DirectusModel';
import concatenateQueryParameters from '../utils/queryParamsFormatter';
import { retrieveToken } from './auth';
import getConfig from 'next/config';
import { GdpProjectsCollaboratorsModel } from '../models/GestionDeProjets/GdpProjectsCollaboratorsModel';

const { publicRuntimeConfig } = getConfig();

// const defaultFields = ['*', 'user_access.*', 'affairs_satisfaction.*', 'pythagore_ids.*'].join(',');
const defaultFields = ['*'].join(',');

/**
 * Retrieve projects directus users collaborators respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns List all items that exist in affairs.
 */
export async function getProjectsDirectusUsersCollaborators(
  props: QueryParameters = {}
): Promise<{ status: number; data?: Partial<GdpProjectsCollaboratorsModel>[] }> {
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
    }/items/projects_directus_users_collaborators?${concatenateQueryParameters(props)}`,
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
 * Retrieve a project by id
 * @param id id of the project directus user collaborator
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the project directus user collaborator corresponding to the id
 */
export async function getProjectDirectusUserCollaborator(
  id: number,
  fields = defaultFields
): Promise<{ status: number; data?: GdpProjectsCollaboratorsModel }> {
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
    `${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/projects_directus_users_collaborators/${id}?fields=${fields}`,
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

/**
 * Create a project directus user collaborator.
 * @param projectDirectusUserCollaborator Object containing project properties.
 * @returns Status and data containing project directus user collaborator properties.
 */
export async function createProjectDirectusUserCollaborator(
  projectDirectusUserCollaborator: CreateGdpProjectsCollaboratorsModel
): Promise<{ status: number; data?: GdpProjectsCollaboratorsModel }> {
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
    body: JSON.stringify(projectDirectusUserCollaborator),
  };

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/projects_directus_users_collaborators`, myInit)
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
 * Update project directus user collaborator properties.
 * @param id Affair ID.
 * @param data Properties to update.
 * @returns Status and updated project directus user collaborator properties.
 */
export async function updateProjectDirectusUserCollaborator(
  id: string,
  data: UpdateGdpProjectsCollaboratorsModel
): Promise<{ status: number; data?: GdpProjectsCollaboratorsModel; error?: string }> {
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
    `${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/projects_directus_users_collaborators/${id}`,
    myInit
  )
    .then((response) => {
      if (response.status === 200) {
        return response
          .json()
          .then((responseData: { data: GdpProjectsCollaboratorsModel }) => {
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
 * Delete one or more project directus user collaborator.
 * @param projectsDirectusUsersCollaboratorsArray Array of one or more project directus user collaborator identifiers in the form of a number.
 * @returns Status.
 */
export async function deleteProjectsDirectusUsersCollaborators(
  projectsDirectusUsersCollaboratorsArray: Array<number>
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
    body: JSON.stringify(projectsDirectusUsersCollaboratorsArray),
  };

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/projects_directus_users_collaborators`, myInit)
    .then((response) => {
      return { status: response.status };
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      return { status: 500 };
    });
}
