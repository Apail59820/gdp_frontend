import React from 'react';
import { useRouter } from 'next/router';
import ProjectTeamCard, { ProjectTeamCardProps } from '../ProjectTeamCard/ProjectTeamCard';
import Section from '../Section/Section';
import ConfigureWidget from '../ConfigureWidget/ConfigureWidget';

type Props = Omit<ProjectTeamCardProps, 'allUsersPageHref' | 'onKebabMenuClick'> & {
  onAddCollaboratorClick: React.MouseEventHandler<HTMLButtonElement>;
  projectTeamPageHref?: string;
};

const ProjectTeamWidget = (props: Props) => {
  const { onAddCollaboratorClick, projectTeamPageHref } = props;
  const router = useRouter();

  return (
    <Section
      title="Équipe projet"
      link={
        props.users.length > 0
          ? { label: "Voir toute l'équipe projet", href: projectTeamPageHref || `${router.asPath}/team` }
          : undefined
      }
    >
      {props.users.length > 0 ? (
        <ProjectTeamCard
          {...props}
          allUsersPageHref={projectTeamPageHref || `${router.asPath}/team`}
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

export default ProjectTeamWidget;
