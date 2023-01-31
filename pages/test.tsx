import React from 'react';
import { CompanyEnum } from '../models/CompanyEnum';
import { UserModel } from '../models/UserModels';
import ClientTeamCard from '../src/components/ClientTeamCard/ClientTeamCard';
import ProjectTeamCard from '../src/components/ProjectTeamCard/ProjectTeamCard';

const USERS: UserModel[] = [
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
  {
    id: '6',
    first_name: 'first_name',
    last_name: 'last_name',
    number: '6',
    email: 'email',
  },
];

const test = () => {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '25px',
      }}
    >
      <div style={{ width: '640px', height: '192px' }}>
        <ClientTeamCard
          clientCompany={{
            id: '1',
            name: 'name',
            client_company_name: 'client_company_name',
            client_info: 'client_info',
            address: 'address',
            zip_code: 'zip_code',
            city: 'city',
            country: 'country',
          }}
          users={USERS}
          allUsersPageHref="/team"
          onKebabMenuClick={() => console.log('handle click ?')}
        />
      </div>
      <div style={{ width: '640px', height: '192px' }}>
        <ProjectTeamCard
          companyEntity={CompanyEnum.DIAGOBAT}
          users={USERS}
          allUsersPageHref="/team"
          onKebabMenuClick={() => console.log('handle click ?')}
        />
      </div>
    </div>
  );
};

export default test;
