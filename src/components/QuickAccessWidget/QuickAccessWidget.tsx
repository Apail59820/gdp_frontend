import React, {PropsWithChildren, useEffect, useState} from 'react';
import { Section } from 'projex-ui-dev';

type Props = PropsWithChildren;

const QuickAccessWidget = ({ children }: Props) => {
  const [displayQuickAccessSection, setDisplayQuickAccessSection] = useState<boolean>(true);


    const onClick = ()=>{
        setDisplayQuickAccessSection((prev)=> !prev);
        localStorage.setItem("isQuickAccessOpen", (!displayQuickAccessSection).toString());
    }

    useEffect(() => {
        if (localStorage.getItem("isQuickAccessOpen") === null) setDisplayQuickAccessSection(true);
        else setDisplayQuickAccessSection(localStorage.getItem("isQuickAccessOpen") === 'true');
    }, []);
  return (
    <Section
      title="Accès rapide"
      button={{
          label: `${displayQuickAccessSection ? 'Masquer' : 'Afficher'} l'accès rapide`,
          onClick: onClick,
      }}
    >
      {displayQuickAccessSection ? children : null}
    </Section>
  );
}

export default QuickAccessWidget;
