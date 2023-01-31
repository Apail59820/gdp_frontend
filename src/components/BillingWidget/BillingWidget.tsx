import { ManageItemCard } from '@projex/ui';
import styles from './BillingWidget.module.scss';
import React from 'react';
import Grid from '../Grid/Grid';
import InvoiceCard from '../InvoiceCard/InvoiceCard';

type Props = {
  invoices: any[];
};

const BillingWidget = ({ invoices }: Props) => {
  return invoices.length > 0 ? (
    <Grid type="narrow">
      {invoices.slice(0, 3).map((invoice) => (
        <InvoiceCard invoice={invoice} />
      ))}
      <ManageItemCard type="edit" label="Configurer la facturation" onClick={() => console.log('handle click ?')} />
    </Grid>
  ) : (
    <>Configurer la facturation</>
  );
};

export default BillingWidget;
