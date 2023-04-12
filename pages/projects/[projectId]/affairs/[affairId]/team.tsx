import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { GdpAffairModel, GdpProjectsModel } from '../../../../../models/GdPModels';
import { getGdpAffair } from '../../../../../services/gestionDeProjets/GdpAffairs';
import { getGdpProjectById } from '../../../../../services/gestionDeProjets/GdpProjects';
import TeamPage from '../../../../../src/TeamPage/TeamPage';

const Team = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [project, setProject] = useState<Partial<GdpProjectsModel>>({});
  const [affair, setAffair] = useState<Partial<GdpAffairModel>>({});

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
        'affairs.*',
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
      .finally(() => setIsLoading(false));
  }, [router, projectId, affairId]);

  useEffect(() => {
    if (!affairId || typeof affairId !== 'string') return;

    const affair = (project.affairs as GdpAffairModel[])?.find((affair) => affair.id === +affairId);
    if (!affair) router.push('/404', undefined, { shallow: true });
    else setAffair(affair);
  }, [router, project, affairId]);

  if (isLoading) return null;

  return <TeamPage project={project} affair={affair} />;
};

export default Team;
