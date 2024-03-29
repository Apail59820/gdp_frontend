import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.scss";
import PageHeaderBanner from "../src/components/PageHeaderBanner/PageHeaderBanner";
import { TabBar } from "projex-ui";
import HomeDashboard from "../src/HomeDashboard/HomeDashboard";
import HomeUpdates from "../src/HomeUpdates/HomeUpdates";
import { getMyUsProfile } from "../services/userService/UsUsers";
import { isRequestSuccessful } from "../utils/isRequestSuccessful";
import { capitalize } from "../utils/capitalize";
import CerbeBannerTimer from "../src/components/CerbeBannerTimer/CerbeBannerTimer";
import { GdpAffairModel } from "../models/GestionDeProjets/GdpAffairModel";
import { GdpProjectsModel } from "../models/GestionDeProjets/GdpProjectsModel";
import CreateCerbeModal from "../src/components/CreateCerbeModal/CreateCerbeModal";
import { useSelector } from "react-redux";
import { selectUserProfile } from "../store/reducers/authReducer";
import { selectProjects } from "../store/reducers/projectsReducer";
import { QueryParameters } from "../models/DirectusModel";
import { getGdpProjectsUsersClients } from "../services/gestionDeProjets/GdpProjectsUsersClients";
import { getGdpProjectsUsersCollaborators } from "../services/gestionDeProjets/GdpProjectsUsersCollaborators";
import getConfig from "next/config";
import { getGdpAffairs } from "../services/gestionDeProjets/GdpAffairs";

type Tab = {
  label: string;
  content: React.ReactNode;
};

const { publicRuntimeConfig } = getConfig();
const Home = () => {
  const userProfile = useSelector(selectUserProfile);
  const globalProjects = useSelector(selectProjects);

  const [isCreateNewCERBEModalOpen, setIsCreateNewCERBEModalOpen] =
    useState<boolean>();
  const [currentUsersProjects, setCurrentUsersProjects] = useState<
    Partial<GdpProjectsModel>[]
  >([]);
  const [areCurrentUsersProjectsLoading, setAreCurrentUsersProjectsLoading] =
    useState(true);
  const [currentUsersAffairs, setCurrentUsersAffairs] = useState<
    Partial<GdpAffairModel>[]
  >([]);

  const tabs: Tab[] = [
    {
      label: "Tableau de bord",
      content: (
        <HomeDashboard
          setIsCreateNewCERBEModalOpen={setIsCreateNewCERBEModalOpen}
          projects={currentUsersProjects}
          isLoading={areCurrentUsersProjectsLoading}
        />
      ),
    },
    {
      label: "Mises à jour",
      content: <HomeUpdates />,
    },
  ];

  const [currentTab, setCurrentTab] = useState<string>(tabs[0].label);
  const [userFullName, setUserFullName] = useState<string>("");

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

  useEffect(() => {
    getMyUsProfile(["first_name", "last_name"].join(","))
      .then((res) => {
        if (isRequestSuccessful(res.status) && res.data) {
          const { first_name = null, last_name = null } = res.data;
          if (first_name && last_name)
            setUserFullName(
              `${first_name.toUpperCase()} ${capitalize(last_name)}`,
            );
          else if (first_name) setUserFullName(`${first_name.toUpperCase()}`);
          else if (last_name) setUserFullName(`${capitalize(last_name)}`);
          else throw "this user has neither first_name or last_name";
        }
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="page">
      <PageHeaderBanner
        data={userFullName ? `Bonjour, ${userFullName}` : "Bonjour"}
      />
      <CerbeBannerTimer
        setIsCreateNewCERBEModalOpen={setIsCreateNewCERBEModalOpen}
      />
      <div className={styles.homePage}>
        <TabBar
          tabs={tabs.map((tab) => tab.label)}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
        {tabs.find((tab) => tab.label === currentTab)?.content}
      </div>
      <CreateCerbeModal
        isOpen={isCreateNewCERBEModalOpen}
        setIsOpen={setIsCreateNewCERBEModalOpen}
        affairs={currentUsersAffairs}
      />
    </div>
  );
};

export default Home;
