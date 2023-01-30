import React from 'react';
import BillingCard from '../src/components/BillingCard/BillingCard';

const test = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <BillingCard
        billing={{
          num_facture: '2021-11-011',
          date_echeance_facture: '2023-01-29',
          statut_facture: 'Echue',
          etatreglt_facture: 'Reglee',
        }}
      />
      ...
      <BillingCard
        billing={{
          num_facture: '2021-11-011',
          date_echeance_facture: '2023-01-29',
          statut_facture: 'Echue',
          etatreglt_facture: 'NonReglee',
        }}
      />
      ...
      <BillingCard
        billing={{
          num_facture: '2021-11-011',
          date_echeance_facture: '2023-02-02',
          statut_facture: 'NonEchue',
          etatreglt_facture: 'NonReglee',
        }}
      />
    </div>
  );
};

export default test;
