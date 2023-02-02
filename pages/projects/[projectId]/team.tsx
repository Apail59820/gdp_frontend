import React from 'react';
import TeamPage from '../../../src/TeamPage/TeamPage';
import { ProjectModel } from '../../../models/ProjectModel';
import { UserModel } from '../../../models/UserModels';
import { CompanyEnum } from '../../../models/CompanyEnum';

// TODO
const PROJECT_BY_ID: ProjectModel = {
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
  company_entity: CompanyEnum.DIAGOBAT,
  affairs: undefined,
};

const CLIENT_TEAM: UserModel[] = [
  {
    id: '1',
    first_name: 'first_name',
    last_name: 'last_name',
    number: '1',
    email: 'email',
    role: 'Client',
    company: 'Compagnie',
  },
  {
    id: '2',
    first_name: 'first_name',
    last_name: 'last_name',
    number: '2',
    email: 'email',
  },
];
const PROJECT_TEAM: UserModel[] = [
  {
    id: '1',
    first_name: 'first_name',
    last_name: 'last_name',
    number: '1',
    email: 'email',
    role: 'Développeur',
    company: CompanyEnum.AMEXIA,
  },
  {
    id: '2',
    first_name: 'first_name',
    last_name: 'last_name',
    number: '2',
    email: 'email',
  },
  {
    id: '3',
    first_name: 'first_name',
    last_name: 'last_name',
    number: '3',
    email: 'email',
  },
  {
    id: '4',
    first_name: 'first_name',
    last_name: 'last_name',
    number: '4',
    email: 'email',
  },
  {
    id: '5',
    first_name: 'first_name',
    last_name: 'last_name',
    number: '5',
    email: 'email',
  },
];

const Team = () => {
  return <TeamPage project={PROJECT_BY_ID} clientTeam={CLIENT_TEAM} collaboratorTeam={PROJECT_TEAM} />;
};

export default Team;
