import cookie from 'js-cookie';
import getConfig from 'next/config';
import {isRequestSuccessful} from "../utils/isRequestSuccessful";

const { publicRuntimeConfig } = getConfig();

let isRefreshing = false;

/**
 * Retrieve the access Token. Try to refresh it if not found.
 */
export async function retrieveToken(): Promise<string | undefined> {
  let token = cookie.get('ds_access_token');
  if (!token) {
    if (isRefreshing) {
      let tryCount = 1;
      while (isRefreshing && tryCount <= 30) {
        await new Promise((done) => setTimeout(done, 100));
        tryCount++;
      }
      return cookie.get('ds_access_token');
    }
    isRefreshing = true;
    await refreshToken();
    token = cookie.get('ds_access_token');
    isRefreshing = false;
  }
  return token;
}

export const refreshToken = () => {
  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: new Headers({ 'Content-Type': 'application/json' }),
  }).then(
    (res) => {
      if (res.status == 200) {
        return res.json().then(
          (r) => {
            const expiringDate = new Date(new Date().getTime() + r.data.expires);
            cookie.set('ds_access_token', r.data.access_token, { expires: expiringDate });
            return Promise.resolve();
          },
          () => {
            //failed to parse
            cookie.remove('ds_access_token');
            return Promise.reject();
          }
        );
      } else {
        //bad Request or other codes
        cookie.remove('ds_access_token');
        return Promise.reject();
      }
    },
    () => {
      //failed to fetch
      cookie.remove('ds_access_token');
      return Promise.reject();
    }
  );
};

/**
 * @param params
 */
export async function inviteNewUsers(
    email: string,
    entity_id: number
): Promise<{ status: number; data?: { id: string; email: string; entity_id: number }[] }> {
  const token = await retrieveToken();
  if (!token) return Promise.resolve({ status: 401 });
  const myHeaders = new Headers({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const body = JSON.stringify({
    email: email,
    entity_id: entity_id,
    invite_url: publicRuntimeConfig.INVITE_URL,
  });
  console.log(body)
  const myInit: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
    body,
  };

  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/register/invite`, myInit)
    .then((response) => {
      if (isRequestSuccessful(response.status)) {
        return response
          .json()
          .then((responseData) => {
            return { status: response.status, data: responseData };
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

export const logout = (): Promise<{ status: number }> => {
  return fetch(`${publicRuntimeConfig.USER_SERVICE_API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  }).then((res) => {
    cookie.remove('ds_access_token');
    cookie.remove('ds_access_token_catalog');
    cookie.remove('ds_access_token_gdp');
    return { status: res.status };
  });
};
