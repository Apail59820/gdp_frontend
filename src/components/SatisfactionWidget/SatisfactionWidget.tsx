import React from 'react';
import { GdpSatisfactionModel } from '../../../models/GestionDeProjets/GdpSatisfactionModel';
import { Section } from '@projex/ui';
import { useRouter } from 'next/router';
import SatisfactionCard from '../SatisfactionCard/SatisfactionCard';

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
      <SatisfactionCard satisfactions={satisfactions} />
    </Section>
  );
};

export default SatisfactionWidget;
