import React, { useEffect, useMemo, useState } from 'react';
import styles from './AffairCard.module.scss';
import { GdpAffairModel, GdpAffairsUsersModel, GdpPhaseModel } from '../../../models/GdPModels';
import { ProgressBar, ShadowCard } from '@projex/ui';
import KebabMenuForCards from '../KebabMenuForCards/KebabMenuForCards';
import { getImagesByCompany } from '../../../utils/getImagesByCompany';
import { capitalize } from '../../../utils/capitalize';
import Image from 'next/image';
import { getGdpAffairsPhases } from '../../../services/gestionDeProjets/GdpPhases';
import { useSelector } from 'react-redux';
import { selectCompanyEntities } from '../../../store/reducers/companyEntitiesReducer';
import { selectUsers } from '../../../store/reducers/usersReducer';
import { getUsUser } from '../../../services/userService/UsUsers';
import { getGdpAffairsUsers } from '../../../services/gestionDeProjets/GdpAffairsUsers';

type Props = {
  affair: Partial<GdpAffairModel>;
  onKebabMenuClick: React.MouseEventHandler<HTMLButtonElement>;
};

const AffairCard = ({ affair, onKebabMenuClick }: Props) => {
  const { name } = affair;

  const companyEntities = useSelector(selectCompanyEntities);
  const users = useSelector(selectUsers);

  const [affairPhases, setAffairPhases] = useState<Partial<GdpPhaseModel>[]>([]);

  const [affairCompanyEntity, setAffairCompanyEntity] = useState<string>('Entité inconnue');

  const [affairManager, setAffairManager] = useState<string>('Manager inconnu');

  const affairPhasesCount: number = useMemo(() => {
    if (affair.affairs_phases_ids) return affair.affairs_phases_ids?.length;
    return 0;
  }, [affair.affairs_phases_ids]);

  const completedAffairPhasesCount: number = useMemo(
    () => affairPhases.filter((affairPhase) => affairPhase.status === 'completed').length,
    [affairPhases]
  );

  const completedAffairPhasesPercentage = useMemo(() => {
    // Si on a 0 phases, on considère que l'affaire est à 0%
    if (affairPhasesCount === 0) return 0;
    return Math.floor((completedAffairPhasesCount / affairPhasesCount) * 100);
  }, [completedAffairPhasesCount, affairPhasesCount]);

  // useEffect to fetch affair phases
  useEffect(() => {
    if (affair.affairs_phases_ids) {
      const tmpPhases: Partial<GdpPhaseModel>[] = [];
      const phasesIdToFetch: number[] = [];
      affair.affairs_phases_ids.forEach((phase) => {
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
  }, [affair.affairs_phases_ids]);

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

  // useEffect to fetch first affair manager
  useEffect(() => {
    if (affair.affairs_directus_users_ids && affair.affairs_directus_users_ids.length > 0) {
      const initialRelation: GdpAffairsUsersModel[] = [];
      const relationsToFetch: number[] = [];
      affair.affairs_directus_users_ids.forEach((relationId) => {
        if (typeof relationId === 'number') relationsToFetch.push(relationId);
        else initialRelation.push(relationId);
      });
      if (initialRelation.filter((relation) => relation.project_manager).length > 0) {
        const managerRelation = initialRelation.filter((relation) => relation.project_manager)[0];
        const manager = users.find((user) => user.id === managerRelation.directus_users_id);
        if (manager) {
          setAffairManager(`${manager.first_name} ${manager.last_name}`);
        } else {
          if (typeof managerRelation.directus_users_id === 'string') {
            getUsUser(managerRelation.directus_users_id).then((res) => {
              if (res.status === 200 && res.data) {
                setAffairManager(`${res.data.first_name} ${res.data.last_name}`);
              } else {
                setAffairManager('Manager inconnu');
              }
            });
          } else {
            setAffairManager(
              `${managerRelation.directus_users_id.first_name} ${managerRelation.directus_users_id.last_name}`
            );
          }
        }
      } else {
        getGdpAffairsUsers({
          filter: {
            id: { _in: relationsToFetch },
          },
        }).then((res) => {
          if (res.status === 200 && res.data) {
            if (res.data.filter((relation) => relation.project_manager)) {
              const managerRelation = res.data.filter((relation) => relation.project_manager)[0];
              const manager = users.find((user) => user.id === managerRelation.directus_users_id);
              if (manager) {
                setAffairManager(`${manager.first_name} ${manager.last_name}`);
              } else {
                if (typeof managerRelation.directus_users_id === 'string') {
                  getUsUser(managerRelation.directus_users_id).then((res) => {
                    if (res.status === 200 && res.data) {
                      setAffairManager(`${res.data.first_name} ${res.data.last_name}`);
                    } else {
                      setAffairManager('Manager inconnu');
                    }
                  });
                } else if (managerRelation.directus_users_id) {
                  setAffairManager(
                    `${managerRelation.directus_users_id.first_name} ${managerRelation.directus_users_id.last_name}`
                  );
                } else setAffairManager('Manager inconnu');
              }
            } else setAffairManager('Manager inconnu');
          } else setAffairManager('Manager inconnu');
        });
      }
    }
  }, [affair.affairs_directus_users_ids, users]);

  return (
    <ShadowCard>
      <div className={styles.affairCard}>
        <div className={styles.body}>
          <h4 className={styles.title}>{name ? capitalize(name) : 'Affaire'}</h4>
          <span>{affairManager}</span>
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
