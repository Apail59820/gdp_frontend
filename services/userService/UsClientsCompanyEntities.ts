import { UsClientsCompanyEntitiesModel } from '../../models/UsModels';
import { QueryParameters } from '../../models/DirectusModel';
import concatenateQueryParameters from '../../utils/queryParamsFormatter';
import { retrieveToken } from '../auth';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const defaultFields = ['*'].join(',');

/**
 * Retrieve clients company entities respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns List all items that exist in clients company entities.
 */
export async function getUsClientsCompanyEntities(
  props: QueryParameters = {}
): Promise<{ status: number; data?: Partial<UsClientsCompanyEntitiesModel>[] }> {
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
    `${publicRuntimeConfig.USER_SERVICE_API_URL}/items/clients_company_entities?${concatenateQueryParameters(props)}`,
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
 * Retrieve a client company entity by id
 * @param id id of the client company entity
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the client company entity corresponding to the id
 */
export async function getUsClientCompanyEntity(
  id: number,
  fields = defaultFields
): Promise<{ status: number; data?: Partial<UsClientsCompanyEntitiesModel> }> {
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
    `${publicRuntimeConfig.USER_SERVICE_API_URL}/items/clients_company_entities/${id}?fields=${fields}`,
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

type createFieldsToOmit = 'id' | 'user_created' | 'user_updated' | 'date_created' | 'date_updated';
/**
 * Create a client company entity.
 * @param clientCompanyEntity Object containing client company entity properties.
 * @returns Status and data containing client company entity properties.
 */
export async function createUsClientCompanyEntity(
    name?:string,
    clientCompanyEntity?: Omit<UsClientsCompanyEntitiesModel, createFieldsToOmit>
): Promise<{ status: number; data?: Partial<UsClientsCompanyEntitiesModel> }> {
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
    body: name? JSON.stringify({name: name}): JSON.stringify(clientCompanyEntity),
  };

  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/items/clients_company_entities`, myInit)
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

type updateFieldsToOmit = 'id' | 'user_created' | 'user_updated' | 'date_created' | 'date_updated';
/**
 * Update client company entity properties.
 * @param id client company entity ID.
 * @param data Properties to update.
 * @returns Status and updated client company entity properties.
 */
export async function updateUsClientCompanyEntity(
  id: string,
  data: Partial<Omit<UsClientsCompanyEntitiesModel, updateFieldsToOmit>>
): Promise<{ status: number; data?: Partial<UsClientsCompanyEntitiesModel>; error?: string }> {
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

  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/items/clients_company_entities/${id}`, myInit)
    .then((response) => {
      if (response.status === 200) {
        return response
          .json()
          .then((responseData: { data: Partial<UsClientsCompanyEntitiesModel> }) => {
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
