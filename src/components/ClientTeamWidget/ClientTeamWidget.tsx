import { useRouter } from 'next/router';
import React from 'react';
import ClientTeamCard, { ClientTeamCardProps } from '../ClientTeamCard/ClientTeamCard';
import ConfigureWidget from '../ConfigureWidget/ConfigureWidget';
import {Section} from 'projex-ui';
import {MenuProps} from "antd";

type Props = Omit<ClientTeamCardProps, 'allUsersPageHref' | 'onKebabMenuClick'> & {
  onAddClientClick?: React.MouseEventHandler<HTMLButtonElement>;
  clientTeamPageHref?: string;
  displayConfigureButton?: boolean;
  projectType?: 'affair' | 'project'
};


const ClientTeamWidget = (props: Props) => {
  const { onAddClientClick, clientTeamPageHref, displayConfigureButton, projectType } = props;
  const router = useRouter();

  const displayKebabMenu : boolean = (projectType != 'project');

  const items: MenuProps['items'] = [
    {
      label:  <a>Ajouter un client à l'affaire</a>,
      key: '0',
    },
  ];

  const DropDownMenuProps = {
    items,
    onClick: onAddClientClick,
  };

  return (
    <Section
      title="Équipe client"
    >
      {props.users?.length > 0 ? (
            <ClientTeamCard
                {...props}
                allUsersPageHref={clientTeamPageHref || `${router.asPath}/client`}
                onKebabMenuClick={(e) => {
                  (e) => e.preventDefault()
                }}
                dropDownItems={DropDownMenuProps as any}
                displayKebabMenu={displayKebabMenu}
            />
      ) : (
        <ConfigureWidget
          descriptionText="Aucun client ajouté au projet, veuillez ajouter vos clients aux affaires liées à ce projet."
          button={
            displayConfigureButton && onAddClientClick
              ? { label: 'Ajouter des clients', onClick: onAddClientClick }
              : undefined
          }
        />
      )}
    </Section>
  );
};

export default ClientTeamWidget;
