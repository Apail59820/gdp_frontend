export function isRequestSuccessful(status: number) {
  return status == 200 || status == 204;
}
