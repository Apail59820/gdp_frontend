import { QueryParameters } from '../../models/DirectusModel';
import concatenateQueryParameters from '../../utils/queryParamsFormatter';
import { retrieveToken } from '../auth';
import getConfig from 'next/config';
import { UsUsersNotificationModel } from '../../models/UsModels';

const { publicRuntimeConfig } = getConfig();

const defaultFields = [
  '*',
  'activity_id.id',
  'activity_id.action',
  'activity_id.collection',
  'activity_id.content',
  'activity_id.user_created',
  'activity_id.date_created',
  'activity_id.company_entities_id', //todo peut être récupérer quelques champs en plus
  'activity_id.company_entities_directus_users_id', //todo peut être récupérer quelques champs en plus
  'activity_id.clients_company_entities_id', //todo peut être récupérer quelques champs en plus
  'activity_id.clients_company_entities_directus_users_id', //todo peut être récupérer quelques champs en plus
].join(',');

/**
 * Retrieve UsNotifications respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns List all items that exist in UsNotifications.
 */
export async function getUsNotifications(
  props: QueryParameters = {}
): Promise<{ status: number; data?: Partial<UsUsersNotificationModel>[] }> {
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
    `${publicRuntimeConfig.USER_SERVICE_API_URL}/items/notifications?${concatenateQueryParameters(props)}`,
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
 * Retrieve a UsNotification by id
 * @param id of the UsNotification
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the UsNotification corresponding to the id
 */
export async function getUsNotification(
  id: number,
  fields = defaultFields
): Promise<{ status: number; data?: Partial<UsUsersNotificationModel> }> {
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

  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/items/notifications/${id}?fields=${fields}`, myInit).then(
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
 * @returns Status and updated UsNotification user access properties.
 */
export async function updateUsNotifications(payload: {
  keys: number[];
  data: Partial<UsUsersNotificationModel>;
}): Promise<{ status: number; data?: Partial<Omit<UsUsersNotificationModel, updateFieldsToOmit>> }> {
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

  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/items/notifications`, myInit)
    .then((response) => {
      if (response.status === 200) {
        return response
          .json()
          .then((responseData: { data: Partial<UsUsersNotificationModel> }) => {
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
