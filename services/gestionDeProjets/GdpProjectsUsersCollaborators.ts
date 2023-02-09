import { QueryParameters } from '../../models/DirectusModel';
import concatenateQueryParameters from '../../utils/queryParamsFormatter';
import { retrieveToken } from '../auth';
import getConfig from 'next/config';
import { GdpProjectsCollaboratorsModel } from '../../models/GdPModels';

const { publicRuntimeConfig } = getConfig();

const defaultFields = ['*'].join(',');

/**
 * Retrieve gdp projects directus users collaborators respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns List all items that exist in affairs.
 */
export async function getGdpProjectsUsersCollaborators(
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
 * Retrieve a gdp project by id
 * @param id id of the gdp project directus user collaborator
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the gdp project directus user collaborator corresponding to the id
 */
export async function getGdpProjectUserCollaborator(
  id: number,
  fields = defaultFields
): Promise<{ status: number; data?: Partial<GdpProjectsCollaboratorsModel> }> {
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

type createFieldsToOmit = 'id' | 'show_notifications' | 'activities_id';
/**
 * Create a gdp project directus user collaborator.
 * @param projectDirectusUserCollaborator Object containing project properties.
 * @returns Status and data containing gdp project directus user collaborator properties.
 */
export async function createGdpProjectUserCollaborator(
  projectDirectusUserCollaborator: Omit<GdpProjectsCollaboratorsModel, createFieldsToOmit>
): Promise<{ status: number; data?: Partial<GdpProjectsCollaboratorsModel> }> {
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

type updateFieldsToOmit = 'id' | 'projects_id' | 'directus_users_id' | 'activities_id';
/**
 * Update gdp project directus user collaborator properties.
 * @param id gdp project directus user collaborator ID.
 * @param data Properties to update.
 * @returns Status and updated gdp project directus user collaborator properties.
 */
export async function updateGdpProjectUserCollaborator(
  id: string,
  data: Partial<Omit<GdpProjectsCollaboratorsModel, updateFieldsToOmit>>
): Promise<{ status: number; data?: Partial<GdpProjectsCollaboratorsModel>; error?: string }> {
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
          .then((responseData: { data: Partial<GdpProjectsCollaboratorsModel> }) => {
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
 * Delete one or more gdp project directus user collaborator.
 * @param projectsUsersCollaboratorsIds Array of one or more project directus user collaborator identifiers in the form of a number.
 * @returns Status.
 */
export async function deleteGdpProjectsUsersCollaborators(
  projectsUsersCollaboratorsIds: number[]
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
    body: JSON.stringify(projectsUsersCollaboratorsIds),
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
