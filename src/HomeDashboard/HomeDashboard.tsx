import React, { useEffect, useState } from "react";
import styles from "./HomeDashboard.module.scss";
import { PlusOutlined } from "@ant-design/icons";
import { GdpAffairModel, GdpProjectsModel } from "../../models/GdPModels";
import { QuickActionCard } from "projex-ui";
import Grid from "../components/Grid/Grid";
import QuickAccessWidget from "../components/QuickAccessWidget/QuickAccessWidget";
import ProjectsWidget from "../components/ProjectsWidget/ProjectsWidget";
import { getGdpProjectsUsersClients } from "../../services/gestionDeProjets/GdpProjectsUsersClients";
import { useSelector } from "react-redux";
import { getGdpProjectsUsersCollaborators } from "../../services/gestionDeProjets/GdpProjectsUsersCollaborators";
import getConfig from "next/config";
import { QueryParameters } from "../../models/DirectusModel";
import { isRequestSuccessful } from "../../utils/isRequestSuccessful";
import CreateProjectForm from "../components/CreateProjectForm/CreateProjectForm";
import { selectUserProfile } from "../../store/reducers/authReducer";
import { selectProjects } from "../../store/reducers/projectsReducer";
import CERBEWidget from "../components/CERBEWidget/CERBEWidget";
import CreateCerbeModal from "../components/CreateCerbeModal/CreateCerbeModal";
import { getGdpAffairs } from "../../services/gestionDeProjets/GdpAffairs";

const { publicRuntimeConfig } = getConfig();

const HomeDashboard = () => {
  const userProfile = useSelector(selectUserProfile);

  const globalProjects = useSelector(selectProjects);

  const [currentUsersProjects, setCurrentUsersProjects] = useState<
    Partial<GdpProjectsModel>[]
  >([]);
  const [currentUsersAffairs, setCurrentUsersAffairs] = useState<
    Partial<GdpAffairModel>[]
  >([]);

  const [areCurrentUsersProjectsLoading, setAreCurrentUsersProjectsLoading] =
    useState(true);

  const [isCreateNewProjectModalOpen, setIsCreateNewProjectModalOpen] =
    useState(false);
  const [isCreateNewCERBEModalOpen, setIsCreateNewCERBEModalOpen] =
    useState(false);

  useEffect(() => {
    if (!userProfile || !userProfile.role || !userProfile.id) return;

    const queryParameters: QueryParameters = {
      filter: {
        directus_users_id: {
          _eq: userProfile.id,
        },
      },
      fields: ["id", "projects_id.*", "directus_users_id"].join(","),
      limit: 6,
    };

    const isCurrentUsersRoleClient =
      userProfile.role === publicRuntimeConfig.ROLE_CLIENT_ID;

    setAreCurrentUsersProjectsLoading(true);
    if (isCurrentUsersRoleClient) {
      getGdpProjectsUsersClients(queryParameters).then((result) => {
        if (isRequestSuccessful(result.status) && result.data) {
          const myProjects = result.data.map(
            (projectCollaborators) =>
              projectCollaborators.projects_id as Partial<GdpProjectsModel>,
          );
          const projects = globalProjects.filter((project) => {
            return myProjects.some((myProject) => myProject.id === project.id);
          });
          setCurrentUsersProjects(projects);
        }
      });
    } else {
      getGdpProjectsUsersCollaborators(queryParameters).then((result) => {
        if (isRequestSuccessful(result.status) && result.data) {
          const myProjects = result.data.map(
            (projectCollaborators) =>
              projectCollaborators.projects_id as Partial<GdpProjectsModel>,
          );
          setCurrentUsersProjects(myProjects);
        }
      });
    }
    setAreCurrentUsersProjectsLoading(false);
  }, [globalProjects, userProfile]);

  useEffect(() => {
    if (currentUsersProjects.length) {
      getGdpAffairs({
        filter: {
          projects_id: {
            _in: currentUsersProjects.map((project) => project?.id),
          },
        },
      }).then((res) => {
        if (isRequestSuccessful(res.status) && res.data?.length) {
          setCurrentUsersAffairs(res.data);
        }
      });
    }
  }, [currentUsersProjects]);

  const getProfileCompletionPercentage = (): number => {
    if (!userProfile) return 0;
    const { id, role, status, ...ownDataThatTheUserCanEdit } = userProfile;

    const ownDataThatTheUserCanEditCount = Object.keys(
      ownDataThatTheUserCanEdit,
    ).length;
    const ownDataThatTheUserHasCompletedCount = Object.values(
      ownDataThatTheUserCanEdit,
    ).filter((data) => {
      if (typeof data === "object") return data?.length;
      return data !== null;
    }).length;

    const percentageOfCompletion = (
      (ownDataThatTheUserHasCompletedCount / ownDataThatTheUserCanEditCount) *
      100
    ).toFixed(1);

    return +percentageOfCompletion;
  };

  return (
    <div className={styles.homeDashboard}>
      <CreateProjectForm
        isOpen={isCreateNewProjectModalOpen}
        setIsOpen={setIsCreateNewProjectModalOpen}
      />
      <QuickAccessWidget>
        <Grid>
          <QuickActionCard
            title="Créez un nouveau projet"
            button={{
              label: "Ajouter un projet",
              onClick: () => setIsCreateNewProjectModalOpen(true),
              icon: <PlusOutlined rev={undefined} />,
            }}
          >
            Créer un nouveau projet dés maintenant
          </QuickActionCard>
          {userProfile && userProfile.id && (
            <QuickActionCard
              title="Complétez votre profil"
              progress={getProfileCompletionPercentage()}
              button={{
                label: "Ajouter des informations",
                href:
                  publicRuntimeConfig.USER_SERVICE_URL +
                  `/user/${userProfile.id}`,
                icon: <PlusOutlined rev={undefined} />,
              }}
            >
              Remplissez votre profil pour profiter pleinement de toutes les
              fonctionnalités
            </QuickActionCard>
          )}
        </Grid>
      </QuickAccessWidget>
      <ProjectsWidget
        projects={currentUsersProjects}
        isLoading={areCurrentUsersProjectsLoading}
        handleNewProjectClick={() => setIsCreateNewProjectModalOpen(true)}
      />
      <CERBEWidget
        handleNewCERBEClick={() => setIsCreateNewCERBEModalOpen(true)}
      />

      <CreateCerbeModal
        isOpen={isCreateNewCERBEModalOpen}
        setIsOpen={setIsCreateNewCERBEModalOpen}
        affairs={currentUsersAffairs}
        userProjects={currentUsersProjects}
      />
    </div>
  );
};

export default HomeDashboard;
