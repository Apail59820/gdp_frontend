import { QueryParameters } from '../../models/DirectusModel';
import concatenateQueryParameters from '../../utils/queryParamsFormatter';
import { GdpEmailsLogsModel } from '../../models/GdPModels';
import { retrieveToken } from '../auth';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

/**
 * Retrieve emails logs
 * @param props Object containing query parameters.
 * @returns data contains all dates of emails
 * */
export async function getGdpEmailsLogs(
  props: QueryParameters = {}
): Promise<{ status: number; data?: Partial<GdpEmailsLogsModel> }> {
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
    `${publicRuntimeConfig.DIRECTUS_HOST}/items/emails_logs?${concatenateQueryParameters(props)}`,
    myInit
  ).then((res) => {
    if (res.status == 200)
      return res.json().then((data) => {
        return { status: res.status, data: data.data };
      });
    else return { status: res.status };
  });
}

type createFieldsToOmit = 'id' | 'date_created' | 'user_created';
export async function createGdpEmailLogs(
  data: Omit<GdpEmailsLogsModel, createFieldsToOmit>
): Promise<{ status: number; data?: Partial<GdpEmailsLogsModel> }> {
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
    body: JSON.stringify(data),
  };

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/emails_logs`, myInit)
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
