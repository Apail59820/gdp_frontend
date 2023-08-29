import React, { useEffect, useState } from 'react';
import styles from './GlobalFiltersDataSelector.module.scss';
import { Button, ShadowCard, Input } from 'projex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { selectGlobalFilters, setGlobalFilters } from '../../../../store/reducers/globalFilterReducer';
import { AppState } from '../../../../store/store';
import { GlobalFiltersModel } from '../../../../models/GlobalFiltersModel';
import { getGdpProjects } from '../../../../services/gestionDeProjets/GdpProjects';
import { getGdpAffairs } from '../../../../services/gestionDeProjets/GdpAffairs';
import { getUsUsers } from '../../../../services/userService/UsUsers';
import getConfig from 'next/config';
import { QueryParameters } from '../../../../models/DirectusModel';
import { getGdpPythagoreAffaires } from '../../../../services/gestionDeProjets/GdpPythagoreAffairs';
import { selectCompanyEntities } from '../../../../store/reducers/companyEntitiesReducer';
import { UsCompanyEntityModel } from '../../../../models/UserService/UsCompanyEntityModel';
import { isRequestSuccessful } from '../../../../utils/isRequestSuccessful';
import { formatUserName } from '../../../../utils/formatUserName';
import { getUsClientsCompanyEntities } from '../../../../services/userService/UsClientsCompanyEntities';

const { publicRuntimeConfig } = getConfig();

//TODO Je ne sais pas quoi en faire ? Les remplacer peut être ou les bouger. En plus, ils sont moches
const circlePlus = (
  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 0.25C3.11719 0.25 0 3.39453 0 7.25C0 11.1328 3.11719 14.25 7 14.25C10.8555 14.25 14 11.1328 14 7.25C14 3.39453 10.8555 0.25 7 0.25ZM7 13.375C3.60938 13.375 0.875 10.6406 0.875 7.25C0.875 3.88672 3.60938 1.125 7 1.125C10.3633 1.125 13.125 3.88672 13.125 7.25C13.125 10.6406 10.3633 13.375 7 13.375ZM9.625 6.8125H7.4375V4.625C7.4375 4.40625 7.21875 4.1875 7 4.1875C6.75391 4.1875 6.5625 4.40625 6.5625 4.625V6.8125H4.375C4.12891 6.8125 3.9375 7.03125 3.9375 7.25C3.9375 7.49609 4.12891 7.6875 4.375 7.6875H6.5625V9.875C6.5625 10.1211 6.75391 10.3125 7 10.3125C7.21875 10.3125 7.4375 10.1211 7.4375 9.875V7.6875H9.625C9.84375 7.6875 10.0625 7.49609 10.0625 7.25C10.0625 7.03125 9.84375 6.8125 9.625 6.8125Z"
      fill="#333333"
    />
  </svg>
);
const circleMinus = (
  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      opacity="0.4"
      d="M9.625 6.8125H4.375C4.12891 6.8125 3.9375 7.03125 3.9375 7.25C3.9375 7.49609 4.12891 7.6875 4.375 7.6875H9.625C9.84375 7.6875 10.0625 7.49609 10.0625 7.25C10.0625 7.03125 9.84375 6.8125 9.625 6.8125ZM7 0.25C3.11719 0.25 0 3.39453 0 7.25C0 11.1328 3.11719 14.25 7 14.25C10.8555 14.25 14 11.1328 14 7.25C14 3.39453 10.8555 0.25 7 0.25ZM7 13.375C3.60938 13.375 0.875 10.6406 0.875 7.25C0.875 3.88672 3.60938 1.125 7 1.125C10.3633 1.125 13.125 3.88672 13.125 7.25C13.125 10.6406 10.3633 13.375 7 13.375Z"
      fill="#333333"
    />
  </svg>
);
const chevron = (
  <svg
    className={styles.chevron}
    width="7"
    height="12"
    viewBox="0 0 7 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.992188 11.1562C0.898438 11.0859 0.851562 10.9922 0.851562 10.8984C0.851562 10.8047 0.898438 10.7109 0.96875 10.6406L5.21094 6.02344L0.96875 1.38281C0.828125 1.24219 0.828125 1.00781 0.992188 0.867188C1.13281 0.726562 1.36719 0.726562 1.50781 0.890625L6.00781 5.76562C6.14844 5.90625 6.14844 6.11719 6.00781 6.25781L1.50781 11.1328C1.36719 11.2969 1.13281 11.2969 0.992188 11.1562Z"
      fill="#333333"
    />
  </svg>
);

enum CategoryEnum {
  PROJECTS = 'Projet',
  AFFAIRS = 'Affaire',
  PYTHAGORE_AFFAIRE = 'Affaire Pythagore',
  CLIENTS = 'Client',
  CLIENT_COMPANY_ENTITIES = 'Entité Cliente',
  COLLABORATORS = 'Collaborateur',
  COMPANY_ENTITIES = 'Entité Groupe',
}

enum CategoryEnumPlural {
  PROJECTS = 'Projets',
  AFFAIRS = 'Affaires',
  PYTHAGORE_AFFAIRE = 'Affaires Pythagore',
  CLIENTS = 'Clients',
  CLIENT_COMPANY_ENTITIES = 'Entités Clientes',
  COLLABORATORS = 'Collaborateurs',
  COMPANY_ENTITIES = 'Entités Groupe',
}

/**
 * key name pair that represent an element
 */
type CategoryValue = {
  name: string;
  key: string | number;
};
type CategoryName = { singular: CategoryEnum; plural: CategoryEnumPlural };
type Category = {
  name: CategoryName;
  values: CategoryValue[];
};

//prevent search input to trigger multiple requests by cancelling requests while user is typing
let timerSearch: NodeJS.Timeout;

const GlobalFiltersDataSelector = () => {
  const globalFilters = useSelector<AppState, GlobalFiltersModel>(selectGlobalFilters);
  const companyEntities = useSelector<AppState, Partial<UsCompanyEntityModel>[]>(selectCompanyEntities);
  const dispatch = useDispatch();

  const [isDropdownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] = useState<Category[]>(
    [
      {
        name: { singular: CategoryEnum.PROJECTS, plural: CategoryEnumPlural.PROJECTS },
        values: globalFilters.projects.listWithNames,
      },
      {
        name: { singular: CategoryEnum.CLIENT_COMPANY_ENTITIES, plural: CategoryEnumPlural.CLIENT_COMPANY_ENTITIES },
        values: globalFilters.clients_company_entities.listWithNames,
      },
      {
        name: { singular: CategoryEnum.AFFAIRS, plural: CategoryEnumPlural.AFFAIRS },
        values: globalFilters.affairs.listWithNames,
      },
      {
        name: { singular: CategoryEnum.PYTHAGORE_AFFAIRE, plural: CategoryEnumPlural.PYTHAGORE_AFFAIRE },
        values: globalFilters.pythagore_affaires.listWithNames,
      },
      {
        name: { singular: CategoryEnum.CLIENTS, plural: CategoryEnumPlural.CLIENTS },
        values: globalFilters.clients.listWithNames,
      },
      {
        name: { singular: CategoryEnum.COLLABORATORS, plural: CategoryEnumPlural.COLLABORATORS },
        values: globalFilters.collaborators.listWithNames,
      },
      {
        name: { singular: CategoryEnum.COMPANY_ENTITIES, plural: CategoryEnumPlural.COMPANY_ENTITIES },
        values: globalFilters.company_entities.listWithNames,
      },
    ].filter((c) => c.values.length > 0)
  );
  const [data, setData] = useState<Category[]>([
    {
      name: { singular: CategoryEnum.PROJECTS, plural: CategoryEnumPlural.PROJECTS },
      values: [],
    },
    {
      name: { singular: CategoryEnum.CLIENT_COMPANY_ENTITIES, plural: CategoryEnumPlural.CLIENT_COMPANY_ENTITIES },
      values: [],
    },
    {
      name: { singular: CategoryEnum.AFFAIRS, plural: CategoryEnumPlural.AFFAIRS },
      values: [],
    },
    {
      name: { singular: CategoryEnum.PYTHAGORE_AFFAIRE, plural: CategoryEnumPlural.PYTHAGORE_AFFAIRE },
      values: [],
    },
    {
      name: { singular: CategoryEnum.CLIENTS, plural: CategoryEnumPlural.CLIENTS },
      values: [],
    },
    {
      name: { singular: CategoryEnum.COLLABORATORS, plural: CategoryEnumPlural.COLLABORATORS },
      values: [],
    },
    {
      name: { singular: CategoryEnum.COMPANY_ENTITIES, plural: CategoryEnumPlural.COMPANY_ENTITIES },
      values: companyEntities
        .filter((c) => typeof c.name == 'string' && typeof c.id == 'number')
        .map((c) => ({ name: c.name as string, key: c.id as number })),
    },
  ]);
  const [currentCategoryTab, setCurrentCategoryTab] = useState<number>(0);
  const [searchInput, setSearchInput] = useState<string[]>(data.map((c) => ''));

  useEffect(() => {
    setData([
      ...data.filter((category) => category.name.singular !== CategoryEnum.COMPANY_ENTITIES),
      {
        name: { singular: CategoryEnum.COMPANY_ENTITIES, plural: CategoryEnumPlural.COMPANY_ENTITIES },
        values: companyEntities
          .filter((c) => typeof c.name == 'string' && typeof c.id == 'number')
          .map((c) => ({ name: c.name as string, key: c.id as number })),
      },
    ]);
  }, [companyEntities]);

  useEffect(() => {
    if (isDropdownOpen && data[currentCategoryTab].values.length === 0 && searchInput[currentCategoryTab] === '')
      retrieveCategoryValues(data[currentCategoryTab].name.singular, searchInput[currentCategoryTab]);
  }, [currentCategoryTab, isDropdownOpen]);

  async function retrieveCategoryValues(categoryName: string, searchInput: string) {
    let response;
    const queryParameters: QueryParameters = { search: searchInput, offset: '0', limit: '100' };
    switch (categoryName) {
      case CategoryEnum.PROJECTS:
        const projectsResponse = await getGdpProjects(queryParameters);
        if (isRequestSuccessful(projectsResponse.status) && projectsResponse.data)
          response = projectsResponse.data.map((project) => ({
            name: project.name as string,
            key: project.id as number,
          }));
        break;
      case CategoryEnum.AFFAIRS:
        const affairsResponse = await getGdpAffairs(queryParameters);
        if (isRequestSuccessful(affairsResponse.status) && affairsResponse.data)
          response = affairsResponse.data.map((affair) => ({ name: affair.name as string, key: affair.id as number }));
        break;
      case CategoryEnum.PYTHAGORE_AFFAIRE:
        const pythagoreAffairsResponse = await getGdpPythagoreAffaires(queryParameters);
        if (isRequestSuccessful(pythagoreAffairsResponse.status) && pythagoreAffairsResponse.data)
          response = pythagoreAffairsResponse.data.map((affair) => ({
            name: affair.libelle_affaire as string,
            key: affair.numero_affaire as string,
          }));
        break;
      case CategoryEnum.CLIENTS:
        const clientsResponse = await getUsUsers({
          ...queryParameters,
          filter: { role: { _eq: publicRuntimeConfig.ROLE_CLIENT_ID } },
        });
        if (isRequestSuccessful(clientsResponse.status) && clientsResponse.data)
          response = clientsResponse.data.map((client) => ({ name: formatUserName(client), key: client.id as string }));
        break;
      case CategoryEnum.CLIENT_COMPANY_ENTITIES:
        const clientsEntitiesResponse = await getUsClientsCompanyEntities(queryParameters);
        if (isRequestSuccessful(clientsEntitiesResponse.status) && clientsEntitiesResponse.data)
          response = clientsEntitiesResponse.data.map((clientEntity) => ({
            name: clientEntity.name as string,
            key: clientEntity.id as number,
          }));
        break;
      case CategoryEnum.COLLABORATORS:
        const collaboratorsResponse = await getUsUsers({
          ...queryParameters,
          filter: { role: { _eq: publicRuntimeConfig.ROLE_COLLABORATOR_ID } },
        });
        if (isRequestSuccessful(collaboratorsResponse.status) && collaboratorsResponse.data)
          response = collaboratorsResponse.data.map((collaborator) => ({
            name: formatUserName(collaborator),
            key: collaborator.id as string,
          }));
        break;
    }
    const categoryIndex = data.findIndex((c) => c.name.singular === categoryName);
    const newData = [...data];
    newData[categoryIndex].values = response || [];
    setData(newData);
  }

  function onSearchInputChange(newInput: string, categoryIndex: number) {
    const categoryName = data[categoryIndex].name.singular;
    if (categoryName === CategoryEnum.COMPANY_ENTITIES) return;

    const newSearchInput = [...searchInput];
    newSearchInput[categoryIndex] = newInput;
    setSearchInput(newSearchInput);

    clearTimeout(timerSearch);
    timerSearch = setTimeout(() => {
      retrieveCategoryValues(categoryName, newInput);
    }, 1000);
  }

  function SelectedValuesToText() {
    const filters = selectedValues
      .filter((category) => category.values.length > 0)
      .map(
        (value) =>
          `${value.values.length} ${
            value.values.length > 1 ? value.name.plural.toLowerCase() : value.name.singular.toLowerCase()
          }`
      );
    return filters.length > 0 ? filters.join(', ') : 'Toutes les données';
  }

  const onSelect = (item: CategoryValue, categoryName: CategoryName) => {
    const otherSelectedCategories = selectedValues.filter(
      (selectedCategory) => selectedCategory.name.singular !== categoryName.singular
    );
    const oldCategoryValues = selectedValues.find(
      (selectedCategory) => selectedCategory.name.singular === categoryName.singular
    )?.values;
    const newCategoryValues = {
      name: categoryName,
      values:
        oldCategoryValues && oldCategoryValues.length > 0 ? Array.from(new Set([item, ...oldCategoryValues])) : [item],
    };
    const selection = [...otherSelectedCategories, newCategoryValues];
    setSelectedValues(selection);
  };

  const onDeselect = (item: CategoryValue, categoryName: CategoryName) => {
    const otherSelectedCategories = selectedValues.filter(
      (selectedCategory) => selectedCategory.name.singular !== categoryName.singular
    );
    const oldCategoryValues = selectedValues.find(
      (selectedCategory) => selectedCategory.name.singular === categoryName.singular
    )?.values;
    const newCategoryValues = {
      name: categoryName,
      values:
        oldCategoryValues && oldCategoryValues.length > 0
          ? oldCategoryValues.filter((value) => value.key !== item.key)
          : [],
    };
    setSelectedValues([...otherSelectedCategories, newCategoryValues].filter((category) => category.values.length > 0));
  };

  const isSelected = (itemToCheck: CategoryValue, itemCategoryName: CategoryName): boolean => {
    return !selectedValues.some(
      (category) =>
        category.name.singular === itemCategoryName.singular &&
        category.values.some((categoryItem) => categoryItem.key === itemToCheck.key)
    );
  };

  function onOptionClick(item: CategoryValue, categoryName: CategoryName) {
    isSelected(item, categoryName) ? onSelect(item, categoryName) : onDeselect(item, categoryName);
  }

  function saveSelection() {
    let newGlobalFilters: GlobalFiltersModel = {
      projects: {
        ...globalFilters.projects,
        list: (selectedValues.find((category) => category.name.singular === CategoryEnum.PROJECTS)?.values || []).map(
          (item) => item.key as number
        ),
        listWithNames:
          selectedValues.find((category) => category.name.singular === CategoryEnum.PROJECTS)?.values || [],
      },
      affairs: {
        ...globalFilters.affairs,
        list: (selectedValues.find((category) => category.name.singular === CategoryEnum.AFFAIRS)?.values || []).map(
          (item) => item.key as number
        ),
        listWithNames: selectedValues.find((category) => category.name.singular === CategoryEnum.AFFAIRS)?.values || [],
      },
      pythagore_affaires: {
        ...globalFilters.pythagore_affaires,
        list: (
          selectedValues.find((category) => category.name.singular === CategoryEnum.PYTHAGORE_AFFAIRE)?.values || []
        ).map((item) => item.key as string),
        listWithNames:
          selectedValues.find((category) => category.name.singular === CategoryEnum.PYTHAGORE_AFFAIRE)?.values || [],
      },
      files: {
        ...globalFilters.files,
      },
      satisfaction: {
        ...globalFilters.satisfaction,
      },
      clients: {
        ...globalFilters.clients,
        list: (selectedValues.find((category) => category.name.singular === CategoryEnum.CLIENTS)?.values || []).map(
          (item) => item.key as string
        ),
        listWithNames: selectedValues.find((category) => category.name.singular === CategoryEnum.CLIENTS)?.values || [],
      },
      collaborators: {
        ...globalFilters.collaborators,
        list: (
          selectedValues.find((category) => category.name.singular === CategoryEnum.COLLABORATORS)?.values || []
        ).map((item) => item.key as string),
        listWithNames:
          selectedValues.find((category) => category.name.singular === CategoryEnum.COLLABORATORS)?.values || [],
      },
      company_entities: {
        ...globalFilters.company_entities,
        list: (
          selectedValues.find((category) => category.name.singular === CategoryEnum.COMPANY_ENTITIES)?.values || []
        ).map((item) => item.key as number),
        listWithNames:
          selectedValues.find((category) => category.name.singular === CategoryEnum.COMPANY_ENTITIES)?.values || [],
      },
      clients_company_entities: {
        ...globalFilters.clients_company_entities,
        list: (
          selectedValues.find((category) => category.name.singular === CategoryEnum.CLIENT_COMPANY_ENTITIES)?.values ||
          []
        ).map((item) => item.key as number),
        listWithNames:
          selectedValues.find((category) => category.name.singular === CategoryEnum.CLIENT_COMPANY_ENTITIES)?.values ||
          [],
      },
    };
    dispatch(setGlobalFilters(newGlobalFilters));
    setIsDropDownOpen(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.button} onClick={() => setIsDropDownOpen(!isDropdownOpen)}>
        <div className={styles.buttonText}>
          <span className={styles.buttonTitle}>Données affichées</span>
          {selectedValues.length > 0 ? (
            <div className={styles.buttonText}>
              <span className={`text-tiny ${styles.selectedCategories}`}>{SelectedValuesToText()}</span>
            </div>
          ) : null}
        </div>
        <button className={`${styles.buttonIcon} ${isDropdownOpen ? styles.open : ''}`}>
          <svg width="17" height="9" viewBox="0 0 17 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16.5742 7.88672C16.4688 8.02734 16.3281 8.0625 16.1875 8.0625C16.0469 8.0625 15.9062 8.02734 15.8008 7.92188L8.875 1.52344L1.91406 7.88672C1.70312 8.09766 1.35156 8.09766 1.14062 7.85156C0.929688 7.64062 0.929688 7.28906 1.17578 7.07812L8.48828 0.328125C8.69922 0.117188 9.01562 0.117188 9.22656 0.328125L16.5391 7.07812C16.7852 7.32422 16.7852 7.67578 16.5742 7.88672Z"
              fill="black"
            />
          </svg>
        </button>
      </div>
      <div className={`${styles.filtersDropDown} ${isDropdownOpen ? styles.open : styles.closed}`}>
        <ShadowCard>
          <div className={styles.filtersContainer}>
            <div className={styles.categoriesContainer}>
              {data.map((category, index) => (
                <button
                  key={category.name.singular}
                  className={`text-small ${styles.categoryButton} ${index === currentCategoryTab ? styles.active : ''}`}
                  onClick={() => setCurrentCategoryTab(index)}
                >
                  <div className={styles.categoryName}>{category.name.plural}</div>
                  {chevron}
                </button>
              ))}
            </div>
            <div className={styles.dataContainer}>
              {data[currentCategoryTab].name.singular !== CategoryEnum.COMPANY_ENTITIES && (
                <Input
                  type="search"
                  value={searchInput[currentCategoryTab]}
                  placeholder={'Rechercher'}
                  setValue={(value) => onSearchInputChange(`${value}`, currentCategoryTab)}
                />
              )}
              <ul className={styles.optionsList}>
                {data.length > 0 &&
                  data[currentCategoryTab]?.values.map((item) => (
                    <li key={item.key} onClick={() => onOptionClick(item, data[currentCategoryTab].name)}>
                      {isSelected(item, data[currentCategoryTab].name) ? circlePlus : circleMinus}
                      <span
                        className={`${isSelected(item, data[currentCategoryTab].name) ? '' : styles.dataItemSelected}`}
                      >
                        {item.name}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
            <div className={styles.selectionContainer}>
              <h3 className={styles.title}>Sélection</h3>
              <div className={styles.selectedItems}>
                {selectedValues.length > 0
                  ? selectedValues.map((categorySelectedKeys, index) => (
                      <div key={index} className={styles.selectionCategory}>
                        <div className={styles.selectionCategoryTitle}>
                          {categorySelectedKeys.values.length + ' '}
                          {categorySelectedKeys.values.length > 1
                            ? categorySelectedKeys.name.plural
                            : categorySelectedKeys.name.singular}
                        </div>

                        <ul className={styles.dataItemContainer}>
                          {categorySelectedKeys.values.map((item) => (
                            <li
                              className={styles.dataItem}
                              onClick={() => onOptionClick(item, categorySelectedKeys.name)}
                              key={item.key}
                            >
                              {circleMinus}
                              <span>{item.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  : 'Aucun filtre sélectionné'}
              </div>
              <div className={styles.submitButtonContainer}>
                <Button small onClick={() => saveSelection()}>
                  Confirmer
                </Button>
              </div>
            </div>
          </div>
        </ShadowCard>
      </div>
    </div>
  );
};

export default GlobalFiltersDataSelector;
