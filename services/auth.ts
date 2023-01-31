import cookie from 'js-cookie';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
// const urlLogin = 'http://localhost:8055';
export const login = (email: string, password: string): Promise<{ status: number; data?: string }> => {
  return fetch(`${publicRuntimeConfig.DIRECTUS_HOST}/auth/login`, {
    method: 'POST',
    credentials: 'include', //NOTE needed to receive the new token in cookie
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      email,
      password,
      mode: 'cookie',
    }),
  }).then(
    (res) => {
      if (res.status == 200) {
        return res.json().then((r) => {
          const expiringDate = new Date(new Date().getTime() + r.data.expires);

          cookie.set('maia_gestion_projet_token', r.data.access_token, { expires: expiringDate });
          return { status: res.status, data: r.data };
        });
      } else return { status: res.status };
    },
    () => {
      return { status: 500 };
    }
  );
};

export const logout = (): Promise<{ status: number }> => {
  return fetch(`${publicRuntimeConfig.DIRECTUS_HOST}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  }).then((res) => {
    cookie.remove('maia_gestion_projet_token');
    cookie.remove('ds_token_expiration');
    return { status: res.status };
  });
};

type RegisterBodyType = {
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  company?: string;
  title?: string;
  number?: string;
  web_link?: string;
  cgu: boolean;
};

export const register = (body: RegisterBodyType): Promise<{ status: number }> => {
  return fetch(`${publicRuntimeConfig.DIRECTUS_HOST}/register`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(body),
  }).then((res) => {
    return { status: res.status };
  });
};

let isRefreshing = false;

/**
 * Retrieve the access Token. Try to refresh it if not found.
 */
export async function retrieveToken(): Promise<string | undefined> {
  let token = cookie.get('maia_gestion_projet_token');
  if (!token) {
    if (isRefreshing) {
      let tryCount = 1;
      while (isRefreshing && tryCount <= 30) {
        await new Promise((done) => setTimeout(done, 100));
        tryCount++;
      }
      return cookie.get('maia_gestion_projet_token');
    }
    isRefreshing = true;
    await refreshToken();
    token = cookie.get('maia_gestion_projet_token');
    isRefreshing = false;
  }
  return token;
}

export const refreshToken = () => {
  return fetch(`${publicRuntimeConfig.DIRECTUS_HOST}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: new Headers({ 'Content-Type': 'application/json' }),
  }).then(
    (res) => {
      if (res.status == 200) {
        return res.json().then(
          (r) => {
            const expiringDate = new Date(new Date().getTime() + r.data.expires);
            cookie.set('maia_gestion_projet_token', r.data.access_token, { expires: expiringDate });
            cookie.set('ds_token_expiration', expiringDate.toDateString(), { expires: expiringDate });
            return Promise.resolve();
          },
          () => {
            //failed to parse
            cookie.remove('maia_gestion_projet_token');
            cookie.remove('ds_token_expiration');
            return Promise.reject();
          }
        );
      } else {
        //bad Request or other codes
        cookie.remove('maia_gestion_projet_token');
        cookie.remove('ds_token_expiration');
        return Promise.reject();
      }
    },
    () => {
      //failed to fetch
      cookie.remove('maia_gestion_projet_token');
      cookie.remove('ds_token_expiration');
      return Promise.reject();
    }
  );
};

export const recoverPasswordRequest = (email: string, reset_url: string) => {
  return fetch(`${publicRuntimeConfig.DIRECTUS_HOST}/auth/password/request`, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ email, reset_url }),
  }).then((res) => {
    return { status: res.status };
  });
};

export const recoverPassword = (password: string, token: string) => {
  return fetch(`${publicRuntimeConfig.DIRECTUS_HOST}/auth/password/reset`, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ password, token }),
  }).then((res) => {
    return { status: res.status };
  });
};

export const requestEmailValidation = (email: string) => {
  return fetch(`${publicRuntimeConfig.DIRECTUS_HOST}/register/request`, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ email }),
  }).then((res) => {
    return { status: res.status };
  });
};

export const validateEmail = (token: string) => {
  return fetch(`${publicRuntimeConfig.DIRECTUS_HOST}/register/validate`, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ token }),
  }).then((res) => {
    return { status: res.status };
  });
};

/**
 * @param email user email
 */
export async function userInvite(
  email: string | string[]
): Promise<{ status: number; data?: { id: string; email: string }[] }> {
  const token = await retrieveToken();
  if (!token) return Promise.resolve({ status: 401 });
  const myHeaders = new Headers({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const body = JSON.stringify({
    email: email,
    invite_url: publicRuntimeConfig.INVITE_URL,
  });
  const myInit: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
    body,
  };

  return fetch(`${publicRuntimeConfig.DIRECTUS_HOST}/register/invite`, myInit)
    .then((response) => {
      if (response.status === 200) {
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

/**
 * @param urlToken token contained in invite URL as query parameter
 * @param password password and confirmed password from login form
 */
export const acceptUserInvite = (urlToken: string, password: string): Promise<{ status: number }> => {
  const myHeaders = new Headers({
    'Content-Type': 'application/json',
  });
  const body = JSON.stringify({ token: urlToken, password });
  const myInit: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
    body,
  };

  return fetch(`${publicRuntimeConfig.DIRECTUS_HOST}/users/invite/accept`, myInit).then((res) => {
    return { status: res.status };
  });
};
