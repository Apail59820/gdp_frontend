import { capitalize } from './capitalize';
import { UsUserModel } from '../models/UserService/UsUserModel';

export function formatUserName(user: Partial<UsUserModel>): string {
  if (user.first_name && user.last_name) {
    return `${capitalize(user.first_name)} ${capitalize(user.last_name)}`;
  } else if (user.first_name) {
    return capitalize(user.first_name);
  } else if (user.last_name) {
    return capitalize(user.last_name);
  } else {
    return user.email || '';
  }
}
