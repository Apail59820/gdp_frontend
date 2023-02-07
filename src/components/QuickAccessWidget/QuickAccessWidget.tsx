import React, { PropsWithChildren, useState } from 'react';
import { Section } from '@projex/ui';

type Props = PropsWithChildren;

const QuickAccessWidget = ({ children }: Props) => {
  const [displayQuickAccessSection, setDisplayQuickAccessSection] = useState<boolean>(true);

  return (
    <Section
      title="Accès rapide"
      button={{
        label: `${displayQuickAccessSection ? 'Masquer' : 'Afficher'} l'accès rapide`,
        onClick: () => setDisplayQuickAccessSection((prev) => !prev),
      }}
    >
      {displayQuickAccessSection ? children : null}
    </Section>
  );
};

export default QuickAccessWidget;
