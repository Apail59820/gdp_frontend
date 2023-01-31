import { useRouter } from 'next/router';
import React from 'react';
import ClientTeamCard, { ClientTeamCardProps } from '../ClientTeamCard/ClientTeamCard';
import ConfigureWidget from '../ConfigureWidget/ConfigureWidget';
import Section from '../Section/Section';

type Props = Omit<ClientTeamCardProps, 'allUsersPageHref' | 'onKebabMenuClick'> & {
  onAddClientClick: React.MouseEventHandler<HTMLButtonElement>;
};

const ClientTeamWidget = (props: Props) => {
  const { onAddClientClick } = props;
  const router = useRouter();

  return (
    <Section title="Équipe client" link={{ label: 'Voir la fiche client', href: `${router.asPath}/client` }}>
      {props.users.length > 0 ? (
        <ClientTeamCard
          {...props}
          allUsersPageHref={`${router.asPath}/client`}
          onKebabMenuClick={() => console.log('handle click ?')}
        />
      ) : (
        <ConfigureWidget
          descriptionText="Aucun client ajouté au projet"
          button={{ label: 'Ajouter des clients', onClick: onAddClientClick }}
        />
      )}
    </Section>
  );
};

export default ClientTeamWidget;
