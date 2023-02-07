import React from 'react';
import { useRouter } from 'next/router';
import { Section } from '@projex/ui';
import ConfigureWidget from '../ConfigureWidget/ConfigureWidget';
import CollaboratorTeamCard, { CollaboratorTeamCardProps } from '../CollaboratorTeamCard/CollaboratorTeamCard';

type Props = Omit<CollaboratorTeamCardProps, 'allUsersPageHref' | 'onKebabMenuClick'> & {
  onAddCollaboratorClick: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'project' | 'affair';
  collaboratorTeamPageHref?: string;
};

const CollaboratorTeamWidget = (props: Props) => {
  const { onAddCollaboratorClick, type = 'project', collaboratorTeamPageHref } = props;
  const router = useRouter();

  const isCurrentPageTeamPage: boolean = router.asPath.split('/')[router.asPath.split('/').length - 1] === 'team';

  return (
    <Section
      title={`Responsables ${type === 'project' ? 'du projet' : "de l'affaire"}`}
      link={
        !isCurrentPageTeamPage && props.users.length > 0
          ? { label: "Voir toute l'équipe", href: collaboratorTeamPageHref || `${router.asPath}/team` }
          : undefined
      }
    >
      {props.users.length > 0 ? (
        <CollaboratorTeamCard
          {...props}
          allUsersPageHref={collaboratorTeamPageHref || `${router.asPath}/team`}
          onKebabMenuClick={() => console.log('handle click ?')}
        />
      ) : (
        <ConfigureWidget
          descriptionText="Aucun collaborateur ajouté au projet"
          button={{ label: 'Ajouter des collaborateurs', onClick: onAddCollaboratorClick }}
        />
      )}
    </Section>
  );
};

export default CollaboratorTeamWidget;
