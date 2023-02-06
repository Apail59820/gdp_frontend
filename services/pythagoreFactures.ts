import { QueryParameters } from '../models/DirectusModel';
import concatenateQueryParameters from '../utils/queryParamsFormatter';
import { retrieveToken } from './auth';
import getConfig from 'next/config';
import { GdpPythagoreFactureModel } from '../models/GdPModels';

const { publicRuntimeConfig } = getConfig();

const defaultFields = ['*', 'num_affaire.*', 'num_facture'].join(',');

/**
 * Retrieve pythagore factures respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns List all items that exist in pythagore factures.
 */
export async function getPythagoreFactures(
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
 * Retrieve a pythagore facture by id
 * @param id id of the pythagore facture
 * @param fields list of fields to retrieve.
 * @returns Promise containing the request status and the pythagore facture corresponding to the id
 */
export async function getPythagoreFacture(
  id: number,
  fields = defaultFields
): Promise<{ status: number; data?: GdpPythagoreFactureModel }> {
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
