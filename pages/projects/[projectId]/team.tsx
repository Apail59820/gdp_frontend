import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { GdpProjectsModel } from '../../../models/GdPModels';
import { getGdpProjectById } from '../../../services/gestionDeProjets/GdpProjects';
import TeamPage from '../../../src/TeamPage/TeamPage';

const Team = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [project, setProject] = useState<Partial<GdpProjectsModel>>({});
  const { projectId } = router.query;

  useEffect(() => {
    if (projectId && typeof projectId == 'string') {
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
          else router.push('/404', undefined, { shallow: true });
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error(e);
          setProject({});
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [router, projectId]);

  return <TeamPage project={project} />;
};

export default Team;
