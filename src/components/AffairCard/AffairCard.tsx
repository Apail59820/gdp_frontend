import React, { useEffect, useMemo, useState } from 'react';
import styles from './AffairCard.module.scss';
import { GdpAffairModel, GdpPhaseModel } from '../../../models/GdPModels';
import { ProgressBar, ShadowCard } from '@projex/ui';
import KebabMenuForCards from '../KebabMenuForCards/KebabMenuForCards';
import { getImagesByCompany } from '../../../utils/getImagesByCompany';
import { capitalize } from '../../../utils/capitalize';
import Image from 'next/image';
import { getGdpAffairsPhases } from '../../../services/gestionDeProjets/GdpPhases';
import { useSelector } from 'react-redux';
import { selectCompanyEntities } from '../../../store/reducers/companyEntitiesReducer';

type Props = {
  affair: Partial<GdpAffairModel>;
  onKebabMenuClick: React.MouseEventHandler<HTMLButtonElement>;
};

const AffairCard = ({ affair, onKebabMenuClick }: Props) => {
  const { name } = affair;

  const companyEntities = useSelector(selectCompanyEntities);

  const [affairPhases, setAffairPhases] = useState<Partial<GdpPhaseModel>[]>([]);

  const [affairCompanyEntity, setAffairCompanyEntity] = useState<string>('Entité inconnue');

  const affairPhasesCount: number = useMemo(() => {
    if (affair.affairs_phases) return affair.affairs_phases?.length;
    return 0;
  }, [affair.affairs_phases]);

  const completedAffairPhasesCount: number = useMemo(
    () => affairPhases.filter((affairPhase) => affairPhase.status === 'completed').length,
    [affairPhases]
  );

  const completedAffairPhasesPercentage = useMemo(() => {
    // Si on a 0 phases, on considère que l'affaire est à 100%
    if (affairPhasesCount === 0) return 100;
    return Math.floor((completedAffairPhasesCount / affairPhasesCount) * 100);
  }, [completedAffairPhasesCount, affairPhasesCount]);

  // useEffect to fetch affair phases
  useEffect(() => {
    if (affair.affairs_phases) {
      const tmpPhases: Partial<GdpPhaseModel>[] = [];
      const phasesIdToFetch: number[] = [];
      affair.affairs_phases.forEach((phase) => {
        if (typeof phase === 'number') phasesIdToFetch.push(phase);
        else tmpPhases.push(phase);
      });
      if (phasesIdToFetch.length > 0) {
        getGdpAffairsPhases({
          filter: {
            id: { _in: phasesIdToFetch },
          },
        }).then((res) => {
          if (res.status === 200 && res.data) setAffairPhases([...tmpPhases, ...res.data]);
          else setAffairPhases([...tmpPhases]);
        });
      }
    } else setAffairPhases([]);
  }, [affair.affairs_phases]);

  // useEffect to fetch affair company entity
  useEffect(() => {
    if (affair.company_entity) {
      if (typeof affair.company_entity === 'number') {
        const companyEntity = companyEntities.find((companyEntity) => companyEntity.id === affair.company_entity);
        if (companyEntity && companyEntity.name) setAffairCompanyEntity(companyEntity.name);
        else setAffairCompanyEntity('Entité inconnue');
      } else {
        if (affair.company_entity.name) setAffairCompanyEntity(affair.company_entity.name);
        else setAffairCompanyEntity('Entité inconnue');
      }
    } else setAffairCompanyEntity('Entité inconnue');
  }, [affair.company_entity, companyEntities]);

  return (
    <ShadowCard>
      <div className={styles.affairCard}>
        <div className={styles.body}>
          <h4 className={styles.title}>{name ? capitalize(name) : 'Affaire'}</h4>
          <span>Chef de projet</span>
          <div className={styles.imageContainer}>
            <Image
              fill={true}
              src={getImagesByCompany(affairCompanyEntity).logo}
              alt={`Logo de l'entité ${affairCompanyEntity}`}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <span>
            Étapes terminées : {completedAffairPhasesCount}/{affairPhasesCount}
          </span>
          <ProgressBar percentage={completedAffairPhasesPercentage} tiny />
        </div>
        <KebabMenuForCards onClick={onKebabMenuClick} />
      </div>
    </ShadowCard>
  );
};

export default AffairCard;
