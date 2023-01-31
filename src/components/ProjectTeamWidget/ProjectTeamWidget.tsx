import { useRouter } from 'next/router';
import React from 'react';
import type { UserModel } from '../../../models/UserModels';
import Section from '../Section/Section';
// import ManagerCard from '../ManagerCard/ManagerCard';

type Props = {
  projectTeam: UserModel[];
};

const ProjectTeamWidget = ({ projectTeam }: Props) => {
  const router = useRouter();

  return (
    <Section title="Équipe projet" link={{ label: "Voir toute l'équipe projet", href: `${router.asPath}/team` }}>
      Carte équipe projet
    </Section>
  );
};

export default ProjectTeamWidget;
