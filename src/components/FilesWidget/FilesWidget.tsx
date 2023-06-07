import { useRouter } from 'next/router';
import React from 'react';
import ConfigureWidget from '../ConfigureWidget/ConfigureWidget';
import PreviewFilesList, { PreviewFilesListProps } from '../PreviewFilesList/PreviewFilesList';
import { Section } from '@projex/ui';

type Props = PreviewFilesListProps & {
  onNewFileClick: React.MouseEventHandler<HTMLButtonElement>;
};

const FilesWidget = ({ files, max, onNewFileClick, allFilesPageHref }: Props) => {
  const router = useRouter();

  return (
    <Section
      title="Fichiers"
      link={
        files.length > 0
          ? {
              label: `Voir ${files.length > 1 ? `tous les ${files.length}` : 'le'} fichier${
                files.length > 1 ? 's' : ''
              }`,
              href: allFilesPageHref || `${router.asPath}/files`,
            }
          : undefined
      }
    >
      {files.length > 0 ? (
        <PreviewFilesList files={files} max={max} allFilesPageHref={allFilesPageHref || `${router.asPath}/files`} />
      ) : (
        <ConfigureWidget
          descriptionText="Vous n'avez aucun fichier"
          button={{
            label: 'Ajouter un fichier',
            onClick: onNewFileClick,
          }}
        />
      )}
    </Section>
  );
};

export default FilesWidget;
