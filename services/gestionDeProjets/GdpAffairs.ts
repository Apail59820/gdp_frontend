import { GdpAffairModel } from '../../models/GdPModels';
import { QueryParameters } from '../../models/DirectusModel';
import concatenateQueryParameters from '../../utils/queryParamsFormatter';
import { retrieveToken } from '../auth';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const defaultFields = [
  '*',
  'company_entity.*',
  'pythagore_ids.*',
  'affairs_directus_users_ids.id',
  'affairs_directus_users_ids.affairs_id',
  'affairs_directus_users_ids.directus_users_id',
  'affairs_directus_users_ids.show_notifications',
  'affairs_directus_users_ids.project_manager',
].join(',');

/**
 * Retrieve GdpAffairs respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns List all items that exist in GdpAffairs.
 */
export async function getGdpAffairs(
  props: QueryParameters = {}
): Promise<{ status: number; data?: Partial<GdpAffairModel>[] }> {
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
    `${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/affairs?${concatenateQueryParameters(props)}`,
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
 * Retrieve a GdpAffair by id
 * @param id id of the GdpAffair
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the GdpAffair corresponding to the id
 */
export async function getGdpAffair(
  id: number,
  fields = defaultFields
): Promise<{ status: number; data?: Partial<GdpAffairModel> }> {
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

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/affairs/${id}?fields=${fields}`, myInit).then(
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
  | 'date_created'
  | 'user_updated'
  | 'date_updated'
  | 'pythagore_ids'
  | 'affairs_satisfaction'
  | 'affairs_directus_users_ids'
  | 'files'
  | 'activities_id';

/**
 * Create a GdpAffair.
 * @param gdpAffair Object containing GdpAffair properties.
 * @returns Status and data containing GdpAffair properties.
 */
export async function createGdpAffair(
  gdpAffair: Omit<GdpAffairModel, createFieldsToOmit>
): Promise<{ status: number; data?: Partial<GdpAffairModel> }> {
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
    body: JSON.stringify(gdpAffair),
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

type updateFieldsToOmit =
  | 'id'
  | 'user_created'
  | 'user_updated'
  | 'date_created'
  | 'date_updated'
  | 'projects_id'
  | 'pythagore_ids'
  | 'affairs_satisfaction'
  | 'affairs_directus_users_ids'
  | 'files'
  | 'activities_id';
/**
 * Update GdpAffair properties.
 * @param id GdpAffair ID.
 * @param data Properties to update.
 * @returns Status and updated GdpAffair properties.
 */
export async function updateGdpAffair(
  id: string,
  data: Partial<Omit<GdpAffairModel, updateFieldsToOmit>>
): Promise<{ status: number; data?: Partial<GdpAffairModel>; error?: string }> {
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
