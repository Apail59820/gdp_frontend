import React from 'react';
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
const AFFAIR_BY_ID: any = {
  id: '1',
  user_created: undefined,
  date_created: undefined,
  user_updated: undefined,
  date_updated: undefined,
  name: "Nom de l'affaire",
  pythagore_ids: undefined,
  status: 'AffairStatusEnum.ACTIVE',
  user_access: undefined,
  affairs_satisfaction: undefined,
};

const CLIENT_TEAM: any[] = [];
const PROJECT_TEAM: any[] = [];

const Team = () => {
  return (
    <TeamPage project={PROJECT_BY_ID} affair={AFFAIR_BY_ID} clientTeam={CLIENT_TEAM} collaboratorTeam={PROJECT_TEAM} />
  );
};

export default Team;
