import { UsClientsInteractionsModel } from '../../models/UsModels';
import { QueryParameters } from '../../models/DirectusModel';
import concatenateQueryParameters from '../../utils/queryParamsFormatter';
import { retrieveToken } from '../auth';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const defaultFields = ['*'].join(',');

/**
 * Retrieve clients interactions respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns List all items that exist in clients interactions.
 */
export async function getUsClientsInteractions(
  props: QueryParameters = {}
): Promise<{ status: number; data?: Partial<UsClientsInteractionsModel>[] }> {
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
    `${publicRuntimeConfig.USER_SERVICE_API_URL}/items/clients_interactions?${concatenateQueryParameters(props)}`,
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
 * Retrieve a client interaction by id
 * @param id id of the client interaction
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the client interaction corresponding to the id
 */
export async function getUsClientInteraction(
  id: number,
  fields = defaultFields
): Promise<{ status: number; data?: Partial<UsClientsInteractionsModel> }> {
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
    `${publicRuntimeConfig.USER_SERVICE_API_URL}/items/clients_interactions/${id}?fields=${fields}`,
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
 * Create a client interaction.
 * @param clientInteraction Object containing client interaction properties.
 * @returns Status and data containing client interaction properties.
 */
export async function createUsClientInteraction(
  clientInteraction: Omit<UsClientsInteractionsModel, createFieldsToOmit>
): Promise<{ status: number; data?: Partial<UsClientsInteractionsModel> }> {
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
    body: JSON.stringify(clientInteraction),
  };

  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/items/clients_interactions`, myInit)
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
  | 'directus_users_id';
/**
 * Update client interaction properties.
 * @param id client interaction ID.
 * @param data Properties to update.
 * @returns Status and updated client interaction properties.
 */
export async function updateUsClientInteraction(
  id: string,
  data: Partial<Omit<UsClientsInteractionsModel, updateFieldsToOmit>>
): Promise<{ status: number; data?: Partial<UsClientsInteractionsModel>; error?: string }> {
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

  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/items/clients_interactions/${id}`, myInit)
    .then((response) => {
      if (response.status === 200) {
        return response
          .json()
          .then((responseData: { data: UsClientsInteractionsModel }) => {
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
 * Delete one or more us clients interactions.
 * @param usClientsInteractionsIds Array of one or more us clients interactions identifiers in the form of a number.
 * @returns Status.
 */
export async function deleteUsClientsInteractions(usClientsInteractionsIds: number[]): Promise<{ status: number }> {
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
    body: JSON.stringify(usClientsInteractionsIds),
  };

  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/items/clients_interactions`, myInit)
    .then((response) => {
      return { status: response.status };
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      return { status: 500 };
    });
}
