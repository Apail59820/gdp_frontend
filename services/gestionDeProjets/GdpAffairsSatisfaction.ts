import concatenateQueryParameters from '../../utils/queryParamsFormatter';
import { retrieveToken } from '../auth';
import getConfig from 'next/config';
import { QueryParameters } from '../../models/DirectusModel';
import { GdpSatisfactionModel } from '../../models/GdPModels';

const { publicRuntimeConfig } = getConfig();

const defaultFields = ['*'].join(',');

/**
 * Retrieve all gdp satisfactions entries respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns Status and data containing gdp satisfactions properties.
 */
export async function getGdpSatisfactions(
  props: QueryParameters = {}
): Promise<{ status: number; data?: Partial<GdpSatisfactionModel>[] }> {
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
    `${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/affairs_satisfaction?${concatenateQueryParameters(props)}`,
    myInit
  ).then((res) => {
    if (res.status == 200)
      return res.json().then((data) => {
        return { status: res.status, data: data.data };
      });
    else return { status: res.status };
  });
}

type createFieldsToOmit = 'id' | 'user_created' | 'user_updated' | 'date_created' | 'date_updated' | 'activities_id';

/**
 * Create a gdp satisfaction entry.
 * @param satisfaction Object containing gdp satisfactions properties.
 * @returns Status and data containing gdp satisfactions properties.
 */
export async function createGdpSatisfaction(
  satisfaction: Omit<GdpSatisfactionModel, createFieldsToOmit>
): Promise<{ status: number; data?: Partial<GdpSatisfactionModel> }> {
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
    body: JSON.stringify(satisfaction),
  };

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/affairs_satisfaction`, myInit)
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
