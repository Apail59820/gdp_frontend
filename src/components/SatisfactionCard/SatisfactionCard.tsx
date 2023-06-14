import React from 'react';
import { GdpSatisfactionModel } from '../../../models/GestionDeProjets/GdpSatisfactionModel';
import styles from './SatisfactionCard.module.scss';
import { ProgressBarRounded, ShadowCard } from '@projex/ui';
import { DateTime } from 'luxon';

interface SatisfactionCardProps {
  satisfactions: Partial<GdpSatisfactionModel>[];
}

const SatisfactionCard = ({ satisfactions }: SatisfactionCardProps) => {
  const total = 4;

  const score =
    satisfactions.reduce(
      (acc, satisfaction) => acc + (satisfaction.score_hard_skills ? satisfaction.score_hard_skills : 0),
      0
    ) / satisfactions.length;

  const commentsNumber = satisfactions.filter((satisfaction) => satisfaction.comment).length;

  const uniqueUsersCount = [
    ...new Map(satisfactions.map((satisfaction) => [satisfaction.user_created, satisfaction])).values(),
  ].length;

  const lastComment = satisfactions.sort(
    (a, b) => new Date(b.date_created as Date).getTime() - new Date(a.date_created as Date).getTime()
  )[0];
  return (
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
            <b>
              {DateTime.fromISO((lastComment.date_created as Date).toString())
                .setLocale('fr')
                .toLocaleString()}
            </b>
          </span>
        </div>
      </div>
    </ShadowCard>
  );
};

export default SatisfactionCard;
