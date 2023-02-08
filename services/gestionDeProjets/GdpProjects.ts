import { GdpProjectModel } from '../../models/GdPModels';
import { QueryParameters } from '../../models/DirectusModel';
import concatenateQueryParameters from '../../utils/queryParamsFormatter';
import { retrieveToken } from '../auth';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const defaultFields = [
  '*',
  'projects_directus_users_clients_ids.*',
  'projects_directus_users_collaborators_ids.*',
  'company_entity.*',
  'activities_id.*',
].join(',');

/**
 * Retrieve gdp projects respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns request status and gdp projects.
 */
export async function getGdpProjects(
  props: QueryParameters = {}
): Promise<{ status: number; data?: Partial<GdpProjectModel>[] }> {
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
    `${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/projects?${concatenateQueryParameters(props)}`,
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
 * @param id id of the gdp project
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the gdp project
 */
export async function getGdpProjectById(
  id: number,
  fields = defaultFields
): Promise<{ status: number; data?: Partial<GdpProjectModel> }> {
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

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/projects/${id}?fields=${fields}`, myInit).then(
    (res) => {
      if (res.status === 200) {
        return res.json().then((data) => {
          return { status: res.status, data: data.data };
        });
      } else {
        return { status: res.status };
      }
    }
  );
}

type createFieldsToOmit =
  | 'id'
  | 'user_created'
  | 'user_updated'
  | 'date_created'
  | 'date_updated'
  | 'projects_directus_users_clients_ids'
  | 'projects_directus_users_collaborators_ids'
  | 'files'
  | 'affairs'
  | 'activities_id';

/**
 * Create a gdp Project.
 * @param project Object containing gdp project properties.
 * @returns Status and data containing gdp project properties.
 */
export async function createGdpProject(
  project: Omit<GdpProjectModel, createFieldsToOmit>
): Promise<{ status: number; data?: Partial<GdpProjectModel> }> {
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

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/project`, myInit)
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
  | 'projects_directus_users_clients_ids'
  | 'projects_directus_users_collaborators_ids'
  | 'files'
  | 'affairs'
  | 'activities_id';

/**
 * Update gdp project properties.
 * @param id gdp project ID.
 * @param data Properties to update.
 * @returns Status and updated gdp project properties.
 */
export async function updateGdpProject(
  id: string,
  data: Partial<Omit<GdpProjectModel, updateFieldsToOmit>>
): Promise<{ status: number; data?: Partial<GdpProjectModel>; error?: string }> {
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

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/projects/${id}`, myInit)
    .then((response) => {
      if (response.status === 200) {
        return response
          .json()
          .then((responseData: { data: Partial<GdpProjectModel> }) => {
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
