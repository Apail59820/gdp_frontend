import React, { useEffect, useState } from "react";
import styles from "./HomeDashboard.module.scss";
import { PlusOutlined } from "@ant-design/icons";
import { GdpProjectsModel, GdpAffairModel } from "../../models/GdPModels";
import { QuickActionCard } from "projex-ui";
import Grid from "../components/Grid/Grid";
import QuickAccessWidget from "../components/QuickAccessWidget/QuickAccessWidget";
import ProjectsWidget from "../components/ProjectsWidget/ProjectsWidget";
import { useSelector } from "react-redux";
import getConfig from "next/config";
import { isRequestSuccessful } from "../../utils/isRequestSuccessful";
import CreateProjectForm from "../components/CreateProjectForm/CreateProjectForm";
import { selectProjects } from "../../store/reducers/projectsReducer";
import { selectUserProfile } from "../../store/reducers/authReducer";
import CERBEWidget from "../components/CERBEWidget/CERBEWidget";
import { getGdpAffairs } from "../../services/gestionDeProjets/GdpAffairs";
import getUsersProjects from "../../utils/getUsersProjects";

const { publicRuntimeConfig } = getConfig();

type Props = {
  setIsCreateNewCERBEModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  projects: Partial<GdpProjectsModel>[];
  isLoading: boolean;
};
const HomeDashboard = ({ setIsCreateNewCERBEModalOpen, projects, isLoading }: Props) => {
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

  useEffect(() => {
    if (!userProfile || !userProfile.role || !userProfile.id) return;

    const isCurrentUsersRoleClient =
      userProfile.role === publicRuntimeConfig.ROLE_CLIENT_ID;

    setAreCurrentUsersProjectsLoading(true);

    getUsersProjects(
      userProfile.id,
      globalProjects,
      isCurrentUsersRoleClient,
      6,
    ).then((projects) => {
      if (projects?.length) {
        setCurrentUsersProjects(projects);
      }
    });

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
        projects={projects}
        isLoading={isLoading}
        handleNewProjectClick={() => setIsCreateNewProjectModalOpen(true)}
      />
      <CERBEWidget
        handleNewCERBEClick={() => setIsCreateNewCERBEModalOpen(true)}
      />
    </div>
  );
};

export default HomeDashboard;
