import { useRouter } from 'next/router';
import React from 'react';
import type { UserModel } from '../../../models/UserModels';
import Section from '../Section/Section';
// import ManagerCard from '../ManagerCard/ManagerCard';

type Props = {
  clientTeam: UserModel[];
};

const ClientTeamWidget = ({ clientTeam }: Props) => {
  const router = useRouter();

  return (
    <Section title="Équipe client" link={{ label: 'Voir la fiche client', href: `${router.asPath}/client` }}>
      Carte Client
    </Section>
  );
};

export default ClientTeamWidget;
