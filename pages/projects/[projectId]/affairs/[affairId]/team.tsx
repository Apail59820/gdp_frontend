import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { GdpAffairModel } from '../../../../../models/GdPModels';
import { getGdpAffair } from '../../../../../services/gestionDeProjets/GdpAffairs';
import TeamPage from '../../../../../src/TeamPage/TeamPage';

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

const Team = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [affair, setAffair] = useState<Partial<GdpAffairModel>>({});
  const { affairId } = router.query;

  useEffect(() => {
    if (affairId && typeof affairId == 'string') {
      setIsLoading(true);
      getGdpAffair(+affairId)
        .then((res) => {
          if (res.status === 200 && res.data) setAffair(res.data);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error(e);
          setAffair({});
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [affairId]);

  return <TeamPage project={PROJECT_BY_ID} affair={affair} />;
};

export default Team;
