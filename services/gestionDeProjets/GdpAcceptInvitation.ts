import { isRequestSuccessful } from "../../utils/isRequestSuccessful";
import { retrieveToken } from "../auth";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
export async function acceptInvitation(invitation_token: string): Promise<{
  status: number;
  data?: any;
}> {
  const token = await retrieveToken();
  if (!token) return Promise.resolve({ status: 401 });
  const myHeaders = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });
  const body = JSON.stringify({
    token: invitation_token,
  });

  const myInit: RequestInit = {
    method: "POST",
    headers: myHeaders,
    mode: "cors",
    cache: "default",
    body,
  };

  return fetch(
    `${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/invite/accept`,
    myInit,
  )
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
