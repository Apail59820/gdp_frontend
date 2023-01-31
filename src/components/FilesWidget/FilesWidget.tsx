import { useRouter } from 'next/router';
import React from 'react';
import ConfigureWidget from '../ConfigureWidget/ConfigureWidget';
import Section from '../Section/Section';

type Props = {
  files: any[];
  handleNewFileClick: React.MouseEventHandler<HTMLButtonElement>;
};

const FilesWidget = ({ files, handleNewFileClick }: Props) => {
  const router = useRouter();

  return (
    <Section
      title="Fichiers"
      link={files.length > 0 ? { label: 'Voir tous les fichiers', href: `${router.asPath}/files` } : undefined}
    >
      {files.length > 0 ? (
        <>Files</>
      ) : (
        <ConfigureWidget
          descriptionText="Vous n'avez aucun fichier"
          label="Ajouter un fichier"
          onClick={handleNewFileClick}
        />
      )}
    </Section>
  );
};

export default FilesWidget;
