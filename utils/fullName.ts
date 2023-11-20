import {UsUserModel} from "../models/UserService/UsUserModel";
import {capitalize} from "./capitalize";

export const getFullName = (user: Partial<UsUserModel>) => {
    if(!user.first_name || !user.last_name) return `${user.email}`;
    return `${capitalize(user.first_name.toLowerCase()) + ' ' + capitalize(user.last_name.toLowerCase())}`;
}