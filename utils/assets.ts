import { retrieveToken } from '../services/auth';
import getConfig from 'next/config';
import concatenateQueryParameters from './queryParamsFormatter';
const { publicRuntimeConfig } = getConfig();
/**
 * @description Retrieve an avatar asset file by userId from the server.
 *
 * @return an object with the request STATUS and the file url as DATA
 * @param userId
 * @param param
 */
export async function getUserAvatarByUserId(
    userId: string,
    param?: string,
    baseUrl?: string
): Promise<{ status: number; data?: string }> {
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
    const url = baseUrl || `${publicRuntimeConfig.USER_SERVICE_API_URL}`;
    const avatarId = await fetch(
        `${url}/users?${concatenateQueryParameters({
            filter: {
                id: {
                    _eq: userId,
                },
            },
            fields: 'avatar',
        })}`,
        myInit
    ).then((res) => {
        if (res.status == 200) {
            return res.json().then(({ data }) => data[0].avatar);
        } else return undefined;
    });

    if (avatarId)
        return fetch(`${url}/assets/${avatarId}${param ? '?' + param : ''}`, myInit)
            .then((res) => {
                if (res.status === 200 || res.status === 204)
                    return res.blob().then((blob) => {
                        return { status: res.status, data: URL.createObjectURL(blob) };
                    });
                else return { status: res.status };
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(err);
                return { status: 500 };
            });
    return { status: 404 };
}
