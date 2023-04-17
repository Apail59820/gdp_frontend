import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { GdpProjectStatusEnum, GdpProjectTypesEnum, GdpProjectsModel } from '../../../models/GdPModels';
import { getGdpProjectById } from '../../../services/gestionDeProjets/GdpProjects';
import TeamPage from '../../../src/TeamPage/TeamPage';

const Team = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [project, setProject] = useState<Partial<GdpProjectsModel>>({});

  const { projectId } = router.query;

  useEffect(() => {
    if (!projectId || typeof projectId !== 'string') return;

    setIsLoading(true);

    getGdpProjectById(
      +projectId,
      [
        'id',
        'name',
        'company_entity.*',
        'projects_directus_users_clients_ids.*',
        'projects_directus_users_collaborators_ids.*',
        'status',
      ].join(',')
    )
      .then((res) => {
        if (res.status === 200 && res.data) setProject(res.data);
        else setProject({});
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        setProject({});
      })
      .finally(() => setIsLoading(false));
  }, [router, projectId]);

  if (isLoading) return null;

  const PROJECT: Partial<GdpProjectsModel> = {
    id: 1,
    name: 'Name',
    client_company_name: 'client company name',
    client_info: 'Client info',
    address: 'address',
    zip_code: 'zip code',
    city: 'city',
    country: 'country',
    projects_directus_users_clients_ids: [
      {
        id: '1',
        show_notifications: true,

        projects_id: 1,
        directus_users_id: {
          id: '1',
          email: 'email',
          first_name: 'first_name',
          last_name: 'last_name',
          number: 'number',
        },
        activities_id: [1],
      },
    ],
  };

  return <TeamPage project={PROJECT} />;
};

export default Team;
