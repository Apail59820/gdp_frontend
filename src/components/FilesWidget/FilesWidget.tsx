import { useRouter } from 'next/router';
import React from 'react';
import ConfigureWidget from '../ConfigureWidget/ConfigureWidget';
import PreviewFilesList, { PreviewFilesListProps } from '../PreviewFilesList/PreviewFilesList';
import { Section } from 'projex-ui';

type Props = PreviewFilesListProps & {
  onNewFileClick: React.MouseEventHandler<HTMLButtonElement>;
  displayConfigureButton?: boolean;
    fromAffairPage?: boolean;
};

const FilesWidget = ({ files, max, onNewFileClick, allFilesPageHref, displayConfigureButton, fromAffairPage }: Props) => {
  const router = useRouter();
  var splitPath = router.asPath.split('/');

  if(typeof fromAffairPage === 'undefined'){
      fromAffairPage = false;
  }

  return (
    <Section
      title="Fichiers"
      link={
        files.length > 0
          ? {
              label: `Voir ${files.length > 1 ? `tous les ${files.length}` : 'le'} fichier${
                files.length > 1 ? 's' : ''
              }`,
                href: allFilesPageHref ||
                    ((fromAffairPage) ? `${router.asPath}/../../files?affairId=${splitPath.pop()}` : `${router.asPath}/files`),
            }
          : undefined
      }
    >
      {files.length > 0 ? (
        <PreviewFilesList files={files} max={max} allFilesPageHref={allFilesPageHref || `${router.asPath}/files`} />
      ) : (
        <ConfigureWidget
          descriptionText="Vous n'avez aucun fichier"
          button={
            displayConfigureButton
              ? {
                  label: 'Ajouter un fichier',
                  onClick: onNewFileClick,
                }
              : undefined
          }
        />
      )}
    </Section>
  );
};

export default FilesWidget;
