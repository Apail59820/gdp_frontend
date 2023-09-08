import React from 'react';
import { GdpSatisfactionModel } from '../../../models/GestionDeProjets/GdpSatisfactionModel';
import styles from './SatisfactionCard.module.scss';
import { ProgressBarRounded, ShadowCard } from 'projex-ui';
import { DateTime } from 'luxon';

interface SatisfactionCardProps {
  satisfactions: Partial<GdpSatisfactionModel>[];
  reverse?: boolean;
}

const SatisfactionCard = ({satisfactions, reverse}: SatisfactionCardProps) => {
  const total = 4;

  const score = isNaN(
    satisfactions.reduce(
      (acc, satisfaction) => acc + (satisfaction.score_hard_skills ? satisfaction.score_hard_skills : 0),
      0,
    ) / satisfactions.length,
  )
    ? 0
    : satisfactions.reduce(
    (acc, satisfaction) => acc + (satisfaction.score_hard_skills ? satisfaction.score_hard_skills : 0),
    0,
  ) / satisfactions.length;

  const commentsNumber = satisfactions.filter((satisfaction) => satisfaction.comment).length;

  const uniqueUsersCount = [
    ...new Map(satisfactions.map((satisfaction) => [satisfaction.user_created, satisfaction])).values(),
  ].length;

  const lastComment =
    satisfactions.length > 0
      ? satisfactions.sort((a, b) => {
        if (!a.date_created || !b.date_created) return 0;
        return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
      })[0]
      : satisfactions[0];

  return (
    <ShadowCard>
      <div className={`${styles.container} ${reverse && styles.reverse}`}>
        <ProgressBarRounded
          percentage={isNaN((score / total) * 100) ? 0 : (parseFloat((score / total * 100).toFixed(2)))}
          // text={`${score} / ${total}`}
          // color={'green'}
        />
        <div className={styles.infos}>
          <span>
            Note moyenne :{' '}
            <b>
              {score.toFixed((2))} / {total}
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
            {lastComment && lastComment.date_created ? (
              <b>{DateTime.fromISO(lastComment.date_created.toString()).setLocale('fr').toLocaleString()}</b>
            ) : (
              <b>Date inconnue</b>
            )}
          </span>
        </div>
      </div>
    </ShadowCard>
  );
};

export default SatisfactionCard;
