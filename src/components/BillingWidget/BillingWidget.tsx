import { ManageItemCard } from 'projex-ui';
import React from 'react';
import Grid from '../Grid/Grid';
import InvoiceCard from '../InvoiceCard/InvoiceCard';
import ConfigureWidget from '../ConfigureWidget/ConfigureWidget';
import type { GdpPythagoreFactureModel } from '../../../models/GestionDeProjets/GdpPythagoreFactureModel';
import { Section } from 'projex-ui';
import { useRouter } from 'next/router';

type Props = {
  invoices: Partial<GdpPythagoreFactureModel>[];
  max?: number;
  onConfigureBillingClick: React.MouseEventHandler<HTMLButtonElement>;
  allInvoicesPageHref?: string;
  displayConfigureButton?: boolean;
};

const BillingWidget = ({
  invoices,
  max = 3,
  onConfigureBillingClick,
  allInvoicesPageHref,
  displayConfigureButton,
}: Props) => {
  const router = useRouter();

  return (
    <Section
      title="Facturation"
      link={
        invoices.length > 0
          ? {
              label: `Voir l${invoices.length > 1 ? `es ${invoices.length}` : 'a'} facture${
                invoices.length > 1 ? 's' : ''
              }`,
              href: allInvoicesPageHref || `${router.asPath}/billings`,
            }
          : undefined
      }
    >
      {invoices.length > 0 ? (
        <Grid type="narrow">
          {invoices.slice(0, max).map((invoice: Partial<GdpPythagoreFactureModel>) => (
            <InvoiceCard key={invoice.num_facture} invoice={invoice} />
          ))}
          <ManageItemCard type="edit" label="Configurer la facturation" onClick={onConfigureBillingClick} />
        </Grid>
      ) : (
        <ConfigureWidget
          descriptionText="Vous n'avez aucune facture configurée"
          button={
            displayConfigureButton
              ? {
                  label: 'Configurer la facturation',
                  type: 'edit',
                  onClick: onConfigureBillingClick,
                }
              : undefined
          }
        />
      )}
    </Section>
  );
};

export default BillingWidget;
