import { useRouter } from 'next/router';
import React from 'react';
import ClientTeamCard, { ClientTeamCardProps } from '../ClientTeamCard/ClientTeamCard';
import ConfigureWidget from '../ConfigureWidget/ConfigureWidget';
import { Section } from '@projex/ui';

type Props = Omit<ClientTeamCardProps, 'allUsersPageHref' | 'onKebabMenuClick'> & {
  onAddClientClick: React.MouseEventHandler<HTMLButtonElement>;
  clientTeamPageHref?: string;
  displayConfigureButton?: boolean;
};

const ClientTeamWidget = (props: Props) => {
  const { onAddClientClick, clientTeamPageHref, displayConfigureButton } = props;
  const router = useRouter();

  return (
    <Section
      title="Équipe client"
      link={
        props.users.length > 0
          ? { label: 'Voir la fiche client', href: clientTeamPageHref || `${router.asPath}/client` }
          : undefined
      }
    >
      {props.users.length > 0 ? (
        <ClientTeamCard
          {...props}
          allUsersPageHref={clientTeamPageHref || `${router.asPath}/client`}
          onKebabMenuClick={() => console.log('handle click ?')}
        />
      ) : (
        <ConfigureWidget
          descriptionText="Aucun client ajouté au projet, veuillez ajouter vos clients aux affaires liées à ce projet."
          button={displayConfigureButton ? { label: 'Ajouter des clients', onClick: onAddClientClick } : undefined}
        />
      )}
    </Section>
  );
};

export default ClientTeamWidget;
