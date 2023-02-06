import React, { useEffect, useState } from 'react';
import styles from './ProjectsList.module.scss';
import Link from 'next/link';
import { capitalize } from '../../utils/capitalize';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ProjectModel } from '../../models/ProjectModel';
import { CompanyEnum } from '../../models/CompanyEnum';

interface DataType {
  key: string;
  project_name: React.ReactNode;
  client_name: string;
  company_entity: string;
  project_managers: string[];
  description: React.ReactNode;
}

type Props = {
  projects: ProjectModel[];
};

const ProjectsList = ({ projects }: Props) => {
  const [formattedData, setFormattedData] = useState<DataType[]>([]);

  const renderCompanyEntity = (companyEntity: string): React.ReactNode => {
    switch (companyEntity) {
      case CompanyEnum.PROJEX:
        return <span className="projex">{capitalize(CompanyEnum.PROJEX)}</span>;
      case CompanyEnum.DIAGOBAT:
        return <span className="diagobat">{capitalize(CompanyEnum.DIAGOBAT)}</span>;
      case CompanyEnum.AMEXIA:
        return <span className="amexia">{capitalize(CompanyEnum.AMEXIA)}</span>;
      case CompanyEnum.IMPERIUM:
        return <span className="imperium">{capitalize(CompanyEnum.IMPERIUM)}</span>;
      case CompanyEnum.PROBIM:
        return <span className="probim">{capitalize(CompanyEnum.PROBIM)}</span>;
      default:
        return <span className="groupe-projex">{capitalize(CompanyEnum.GROUPE_PROJEX)}</span>;
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Nom du projet',
      dataIndex: 'project_name',
      key: 'project_name',
    },
    {
      title: 'Nom du client',
      dataIndex: 'client_name',
      key: 'client_name',
    },
    {
      title: 'Entité',
      dataIndex: 'company_entity',
      key: 'company_entity',
      render: (companyEntity: CompanyEnum) => renderCompanyEntity(companyEntity),
    },
    {
      title: 'Chefs de projet',
      dataIndex: 'project_managers',
      key: 'project_managers',
      render: (managers: string[]) => managers.join(', '),
    },
    Table.EXPAND_COLUMN,
  ];

  const renderProjectDescription = (project: ProjectModel) => (
    <div>
      {/* TODO */}
      Infos complémentaires ? <br />
      Chef de projet <br />
      Nombre d&apos;affaires ?<br />
      Société <br />
      <Link className={`text-small ${styles.seeTheProjectLink}`} href={`/projects/${project.id}`}>
        Voir le projet
      </Link>
    </div>
  );

  useEffect(() => {
    const formattedProject: DataType[] = projects.map((project: ProjectModel) => ({
      key: project.id || '',
      project_name: (
        <Link className={styles.projectName} href={`/projects/${project.id}`}>
          {project.name}
        </Link>
      ),
      client_name: project.client_company_name || '',
      company_entity: project.company_entity || '',
      // TODO
      project_managers: ['manager 1', 'manager 2'],
      description: renderProjectDescription(project),
    }));
    setFormattedData(formattedProject);
  }, [projects]);

  return (
    <Table
      dataSource={formattedData}
      expandable={{
        expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>,
      }}
      columns={columns}
      // TODO
      loading={false}
      pagination={false}
    />
  );
};

export default ProjectsList;
