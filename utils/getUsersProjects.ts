import { getGdpProjectsUsersClients } from "../services/gestionDeProjets/GdpProjectsUsersClients";
import { isRequestSuccessful } from "./isRequestSuccessful";
import { GdpProjectsModel } from "../models/GestionDeProjets/GdpProjectsModel";
import { getGdpProjectsUsersCollaborators } from "../services/gestionDeProjets/GdpProjectsUsersCollaborators";
import { QueryParameters } from "../models/DirectusModel";

const getUsersProjects = async (
  userId: string,
  globalProjects: Partial<GdpProjectsModel>[],
  isClient: boolean = false,
  limit: number = null,
) => {
  let queryParameters: QueryParameters = {
    filter: {
      directus_users_id: {
        _eq: userId,
      },
    },
    fields: ["id", "projects_id.*", "directus_users_id"].join(","),
  };

  if (limit) {
    queryParameters.limit = limit;
  }

  if (isClient) {
    return getGdpProjectsUsersClients(queryParameters).then((result) => {
      if (isRequestSuccessful(result.status) && result.data) {
        const myProjects = result.data.map(
          (projectCollaborators) =>
            projectCollaborators.projects_id as Partial<GdpProjectsModel>,
        );
        return globalProjects.filter((project) => {
          return myProjects.some((myProject) => myProject.id === project.id);
        });
      }
    });
  } else {
    return getGdpProjectsUsersCollaborators(queryParameters).then((result) => {
      if (isRequestSuccessful(result.status) && result.data) {
        return result.data.map(
          (projectCollaborators) =>
            projectCollaborators.projects_id as Partial<GdpProjectsModel>,
        );
      }
    });
  }
};

export default getUsersProjects;
