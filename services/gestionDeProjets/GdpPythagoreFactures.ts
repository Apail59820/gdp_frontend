import { QueryParameters } from '../../models/DirectusModel';
import concatenateQueryParameters from '../../utils/queryParamsFormatter';
import { retrieveToken } from '../auth';
import getConfig from 'next/config';
import { GdpPythagoreFactureModel } from '../../models/GdPModels';
import exp from "constants";
import {isRequestSuccessful} from "../../utils/isRequestSuccessful";


const { publicRuntimeConfig } = getConfig();

const defaultFields = ['*', 'num_affaire.*'].join(',');

export async function downloadGdpPythagoreFacture(
    urlToFile : string
): Promise<{status: number, data?: Blob}> {

  const token = await retrieveToken();

  const reqHeaders = new Headers({
    Authorization: `Bearer ${token}`,
  });

  const reqInit: RequestInit = {
    method: 'GET',
    headers: reqHeaders,
    mode: 'cors',
    cache: 'default',
  };

  return fetch(`${publicRuntimeConfig.GESTION_DE_PROJET_URL}/api/download/${urlToFile}`, reqInit).then(
      (res) => {
        console.log('res', res)
        if (isRequestSuccessful(res.status)) {
          return res.blob().then((blob) => {
            return {status: res.status, data: blob};
          });
        } else {
          return {status: res.status}
        }
      }
  ).catch(() => {
    return {status: 500};
  });
}


/**
 * Retrieve gdp pythagore factures respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns List all items that exist in gdp pythagore factures.
 */
export async function getGdpPythagoreFactures(
  props: QueryParameters = {}
): Promise<{ status: number; data?: Partial<GdpPythagoreFactureModel>[] }> {
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
    `${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/pythagore_factures?${concatenateQueryParameters(props)}`,
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
 * Retrieve a gdp pythagore facture by id
 * @param id id of the gdp pythagore facture
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the gdp pythagore facture corresponding to the id
 */
export async function getGdpPythagoreFacture(
  id: number,
  fields = defaultFields
): Promise<{ status: number; data?: Partial<GdpPythagoreFactureModel> }> {
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
    `${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/pythagore_factures/${id}?fields=${fields}`,
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
