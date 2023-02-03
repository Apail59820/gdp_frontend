import logoGroupeProjex from '../public/logo-groupe-projex.svg';
import pictoGroupeProjex from '../public/picto-groupe-projex.svg';

import logoAmexia from '../public/logo-amexia.svg';
import pictoAmexia from '../public/picto-amexia.svg';

import logoDiagobat from '../public/logo-diagobat.svg';
import pictoDiagobat from '../public/picto-diagobat.svg';

import logoImperium from '../public/logo-imperium.svg';
import pictoImperium from '../public/picto-imperium.svg';

import logoProbim from '../public/logo-probim.svg';
import pictoProbim from '../public/picto-probim.svg';

import logoProjex from '../public/logo-projex.svg';
import pictoProjex from '../public/picto-projex.svg';

import defaultImage from '../public/patrice.png';

import { CompanyEnum } from '../models/CompanyEnum';

export const getImagesByCompany = (company?: CompanyEnum | string): { logo: string; picto: string } => {
  switch (company?.toLowerCase()) {
    case CompanyEnum.AMEXIA:
      return {
        logo: logoAmexia.src,
        picto: pictoAmexia.src,
      };
    case CompanyEnum.DIAGOBAT:
      return {
        logo: logoDiagobat.src,
        picto: pictoDiagobat.src,
      };
    case CompanyEnum.GROUPE_PROJEX:
      return {
        logo: logoGroupeProjex.src,
        picto: pictoGroupeProjex.src,
      };
    case CompanyEnum.IMPERIUM:
      return {
        logo: logoImperium.src,
        picto: pictoImperium.src,
      };
    case CompanyEnum.PROBIM:
      return {
        logo: logoProbim.src,
        picto: pictoProbim.src,
      };
    case CompanyEnum.PROJEX:
      return {
        logo: logoProjex.src,
        picto: pictoProjex.src,
      };
    default:
      //TODO Revoir l'image par défaut
      return {
        logo: defaultImage.src,
        picto: defaultImage.src,
      };
  }
};
