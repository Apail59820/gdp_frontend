import { UpdateUserModel, UserModel } from '../Models/UserModel';
import { QueryParameters } from '../Models/DirectusModel';
import concatenateQueryParameters from '../utils/queryParamsFormatter';
import { retrieveToken } from './auth';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

/**
 * Retrieve users respecting the query parameters.
 * @param props Object containing query parameters.
 * @returns List all items that exist in users.
 */
export async function getProfiles(props: QueryParameters = {}): Promise<{ status: number; data?: Array<UserModel> }> {
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

  return fetch(`${publicRuntimeConfig.DIRECTUS_HOST}/users?${concatenateQueryParameters(props)}`, myInit).then(
    (res) => {
      if (res.status == 200)
        return res.json().then((data) => {
          return { status: res.status, data: data.data };
        });
      else return { status: res.status };
    }
  );
}
/**
 * Update the profile of the currently connected user.
 * @param data key/value pairs to update
 * @return a Promise with the request status and the user data in case of success
 */
export async function updateMyProfile(userData: UpdateUserModel): Promise<{ status: number; data?: UserModel }> {
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
    body: JSON.stringify(userData),
  };
  return fetch(`${publicRuntimeConfig.DIRECTUS_HOST}/users/me`, myInit)
    .then((response) => {
      if (response.status === 200) {
        return response
          .json()
          .then((responseData: { data: UserModel }) => {
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
/**
 * Retrieve the profile of the connected user
 * @return a Promise with the request status and the user data in case of success
 */
export async function getMyProfile(): Promise<{
  status: number;
  data?: UserModel;
}> {
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
  const fields =
    'id,first_name,last_name,email,title,avatar,location,language,number,company,web_link,role,description,directus_files_avatar_id,cgu,email_notifications,showDocumentation';
  return fetch(`${publicRuntimeConfig.DIRECTUS_HOST}/users/me?fields=${fields}`, myInit).then((res) => {
    if (res.status == 200)
      return res
        .json()
        .then((resData: { data: UserModel }) => {
          return { status: res.status, data: resData.data };
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          return { status: res.status };
        });
    else return { status: res.status };
  });
}

/**
 * Retrieve the profile of a user by ID
 * @param id ID of the user
 * @return a Promise with the request status and the user data in case of success
 */
export async function getProfileById(id: string): Promise<{ status: number; data?: UserModel }> {
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
  const fields =
    'id,first_name,last_name,email,title,avatar,location,language,number,company,web_link,description,directus_files_avatar_id';
  return fetch(`${publicRuntimeConfig.DIRECTUS_HOST}/users/${id}?fields=${fields}`, myInit).then((res) => {
    if (res.status == 200)
      return res
        .json()
        .then((resData: { data: UserModel }) => {
          return { status: res.status, data: resData.data };
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          return { status: res.status };
        });
    else return { status: res.status };
  });
}

/**
 * Update a user profile.
 * @param id ID of the user to update
 * @param data key/value pairs to update
 * @return a Promise with the request status and the user data in case of success
 */
export async function updateProfileById(
  id: string,
  userData: UpdateUserModel
): Promise<{ status: number; data?: UserModel }> {
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
    body: JSON.stringify(userData),
  };

  return fetch(`${publicRuntimeConfig.DIRECTUS_HOST}/users/${id}`, myInit).then((res) => {
    return { status: res.status };
  });
}
