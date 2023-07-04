export type RoleType = string | null;
export const getUserRole = (role: RoleType): string | null => {
  if (!role) return null;
  return role === 'e9edf0ea-18be-4f98-8761-05fa498eaabc'
    ? 'ADMIN'
    : role === '1c6ef4de-c09b-4c91-9a75-e38f988e1824'
    ? 'COLLABORATOR'
    : 'CLIENT';
};
export const isUserIsCollaborator = (role: string): boolean => {
  return getUserRole(role) === 'COLLABORATOR' || false;
};
export const isUserIsClient = (role: string): boolean => {
  return getUserRole(role) === 'CLIENT' || false;
};

export const isUserIsAdmin = (role: string): boolean => {
  return getUserRole(role) === 'ADMIN' || false;
};
