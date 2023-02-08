import { QueryParameters } from '../../models/DirectusModel';
import concatenateQueryParameters from '../../utils/queryParamsFormatter';
import { retrieveToken } from '../auth';
import getConfig from 'next/config';
import { UsCompanyEntitiesUsersModel } from '../../models/UserService/UsCompanyEntitiesUsersModel';
import { GdpAffairsUsersModel } from '../../models/GestionDeProjets/GdpAffairsUsersModel';

const { publicRuntimeConfig } = getConfig();

const defaultFields = ['*'].join(',');

/**
 * Retrieve company entities directus users respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns List all items that exist in company entities directus users.
 */
export async function geUsCompanyEntitiesUsers(
  props: QueryParameters = {}
): Promise<{ status: number; data?: Partial<UsCompanyEntitiesUsersModel>[] }> {
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
    `${publicRuntimeConfig.USER_SERVICE_API_URL}/items/company_entities_directus_users?${concatenateQueryParameters(
      props
    )}`,
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
 * Retrieve a company entities directus users by id
 * @param id id of the company entities directus users
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the company entities directus users corresponding to the id
 */
export async function getUsCompanyEntityUser(
  id: number,
  fields = defaultFields
): Promise<{ status: number; data?: Partial<UsCompanyEntitiesUsersModel> }> {
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
    `${publicRuntimeConfig.USER_SERVICE_API_URL}/items/company_entities_directus_users/${id}?fields=${fields}`,
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
 * Create a new item.
 * @returns Status and data containing company entity user properties.
 * @param companyEntityUser
 */
export async function createUsCompanyEntityUser(
  companyEntityUser: Omit<UsCompanyEntitiesUsersModel, createFieldsToOmit>[]
): Promise<{ status: number; data?: Partial<UsCompanyEntitiesUsersModel>[] }> {
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
    body: JSON.stringify(companyEntityUser),
  };

  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/items/company_entities_directus_users`, myInit)
    .then((response) => {
      if (response.status === 200) {
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
  | 'company_entities_id'
  | 'directus_users_id'
  | 'activities_id';

/**
 * Update item.
 * @param payload Object with ids of targets and data to update.
 * @returns Status and updated company entity directus user access properties.
 */
export async function updateUsCompanyEntityUser(payload: {
  keys: number[];
  data: Partial<Omit<UsCompanyEntitiesUsersModel, updateFieldsToOmit>>;
}): Promise<{ status: number; data?: Partial<UsCompanyEntitiesUsersModel> }> {
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

  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/items/company_entities_directus_users`, myInit)
    .then((response) => {
      if (response.status === 200) {
        return response
          .json()
          .then((responseData: { data: Partial<GdpAffairsUsersModel> }) => {
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
