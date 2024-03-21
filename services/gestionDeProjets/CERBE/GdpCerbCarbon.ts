import { QueryParameters } from "../../../models/DirectusModel";
import { retrieveToken } from "../../auth";
import concatenateQueryParameters from "../../../utils/queryParamsFormatter";
import getConfig from "next/config";
import { isRequestSuccessful } from "../../../utils/isRequestSuccessful";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { GdpCerbCarbonModel } from "../../../models/GestionDeProjets/CERBE/GdpCerbCarbonModel";

const { publicRuntimeConfig } = getConfig();

const defaultFields = ["*", "affairs_id.*"].join(",");

export async function getGdpCerbCarbon(
  props: QueryParameters = {},
): Promise<{ status: number; data?: Partial<GdpCerbCarbonModel>[] }> {
  if (!props.fields) props.fields = defaultFields;
  const token = await retrieveToken();

  if (!token) return Promise.resolve({ status: 401 });
  const myHeaders = new Headers({
    Authorization: `Bearer ${token}`,
  });

  const myInit: RequestInit = {
    method: "GET",
    headers: myHeaders,
    mode: "cors",
    cache: "default",
  };

  return fetch(
    `${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/cerb_carbon?${concatenateQueryParameters(props)}`,
    myInit,
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

type createFieldsToOmit =
  | "id"
  | "user_created"
  | "date_created"
  | "user_updated"
  | "date_updated";
export async function createGdpCerbCarbon(
  gdpAffair: Omit<GdpCerbCarbonModel, createFieldsToOmit>,
): Promise<{ status: number; data?: Partial<GdpCerbCarbonModel> }> {
  const token = await retrieveToken();
  if (!token) return Promise.resolve({ status: 401 });
  const myHeaders = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const myInit: RequestInit = {
    method: "POST",
    headers: myHeaders,
    mode: "cors",
    cache: "default",
    body: JSON.stringify(gdpAffair),
  };

  return fetch(
    `${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/cerb_carbon`,
    myInit,
  )
    .then((response) => {
      if (response.status === 200 || response.status === 204) {
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

const fetchGdpCerbCarbon = async (params: QueryParameters) => {
  const res = await getGdpCerbCarbon(params);
  if (!isRequestSuccessful(res.status)) {
    throw new Error("Network response was not ok");
  }
  return res.data;
};

export const useGdpCerbCarbon = (params: QueryParameters) => {
  // @ts-ignore
  const { isLoading, error, data } = useQuery({
    queryKey: ["cerb_carbon"],
    queryFn: () => fetchGdpCerbCarbon(params),
    staleTime: Infinity,
  });

  return {
    isLoading: isLoading,
    error: error,
    cerb_carbon: data as Partial<GdpCerbCarbonModel>[],
  };
};

export function useCreateGdpCerbCarbon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCarbon: Omit<GdpCerbCarbonModel, createFieldsToOmit>) => {
      return createGdpCerbCarbon(newCarbon);
    },
    onSuccess: async (data: any) => {
      if (isRequestSuccessful(data.status)) {
        await queryClient.invalidateQueries({
          queryKey: ["cerb_carbon"],
        });
        message.success('Element "Carbone" ajouté avec succès.');
      } else {
        message.error("Une erreur est survenue.");
      }
    },
    onError: (error: Error) => {
      message.error("Une erreur est survenue.");
    },
  });
}
