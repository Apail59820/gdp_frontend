import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { GdpAffairModel, GdpProjectsModel } from '../../../../../models/GdPModels';
import { getGdpProjectById } from '../../../../../services/gestionDeProjets/GdpProjects';
import TeamPage from '../../../../../src/TeamPage/TeamPage';
import { isRequestSuccessful } from '../../../../../utils/isRequestSuccessful';

const Team = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [project, setProject] = useState<Partial<GdpProjectsModel>>({});

  const { projectId, affairId } = router.query;

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
        'affairs.affairs_directus_users_ids.directus_users_id',
      ].join(',')
    )
      .then((res) => {
        if (isRequestSuccessful(res.status) && res.data) setProject(res.data);
        else setProject({});
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        setProject({});
      })
      .finally(() => setIsLoading(false));
  }, [router, projectId, affairId]);

  if (isLoading) return null;

  return <TeamPage project={project} />;
};

export default Team;
