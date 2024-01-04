import React from 'react';
import { GdpSatisfactionModel } from '../../../models/GestionDeProjets/GdpSatisfactionModel';
import { Section } from 'projex-ui-dev';
import { useRouter } from 'next/router';
import SatisfactionCard from '../SatisfactionCard/SatisfactionCard';
import ConfigureWidget from '../ConfigureWidget/ConfigureWidget';

interface SatisfactionWidgetProps {
  satisfactions: Partial<GdpSatisfactionModel>[];
  allSatisfactionsPageHref?: string;
}

const SatisfactionWidget = ({ satisfactions, allSatisfactionsPageHref }: SatisfactionWidgetProps) => {
  const router = useRouter();

  return (
    <Section
      title={'Satisfaction'}
      link={{
        label: 'Voir le détail de la satisfaction',
        href: allSatisfactionsPageHref ?? `${router.asPath}/satisfaction`,
      }}
    >
      {satisfactions.length > 0 && <SatisfactionCard satisfactions={satisfactions} />}
      {satisfactions.length === 0 && <ConfigureWidget descriptionText={'Aucune donnée de satisfaction disponible.'} />}
    </Section>
  );
};

export default SatisfactionWidget;
