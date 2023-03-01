import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { GdpProjectsModel } from '../../../models/GdPModels';
import { getGdpProjectById } from '../../../services/gestionDeProjets/GdpProjects';
import TeamPage from '../../../src/TeamPage/TeamPage';

// TODO
const PROJECT_BY_ID: any = {
  id: '1',
  name: 'Nom du projet',
  client_company_name: 'Nom du client',
  client_info: undefined,
  address: undefined,
  zip_code: undefined,
  city: undefined,
  country: undefined,
  image: 'ok',
  status: undefined,
  project_type: undefined,
  company_entity: 'CompanyEnum.DIAGOBAT',
  affairs: undefined,
};

const CLIENT_TEAM: any[] = [];
const PROJECT_TEAM: any[] = [];

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
