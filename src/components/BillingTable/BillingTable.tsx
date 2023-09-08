import React, {useEffect, useState} from 'react';
import {GdpPythagoreFactureModel} from '../../../models/GestionDeProjets/GdpPythagoreFactureModel';
import {ColumnsType} from 'antd/lib/table';
import {Table} from 'antd';
import {DateTime, Interval} from 'luxon';
import {DownOutlined, UpOutlined} from '@ant-design/icons';
import styles from './BillingTable.module.scss';
import ExpandedBillingInfo from './ExpandedBillingInfo';
import {GdpProjectsModel} from '../../../models/GestionDeProjets/GdpProjectsModel';

interface DataType extends Partial<GdpPythagoreFactureModel> {
  key: React.Key;
  paymentText: string;
  invoiceState: InvoiceStateEnum;
}

type props = {
  factures: Partial<GdpPythagoreFactureModel>[];
  displayAdditionnalInfo?: boolean; // Sert à afficher num_affaire et num_client pour les filtres globaux
};

export enum InvoiceStateEnum {
  LATE = 'late',
  SOON_TO_EXPIRE = 'soonToExpire',
  OK = 'ok',
  PAID = 'paid',
}

const BillingTable = ({factures, displayAdditionnalInfo}: props) => {
  const [formattedData, setFormattedData] = useState<DataType[]>([]);

  const getDaysLeft = (invoice: Partial<GdpPythagoreFactureModel>) => {
    const timeLeft = new Date(invoice.date_echeance_facture as string).getTime() - new Date().getTime();
    return parseInt((timeLeft / (1000 * 60 * 60 * 24)).toFixed(0));
  };

  const displayStateText = (state: 'NonReglee' | 'Reglee' | 'RegltPartiel' | undefined) => {
    switch (state) {
      case 'NonReglee':
        return 'Non réglée';
      case 'Reglee':
        return 'Réglée';
      case 'RegltPartiel':
        return 'Partiellement réglée';
      default:
        return 'Etat inconnu';
    }
  };

  const displayPaymentText = (invoiceState: InvoiceStateEnum, invoice: Partial<GdpPythagoreFactureModel>) => {
    switch (invoiceState) {
      case InvoiceStateEnum.LATE:
        return `+ ${Math.abs(getDaysLeft(invoice))} jour${Math.abs(getDaysLeft(invoice)) > 1 ? 's' : ''}`;
      case InvoiceStateEnum.SOON_TO_EXPIRE:
        return `Échéance dans ${getDaysLeft(invoice)} jour${getDaysLeft(invoice) > 1 ? 's' : ''}`;
      case InvoiceStateEnum.OK:
        return 'À régler';
      case InvoiceStateEnum.PAID:
        return `Réglée le ${DateTime.fromISO(invoice.date_dernier_paiement_facture as string).toLocaleString()}`;
      default:
        return '';
    }
  };

  const getInvoiceColorClass = (invoiceState: InvoiceStateEnum) => {
    switch (invoiceState) {
      case InvoiceStateEnum.LATE:
        return styles.red;
      case InvoiceStateEnum.SOON_TO_EXPIRE:
        return styles.orange;
      case InvoiceStateEnum.OK:
        return styles.blue;
      case InvoiceStateEnum.PAID:
        return styles.green;
      default:
        return styles.blue;
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Numéro de facture',
      dataIndex: 'num_facture',
      key: 'num_facture',
      sorter: (a: DataType, b: DataType) => {
        if (!a.num_facture || !b.num_facture || a.num_facture === b.num_facture) return 0;
        return a.num_facture > b.num_facture ? 1 : -1;
      },
      className: styles.billingTable,
    },
    {
      title: 'Projet',
      dataIndex: 'num_affaire',
      key: 'num_affaire',
      sorter: (a: DataType, b: DataType) => {
        if (
          typeof a.num_affaire == 'string' ||
          typeof b.num_affaire == 'string' ||
          !a.num_affaire ||
          !b.num_affaire ||
          typeof a.num_affaire.affairs_id[0] == 'number' ||
          typeof b.num_affaire.affairs_id[0] == 'number' ||
          typeof a.num_affaire.affairs_id[0].affairs_id == 'number' ||
          typeof b.num_affaire.affairs_id[0].affairs_id == 'number' ||
          typeof a.num_affaire.affairs_id[0].affairs_id.projects_id == 'number' ||
          typeof b.num_affaire.affairs_id[0].affairs_id.projects_id == 'number' ||
          !a.num_affaire.affairs_id[0].affairs_id.name ||
          !b.num_affaire.affairs_id[0].affairs_id.name ||
          a.num_affaire.affairs_id[0].affairs_id.name === b.num_affaire.affairs_id[0].affairs_id.name
        )
          return 0;
        return a.num_affaire.affairs_id[0].affairs_id.projects_id.name >
        b.num_affaire.affairs_id[0].affairs_id.projects_id.name
          ? 1
          : -1;
      },
      render: (number) => {
        if (!number) return '';
        return number.affairs_id[0].affairs_id.projects_id.name;
      },
    },
    {
      title: 'Client',
      dataIndex: 'nom_client',
      key: 'nom_client',
      sorter: (a: DataType, b: DataType) => {
        if (
          typeof a.code_client == 'number' ||
          typeof a.code_client == 'string' ||
          typeof b.code_client == 'number' ||
          typeof b.code_client == 'string' ||
          !a.code_client?.nom_client ||
          !b.code_client?.nom_client
        )
          return 0;
        if (a.code_client?.nom_client === b.code_client?.nom_client) return 0;
        return a.code_client?.nom_client > b.code_client?.nom_client ? 1 : -1;
      },
    },
    {
      title: 'État',
      dataIndex: 'etatreglt_facture',
      key: 'etatreglt_facture',
      render: (text, record) => (
        <span className={getInvoiceColorClass(record.invoiceState)}>{displayStateText(text)}</span>
      ),
    },
    {
      title: "Date d'échéance",
      dataIndex: 'date_echeance_facture',
      key: 'date_echeance_facture',
      sorter: (a: DataType, b: DataType) => {
        if (!a.date_echeance_facture || !b.date_echeance_facture) return 0;
        return Interval.fromDateTimes(
          DateTime.fromISO(b.date_echeance_facture as string),
          DateTime.fromISO(a.date_echeance_facture as string)
        ).length() > 0
          ? 1
          : -1;
      },
      render: (date, record) => (
        <span className={getInvoiceColorClass(record.invoiceState)}>{DateTime.fromISO(date).toLocaleString()}</span>
      ),
    },
    {
      title: 'Montant HT',
      dataIndex: 'montant_totalht_facture',
      key: 'montant_totalht_facture',
      sorter: (a: DataType, b: DataType) => {
        if (!a.montant_totalht_facture || !b.montant_totalht_facture) return 0;
        if (a.montant_totalht_facture === b.montant_totalht_facture) return 0;
        return a.montant_totalht_facture > b.montant_totalht_facture ? 1 : -1;
      },
      render: (HTamount) => <span>{HTamount} €</span>,
    },
    {
      title: 'Montant TTC',
      dataIndex: 'montant_totalttc_facture',
      key: 'montant_totalttc_facture',
      sorter: (a: DataType, b: DataType) => {
        if (!a.montant_totalttc_facture || !b.montant_totalttc_facture) return 0;
        if (a.montant_totalttc_facture === b.montant_totalttc_facture) return 0;
        return a.montant_totalttc_facture > b.montant_totalttc_facture ? 1 : -1;
      },
      render: (TTCamount) => <span>{TTCamount} €</span>,
    },
    {
      title: 'Réglement',
      key: 'reglement',
      dataIndex: 'paymentText',
      render: (paymentText, record) => <span className={getInvoiceColorClass(record.invoiceState)}>{paymentText}</span>,
    },
    Table.EXPAND_COLUMN,
  ];

  useEffect(() => {
    const tmp: DataType[] = [];
    const warningDelayTrigger = 15 * 24 * 60 * 60 * 1000; // 15 days
    const now = new Date().getTime();
    factures.map((facture, index) => {
      let invoiceState;
      const dueDate = new Date(facture.date_echeance_facture as string).getTime();
      const fifteenDaysBeforeDueDate = dueDate - warningDelayTrigger;
      const betweenWarningDelayTriggerAndDueDate = now > fifteenDaysBeforeDueDate && now < dueDate;
      facture.etatreglt_facture !== 'Reglee' && facture.statut_facture === 'Echue'
        ? (invoiceState = InvoiceStateEnum.LATE)
        : facture.etatreglt_facture !== 'Reglee' && betweenWarningDelayTriggerAndDueDate
          ? (invoiceState = InvoiceStateEnum.SOON_TO_EXPIRE)
          : facture.etatreglt_facture !== 'Reglee' && !betweenWarningDelayTriggerAndDueDate
            ? (invoiceState = InvoiceStateEnum.OK)
            : (invoiceState = InvoiceStateEnum.PAID);
      tmp.push({
        ...facture,
        key: index,
        invoiceState: invoiceState,
        paymentText: displayPaymentText(invoiceState, facture),
      });
    });
    setFormattedData(tmp);
  }, [factures]);

  return (
    <Table
      columns={
        displayAdditionnalInfo ? columns : columns.filter((col) => col.title !== 'Projet' && col.title !== 'Client')
      }
      dataSource={formattedData}
      pagination={false}
      locale={{
        triggerAsc: 'Trier de manière ascendante',
        triggerDesc: 'Trier de manière descendante',
        cancelSort: 'Ne pas trier',
      }}
      expandable={{
        expandRowByClick: true,
        expandedRowRender: (record: DataType) => (
          <ExpandedBillingInfo
            billing={record}
            colorClassName={getInvoiceColorClass(record.invoiceState)}
            invoiceState={record.invoiceState}
          />
        ),
        expandIcon: ({expanded, onExpand, record}) =>
          expanded ? (
            <UpOutlined rev={undefined} onClick={(e) => onExpand(record, e)}/>
          ) : (
            <DownOutlined rev={undefined} onClick={(e) => onExpand(record, e)}/>
          ),
      }}
    />
  );
};

export default BillingTable;
