import { ProgressBar, ShadowCard } from '@projex/ui';
import { GdpAffairModel } from '../../../models/GestionDeProjets/GdpAffairModel';
import styles from '../AffairCard/AffairCard.module.scss';
import { capitalize } from '../../../utils/capitalize';
import Image from 'next/image';
import { getImagesByCompany } from '../../../utils/getImagesByCompany';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCompanyEntities } from '../../../store/reducers/companyEntitiesReducer';
import { selectUsers } from '../../../store/reducers/usersReducer';
import { GdpAffairsUsersModel } from '../../../models/GestionDeProjets/GdpAffairsUsersModel';
import { getUsUser } from '../../../services/userService/UsUsers';
import { getGdpAffairsUsers } from '../../../services/gestionDeProjets/GdpAffairsUsers';
import { GdpSatisfactionModel } from '../../../models/GestionDeProjets/GdpSatisfactionModel';

interface PreviewAffairSatisfactionCardProps {
  affair: Partial<GdpAffairModel>;
  satisfactions: Partial<GdpSatisfactionModel>[];
}

const PreviewAffairSatisfactionCard = ({ affair, satisfactions }: PreviewAffairSatisfactionCardProps) => {
  const total = 4;

  const companyEntities = useSelector(selectCompanyEntities);
  const users = useSelector(selectUsers);

  const [affairCompanyEntity, setAffairCompanyEntity] = useState<string>('Entité inconnue');
  const [affairManager, setAffairManager] = useState<string>('Manager inconnu');

  const score =
    satisfactions.reduce(
      (acc, satisfaction) => acc + (satisfaction.score_hard_skills ? satisfaction.score_hard_skills : 0),
      0
    ) / satisfactions.length;

  const getColor = () => {
    if (score <= total / 3) return 'alert';
    if (score >= total / 3 && score <= (total / 3) * 2) return 'warning';
    if (score >= (total / 3) * 2) return 'ok';
  };

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
  }, [affair?.company_entity, companyEntities]);

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
          <h4 className={styles.title}>{affair.name ? capitalize(affair.name) : 'Affaire'}</h4>
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
          <span>Satisfaction moyenne de l&apos;affaire</span>
          <ProgressBar percentage={isNaN((score / total) * 100) ? 0 : (score / total) * 100} color={getColor()} tiny />
        </div>
      </div>
    </ShadowCard>
  );
};

export default PreviewAffairSatisfactionCard;
