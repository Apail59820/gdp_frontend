import React from 'react';
import { GdpSatisfactionModel } from '../../../models/GestionDeProjets/GdpSatisfactionModel';
import { ProgressBarRounded, Section, ShadowCard } from '@projex/ui';
import { useRouter } from 'next/router';
import styles from './SatisfactionWidget.module.scss';
import { DateTime } from 'luxon';

interface SatisfactionWidgetProps {
  satisfactions: GdpSatisfactionModel[];
  allSatisfactionsPageHref?: string;
}

const SatisfactionWidget = ({ satisfactions, allSatisfactionsPageHref }: SatisfactionWidgetProps) => {
  const router = useRouter();
  const total = 5;

  const score =
    satisfactions.reduce((acc, satisfaction) => acc + satisfaction.score_hard_skills, 0) / satisfactions.length;

  const commentsNumber = satisfactions.filter((satisfaction) => satisfaction.comment).length;

  const uniqueUsersCount = [
    ...new Map(satisfactions.map((satisfaction) => [satisfaction.user_created, satisfaction])).values(),
  ].length;

  const lastComment = satisfactions.sort(
    (a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
  )[0];

  return (
    <Section
      title={'Satisfaction'}
      link={{
        label: 'Voir le détail de la satisfaction',
        href: allSatisfactionsPageHref ?? `${router.asPath}/satisfaction`,
      }}
    >
      <ShadowCard>
        <div className={styles.container}>
          <ProgressBarRounded
            percentage={isNaN((score / total) * 100) ? 0 : (score / total) * 100}
            text={`${score} / ${total}`}
            color={'green'}
          />
          <div className={styles.infos}>
            <span>
              Note moyenne :{' '}
              <b>
                {score} / {total}
              </b>
            </span>
            <span>
              Nombre de commentaires : <b>{commentsNumber}</b>
            </span>
            <span>
              Utilisateurs sondés : <b>{uniqueUsersCount}</b>
            </span>
            <span>
              Date du dernier commentaire :{' '}
              <b>{DateTime.fromISO(lastComment.date_created.toString()).setLocale('fr').toLocaleString()}</b>
            </span>
          </div>
        </div>
      </ShadowCard>
    </Section>
  );
};

export default SatisfactionWidget;
