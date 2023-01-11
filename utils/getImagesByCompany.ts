import logoDiagobat from '../public/logo-diagobat.svg';
import pictoDiagobat from '../public/picto-diagobat.svg';
import defaultPicture from '../public/default-profile-picture.png';

export const getImagesByCompany = (company?: string): { logo?: string; picto?: string } => {
  switch (company) {
    case 'diagobat':
      return {
        logo: logoDiagobat.src,
        picto: pictoDiagobat.src,
      };
    default:
      return {
        logo: defaultPicture.src,
        picto: defaultPicture.src,
      };
  }
};
