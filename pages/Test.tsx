import React, { useState } from 'react';
import { DateTime } from 'luxon';
import { GdpPythagoreFactureModel } from '../models/GestionDeProjets/GdpPythagoreFactureModel';
import {
  GdpProjectsModel,
  GdpProjectStatusEnum,
  GdpProjectTypesEnum,
} from '../models/GestionDeProjets/GdpProjectsModel';
import BillingTable from '../src/components/BillingTable/BillingTable';
import FilesTable from '../src/components/FilesTable/FilesTable';
import { GdpFilesModel, GdpFilesStatusEnum } from '../models/GestionDeProjets/GdpFilesModel';
import CreateAffairForm from '../src/components/CreateAffairForm/CreateAffairForm';
import CreatePhaseForm from '../src/components/CreatePhaseForm/CreatePhaseForm';
import { GdpPhaseModel, GdpPhaseStatusEnum } from '../models/GestionDeProjets/GdpPhaseModel';
import ConfigureFacturationForm from '../src/components/ConfigureFacturationForm/ConfigureFacturationForm';
import { GdpAffairModel } from '../models/GestionDeProjets/GdpAffairModel';
import CreateProjectForm from '../src/components/CreateProjectForm/CreateProjectForm';
import ManageAffairManagerForm from '../src/components/ManageAffairManagerForm/ManageAffairManagerForm';
import ManageAffairUsersForm from '../src/components/ManageAffairUsersForm/ManageAffairUsersForm';
import { UsUserModel } from '../models/UserService/UsUserModel';
import UserNoteForm from '../src/components/UserNoteForm/UserNoteForm';
/*const assetList: GdpFilesModel[] = [ { id: '1', title: 'File test', type: 'jpg', uploaded_on: DateTime.now().toJSDate(), filename_download: 'Fichier test', status: GdpFilesStatusEnum.VISIBLE, }, { id: '3', title: 'File test 3', type: 'pdf', uploaded_on: DateTime.fromISO('2023-01-02').toJSDate(), filename_download: 'Fichier test 2', status: GdpFilesStatusEnum.VISIBLE, }, { id: '2', title: 'File test 2', type: 'png', uploaded_on: DateTime.fromISO('2023-01-02').toJSDate(), filename_download: 'Fichier test 2', status: GdpFilesStatusEnum.HIDDEN, },];*/ /*const billingList: GdpPythagoreFactureModel[] = [ { num_facture: '1', libelle_affaire: 'Affaire Test', soldeht_facture: 130.5, soldettc_facture: 160, date_echeance_facture: DateTime.now().toISODate(), date_dernier_paiement_facture: DateTime.now().toISODate(), montant_totalht_facture: 13, montant_totalttc_facture: 15, reglement_cumulettc_facture: 13, reglement_cumuleht_facture: 15, type_facture: 'Facture', statut_facture: 'NonEchue', etatreglt_facture: 'RegltPartiel', nom_fichierpdf_facture: null, code_client: 'fdqd', num_affaire: { numero_affaire: '123', libelle_affaire: 'Test', nom_client: 'Test', date_derniere_valid_facture: DateTime.now().toJSDate(), code_client: 'fdqd', affairs_id: [ { id: 1, pythagore_affaires_id: '1', activities_id: [1], affairs_id: { id: 1, name: 'Afaire Test', user_created: 'cazesd', user_updated: 'efsqds', date_created: DateTime.now().toJSDate(), date_updated: DateTime.now().toJSDate(), company_entity: 1, affairs_directus_users_ids: [ { id: '1', directus_users_id: '03fe2d11-5f1d-42bb-aaf4-faff99cd0efd', show_notifications: false, project_manager: false, affairs_id: 1, activities_id: [], }, ], projects_id: { id: '1', name: 'Project Test', client_company_name: null, client_info: null, address: null, zip_code: null, city: null, country: null, status: GdpProjectStatusEnum.ACTIVE, project_type: GdpProjectTypesEnum.SOUS_TRAITANCE, user_created: '123', user_updated: '123', date_created: DateTime.now().toJSDate(), date_updated: DateTime.now().toJSDate(), company_entity: 1, files: [], affairs: [1], activities_id: [], projects_directus_users_clients_ids: [ { id: '1', directus_users_id: { id: '123', password: '***', email: 'xibade3241@jobsfeel.com', first_name: 'Temp', last_name: 'Mail', }, projects_id: 1, show_notifications: false, activities_id: [], }, ], projects_directus_users_collaborators_ids: [ { id: '1', directus_users_id: '1234', projects_id: 1, show_notifications: false, activities_id: [] }, ], }, pythagore_ids: [], files: [], activities_id: [], affairs_satisfaction: [], }, }, ], }, }, { num_facture: '2', libelle_affaire: 'Affaire Test', soldeht_facture: 130.5, soldettc_facture: 160, date_echeance_facture: DateTime.fromISO('2023-01-12').toISODate(), date_dernier_paiement_facture: DateTime.now().toISODate(), montant_totalht_facture: 19, montant_totalttc_facture: 15, reglement_cumulettc_facture: 13, reglement_cumuleht_facture: 15, type_facture: 'Facture', statut_facture: 'NonEchue', etatreglt_facture: 'Reglee', nom_fichierpdf_facture: null, code_client: 'fdqd', num_affaire: { numero_affaire: '123', libelle_affaire: 'Test', nom_client: 'Test', date_derniere_valid_facture: DateTime.now().toJSDate(), code_client: 'fdqd', affairs_id: [ { id: 1, pythagore_affaires_id: '1', activities_id: [1], affairs_id: { id: 1, name: 'Afaire Test', user_created: 'cazesd', user_updated: 'efsqds', date_created: DateTime.now().toJSDate(), date_updated: DateTime.now().toJSDate(), company_entity: 1, affairs_directus_users_ids: [ { id: '1', directus_users_id: '03fe2d11-5f1d-42bb-aaf4-faff99cd0efd', show_notifications: false, project_manager: false, affairs_id: 1, activities_id: [], }, ], projects_id: { id: '1', name: 'Project Test', client_company_name: null, client_info: null, address: null, zip_code: null, city: null, country: null, status: GdpProjectStatusEnum.ACTIVE, project_type: GdpProjectTypesEnum.SOUS_TRAITANCE, user_created: '123', user_updated: '123', date_created: DateTime.now().toJSDate(), date_updated: DateTime.now().toJSDate(), company_entity: 1, files: [], affairs: [1], activities_id: [], projects_directus_users_clients_ids: [ { id: '1', directus_users_id: '1234', projects_id: 1, show_notifications: false, activities_id: [] }, ], projects_directus_users_collaborators_ids: [ { id: '1', directus_users_id: '1234', projects_id: 1, show_notifications: false, activities_id: [] }, ], }, pythagore_ids: [], files: [], activities_id: [], affairs_satisfaction: [], }, }, ], }, },];*/
const project: Partial<GdpProjectsModel> = {
  id: 1,
  name: 'Test Projet',
  client_company_name: 'fe',
  client_info: null,
  address: null,
  zip_code: null,
  city: null,
  country: null,
  status: undefined,
  project_type: undefined,
  company_entity: undefined,
  user_created: '1e5aba69-2a18-4a13-b6f1-57e0d6d45d7a',
  user_updated: null,
  date_created: new Date(),
  date_updated: null,
  affairs_ids: [1, 2],
  files: [],
  projects_directus_users_clients_ids: [],
  projects_directus_users_collaborators_ids: ['1'],
};
const affair: GdpAffairModel = {
  id: 1,
  name: 'Afaire Test',
  user_created: 'cazesd',
  user_updated: 'efsqds',
  date_created: DateTime.now().toJSDate(),
  date_updated: DateTime.now().toJSDate(),
  company_entity: 1,
  affairs_directus_users_ids: [
    {
      id: '1',
      directus_users_id: '03fe2d11-5f1d-42bb-aaf4-faff99cd0efd',
      show_notifications: false,
      project_manager: false,
      affairs_id: 1,
      activities_id: [],
    },
    {
      id: '2',
      directus_users_id: 'd3297493-5a91-4eba-8de2-cb398554cedd',
      show_notifications: false,
      project_manager: true,
      affairs_id: 1,
      activities_id: [],
    },
    {
      id: '3',
      directus_users_id: 'a4597493-5a91-4eba-8de2-cb398554cedd',
      show_notifications: false,
      project_manager: false,
      affairs_id: 1,
      activities_id: [],
    },
    {
      id: '4',
      directus_users_id: 'a9097493-5a91-4eba-8de2-cb398554cedd',
      show_notifications: false,
      project_manager: false,
      affairs_id: 1,
      activities_id: [],
    },
  ],
  projects_id: 1,
  /*{ id: 1, name: 'Project Test', client_company_name: null, client_info: null, address: null, zip_code: null, city: null, country: null, status: GdpProjectStatusEnum.ACTIVE, project_type: GdpProjectTypesEnum.SOUS_TRAITANCE, user_created: '123', user_updated: '123', date_created: DateTime.now().toJSDate(), date_updated: DateTime.now().toJSDate(), company_entity: 1, files: [], affairs_ids: [1], activities_id: [], projects_directus_users_clients_ids: [ { id: 1, directus_users_id: 'd3297493-5a91-4eba-8de2-cb398554cedd', projects_id: 1, show_notifications: false, activities_id: [], }, ], projects_directus_users_collaborators_ids: [ { id: '1', directus_users_id: '1234', projects_id: 1, show_notifications: false, activities_id: [] }, ], }*/ pythagore_ids:
    [
      { id: 3, pythagore_affaires_id: 'TEST-PYTH-1', affairs_id: 1, activities_id: [] },
      { id: 5, pythagore_affaires_id: 'TEST-PYTH-2', affairs_id: 1, activities_id: [] },
    ],
  files: [],
  activities_id: [],
  affairs_satisfaction: [],
};
const phase: GdpPhaseModel = {
  id: 1,
  name: 'Phase Test',
  description: 'Description',
  user_created: 'cazesd',
  status: GdpPhaseStatusEnum.ONGOING,
};
const user: Partial<UsUserModel> = {
  id: '123',
  password: '***',
  email: 'xibade3241@jobsfeel.com',
  first_name: 'Temp',
  last_name: 'Mail',
};
const Test = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      {' '}
      {/*<BillingTable data={billingList} />*/} {/*<FilesTable filesList={assetList} />*/}{' '}
      <button onClick={() => setIsModalOpen(true)}>Ouvrir</button>{' '}
      {/*<CreateAffairForm project={project} isOpen={isModalOpen} setIsOpen={setIsModalOpen} affair={affair} />*/}{' '}
      {/*<CreatePhaseForm project={project} affair={affair} isOpen={isModalOpen} setIsOpen={setIsModalOpen} phase={phase} />*/}{' '}
      {/*<ConfigureFacturationForm isOpen={isModalOpen} setIsOpen={setIsModalOpen} initProject={project} // initAffair={affair} />*/}{' '}
      {/*<CreateProjectForm isOpen={isModalOpen} setIsOpen={setIsModalOpen} project={project} />*/}{' '}
      {/*<ManageAffairManagerForm isOpen={isModalOpen} setIsOpen={setIsModalOpen} affair={affair} />*/}{' '}
      <ManageAffairUsersForm
        affair={affair}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        userType={'collaborator'}
      />{' '}
      {/*<UserNoteForm isOpen={isModalOpen} setIsOpen={setIsModalOpen} user={user} />*/}{' '}
    </div>
  );
};
export default Test;
