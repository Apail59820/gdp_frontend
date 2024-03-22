import { QueryParameters } from "../../../models/DirectusModel";
import { retrieveToken } from "../../auth";
import concatenateQueryParameters from "../../../utils/queryParamsFormatter";
import getConfig from "next/config";
import { GdpCerbBiodiversityModel } from "../../../models/GestionDeProjets/CERBE/GdpCerbBiodiversityModel";
import { isRequestSuccessful } from "../../../utils/isRequestSuccessful";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const { publicRuntimeConfig } = getConfig();

const defaultFields = ["*", "affairs_id.*"].join(",");

export async function getGdpCerbBiodiversity(
  props: QueryParameters = {},
): Promise<{ status: number; data?: Partial<GdpCerbBiodiversityModel>[] }> {
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
    `${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/cerb_biodiversity?${concatenateQueryParameters(props)}`,
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
export async function createGdpCerbBiodiversity(
  gdpAffair: Omit<GdpCerbBiodiversityModel, createFieldsToOmit>,
): Promise<{ status: number; data?: Partial<GdpCerbBiodiversityModel> }> {
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
    `${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/cerb_biodiversity`,
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

type updateFieldsToOmit =
  | "id"
  | "status"
  | "user_created"
  | "user_updated"
  | "date_created"
  | "date_updated"
  | "affairs_id";
export async function updateGdpCerbBiodiversity(
  id: number,
  data: Partial<Omit<GdpCerbBiodiversityModel, updateFieldsToOmit>>,
): Promise<{
  status: number;
  data?: Partial<GdpCerbBiodiversityModel>;
  error?: string;
}> {
  const token = await retrieveToken();
  if (!token) return Promise.resolve({ status: 401 });
  const myHeaders = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const myInit: RequestInit = {
    method: "PATCH",
    headers: myHeaders,
    mode: "cors",
    body: JSON.stringify(data),
  };

  return fetch(
    `${publicRuntimeConfig.GESTION_DE_PROJET_API_URL}/items/cerb_biodiversity/${id}`,
    myInit,
  )
    .then(async (response) => {
      if (isRequestSuccessful(response.status)) {
        try {
          const responseData: any = await response.json();
          return { status: response.status, data: responseData.data };
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
          return { status: response.status };
        }
      } else {
        try {
          const responseData_1: any = await response.json();
          return {
            status: response.status,
            error: responseData_1.errors[0].message,
          };
        } catch (error_1) {
          // eslint-disable-next-line no-console
          console.error(error_1);
          return { status: response.status };
        }
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      return { status: 500 };
    });
}
const fetchGdpCerbBiodiversity = async (params: QueryParameters) => {
  const res = await getGdpCerbBiodiversity(params);
  if (!isRequestSuccessful(res.status)) {
    throw new Error("Network response was not ok");
  }
  return res.data;
};

export const useGdpCerbBiodiversity = (params: QueryParameters) => {
  // @ts-ignore
  const { isLoading, error, data } = useQuery({
    queryKey: ["cerb_biodiversity"],
    queryFn: () => fetchGdpCerbBiodiversity(params),
    staleTime: Infinity,
  });

  return {
    isLoading: isLoading,
    error: error,
    cerb_biodiversity: data as Partial<GdpCerbBiodiversityModel>[],
  };
};

export function useCreateGdpCerbBiodiversity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newBiodiversity: any) => {
      return createGdpCerbBiodiversity(newBiodiversity);
    },
    onSuccess: async (data: any) => {
      if (isRequestSuccessful(data.status)) {
        await queryClient.invalidateQueries({
          queryKey: ["cerb_biodiversity"],
        });
      }
    },
  });
}

export function useUpdateGdpCerbBiodiversity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedBiodiversity: Partial<GdpCerbBiodiversityModel>) => {
      return updateGdpCerbBiodiversity(
        updatedBiodiversity?.id as number,
        updatedBiodiversity,
      );
    },
    onSuccess: (data) => {
      if (isRequestSuccessful(data.status)) {
        queryClient.invalidateQueries({ queryKey: ["cerb_biodiversity"] });
      }
    },
  });
}
