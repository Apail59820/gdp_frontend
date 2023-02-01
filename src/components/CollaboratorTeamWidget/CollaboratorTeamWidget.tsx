import React from 'react';
import { useRouter } from 'next/router';
import ProjectTeamCard, { ProjectTeamCardProps } from '../ProjectTeamCard/ProjectTeamCard';
import Section from '../Section/Section';
import ConfigureWidget from '../ConfigureWidget/ConfigureWidget';

type Props = Omit<ProjectTeamCardProps, 'allUsersPageHref' | 'onKebabMenuClick'> & {
  onAddCollaboratorClick: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'project' | 'affair';
  collaboratorTeamPageHref?: string;
};

const CollaboratorTeamWidget = (props: Props) => {
  const { onAddCollaboratorClick, type = 'project', collaboratorTeamPageHref } = props;
  const router = useRouter();

  return (
    <Section
      title={`Responsables ${type === 'project' ? 'du projet' : "de l'affaire"}`}
      link={
        props.users.length > 0
          ? { label: "Voir toute l'équipe", href: collaboratorTeamPageHref || `${router.asPath}/team` }
          : undefined
      }
    >
      {props.users.length > 0 ? (
        <ProjectTeamCard
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
