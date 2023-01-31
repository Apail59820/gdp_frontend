import { useRouter } from 'next/router';
import React from 'react';
import ConfigureWidget from '../ConfigureWidget/ConfigureWidget';
import PreviewFilesList from '../PreviewFilesList/PreviewFilesList';
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
      link={
        files.length > 0
          ? {
              label: `Voir le${files.length > 1 ? `s ${files.length}` : ''} fichier${files.length > 1 ? 's' : ''}`,
              href: `${router.asPath}/files`,
            }
          : undefined
      }
    >
      {files.length > 0 ? (
        <PreviewFilesList assetsList={files} linkToAllAssets={`${router.asPath}/files`} />
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
