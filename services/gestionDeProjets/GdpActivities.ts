import { QueryParameters } from '../../models/DirectusModel';
import concatenateQueryParameters from '../../utils/queryParamsFormatter';
import { retrieveToken } from '../auth';
import getConfig from 'next/config';
import { GdpActivitiesModel } from '../../models/GdPModels';

const { publicRuntimeConfig } = getConfig();

const defaultFields = ['*'].join(',');

/**
 * Retrieve GdpActivities respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns List all items that exist in GdpActivities.
 */
export async function getGdpActivities(
  props: QueryParameters = {}
): Promise<{ status: number; data?: Partial<GdpActivitiesModel>[] }> {
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
    `${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/activities?${concatenateQueryParameters(props)}`,
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
 * Retrieve a GdpActivity by id
 * @param id id of the GdpActivity
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the GdpActivity corresponding to the id
 */
export async function getGdpActivity(
  id: number,
  fields = defaultFields
): Promise<{ status: number; data?: Partial<GdpActivitiesModel> }> {
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

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/activities/${id}?fields=${fields}`, myInit).then(
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
