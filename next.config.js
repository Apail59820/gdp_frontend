/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  publicRuntimeConfig: {
    DIRECTUS_HOST: process.env.DIRECTUS_HOST,
    USER_SERVICE_URL: process.env.USER_SERVICE_URL,
    GESTION_DE_PROJET_API_URL: process.env.GESTION_DE_PROJET_API_URL,
    INVITE_URL: process.env.INVITE_URL,
    PASSWORD_RESET_URL_ALLOW_LIST: process.env.PASSWORD_RESET_URL_ALLOW_LIST,
    APP_NAME: process.env.APP_NAME,
    ROLE_COLLABORATOR_ID: process.env.ROLE_COLLABORATOR_ID,
    ROLE_CLIENT_ID: process.env.ROLE_CLIENT_ID,
    ROLE_ADMIN_ID: process.env.ROLE_ADMIN_ID,
    COLLABORATORS_EMAILS_DOMAINS: process.env.COLLABORATORS_EMAILS_DOMAINS,
    DIGITAL_SOLUTIONS_TIME_BETWEEN_FACTURES_EMAILS_ALERTS:
      process.env.DIGITAL_SOLUTIONS_TIME_BETWEEN_FACTURES_EMAILS_ALERTS,
    CATALOG_APP_URL: process.env.CATALOG_APP_URL,
  },
};

module.exports = nextConfig;
