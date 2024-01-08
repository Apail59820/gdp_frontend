import { QueryParameters } from '../../models/DirectusModel';
import concatenateQueryParameters from '../../utils/queryParamsFormatter';
import { retrieveToken } from '../auth';
import getConfig from 'next/config';
import { GdpUsersNotificationModel } from '../../models/GdPModels';
import {isRequestSuccessful} from "../../utils/isRequestSuccessful";
import {UsUserModel} from "../../models/UserService/UsUserModel";

const { publicRuntimeConfig } = getConfig();

const defaultFields = ['*', 'activities_id.*'].join(',');

/**
 * Retrieve gdp notifications respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns List all items that exist in gdp notifications.
 */
export async function getGdpUsersNotifications(
  props: QueryParameters = {}
): Promise<{ status: number; data?: Partial<GdpUsersNotificationModel>[] }> {
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
    `${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/users_notifications?${concatenateQueryParameters(props)}`,
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
 * Retrieve all unread notifications amount
 * @param user User model or its id.
 * @returns number Notifications count.
 */
export async function getGdpUsersNotificationsCount(
    user: Partial<UsUserModel> | string
): Promise<{status: number; count?: number}> {

  const props: QueryParameters =
  {
    filter: { _and : [{ seen: {_eq: false}, directus_users_id: typeof user === 'string' ? user : user?.id}]  },
    aggregate: {count: '*'}};

  const res = await getGdpUsersNotifications(props);

  if(isRequestSuccessful(res.status) && res?.data.length){
    // @ts-ignore
    return {status : res.status, count: res.data[0]?.count as number}
  }

  return {status : res.status};
}

/**
 * Retrieve a gdp notification by id
 * @param id of the gdp notification
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the gdp notification corresponding to the id
 */
export async function getGdpUsersNotification(
  id: number,
  fields = defaultFields
): Promise<{ status: number; data?: Partial<GdpUsersNotificationModel> }> {
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
    `${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/users_notifications/${id}?fields=${fields}`,
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

type updateFieldsToOmit =
  | 'id'
  | 'user_created'
  | 'user_updated'
  | 'date_created'
  | 'date_updated'
  | 'sent_mail'
  | 'directus_users_id'
  | 'activities_id';
/**
 * Update item.
 * @param payload Object with ids of targets and data to update.
 * @returns Status and updated  gdp notification user access properties.
 */
export async function updateGdpUsersNotifications(payload: {
  keys: number[];
  data: Partial<Omit<GdpUsersNotificationModel, updateFieldsToOmit>>;
}): Promise<{ status: number; data?: Partial<GdpUsersNotificationModel> }> {
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

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/users_notifications`, myInit)
    .then((response) => {
      if (response.status === 200) {
        return response
          .json()
          .then((responseData: { data: Partial<GdpUsersNotificationModel> }) => {
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
