import { DropdownFilter, FilterBar } from '@projex/ui';
import React, { useState } from 'react';

type SelectedValues = {
  categoryName: string;
  key: (string | number)[];
}[];
type DataCategory = {
  categoryName: string;
  options: {
    key: number | string;
    name: string;
  }[];
};

const Projects = () => {
  const data: DataCategory[] = [
    {
      categoryName: 'Projets',
      options: [
        { key: 'key1', name: 'projet de truc' },
        { key: 'key2', name: 'projet de machin' },
      ],
    },
    {
      categoryName: 'Entités',
      options: [
        { key: 'key3', name: 'Probim' },
        { key: 'key4', name: 'ezarze' },
        { key: 'key12', name: 'gtrgrt' },
      ],
    },
    {
      categoryName: 'Affaires',
      options: [
        { key: 'key5', name: 'Affaire truc' },
        { key: 'key6', name: 'affaire bidule' },
        { key: 'key7', name: 'Client protruc' },
        { key: 'rzeezrez', name: 'client fru' },
        { key: 'zerze', name: 'Client protruc' },
        { key: 'fdsfsd', name: 'client fru' },
        { key: 'zaeaz', name: 'Client protruc' },
        { key: 'jytukyu', name: 'client fru' },
        { key: 'azezz', name: 'Client protruc' },
        { key: 'grfegrez', name: 'client fru' },
        { key: 'liolmio', name: 'Client protruc' },
        { key: 'rezrze', name: 'client fru' },
        { key: 'grzeterz', name: 'Affaire truc' },
        { key: 'gfdjuykk', name: 'affaire bidule' },
        { key: 'aezrzar', name: 'Client protruc' },
        { key: 'htyrhtyre', name: 'client fru' },
        { key: 'hjgkhj', name: 'Client protruc' },
        { key: 'jytrjtyrj', name: 'client fru' },
        { key: 'fqsrttyuy', name: 'Client protruc' },
        { key: 'aezzarterth', name: 'client fru' },
        { key: 'htrhjkyuilyio', name: 'Client protruc' },
        { key: 'earaetyhtyrujrty', name: 'client fru' },
        { key: 'jkuyilio', name: 'Client protruc' },
        { key: 'vsfgsr', name: 'client fru' },
      ],
    },
    {
      categoryName: 'Clients',
      options: [
        { key: 'key7', name: 'Client protruc' },
        { key: 'key8', name: 'client fru' },
        { key: 'aaa', name: 'Client protruc' },
        { key: 'aaaee', name: 'client fru' },
        { key: 'rzerez', name: 'Client protruc' },
        { key: 'dfdd', name: 'client fru' },
        { key: 'jytjy', name: 'Client protruc' },
        { key: 'vdfvfd', name: 'client fru' },
        { key: 'arterg', name: 'Client protruc' },
        { key: 'ezrze', name: 'client fru' },
      ],
    },
  ];

  const [filtersSelection, setFiltersSelection] = useState<SelectedValues>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  return (
    <>
      <FilterBar>
        <div>
          <DropdownFilter
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filtersSelection={filtersSelection}
          />
        </div>
        <div>Autres select ?</div>
      </FilterBar>
    </>
  );
};

export default Projects;
