import React from 'react';
import { CompanyEnum } from '../models/CompanyEnum';
import { UserModel } from '../models/UserModels';
import ClientTeamCard from '../src/components/ClientTeamCard/ClientTeamCard';
import ProjectTeamCard from '../src/components/ProjectTeamCard/ProjectTeamCard';

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
