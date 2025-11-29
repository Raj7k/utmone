/**
 * Email Configuration
 * Centralizes email sender configuration for all system emails
 */

export const EMAIL_CONFIG = {
  PRIMARY_DOMAIN: 'utm.one',
  SENDER_EMAIL: 'onboarding@utm.one',
  SENDER_NAME: 'utm.one',
  NO_REPLY: 'noreply@utm.one',
} as const;

export const getEmailSender = (type: 'onboarding' | 'noreply' = 'onboarding') => {
  const email = type === 'noreply' ? EMAIL_CONFIG.NO_REPLY : EMAIL_CONFIG.SENDER_EMAIL;
  return `${EMAIL_CONFIG.SENDER_NAME} <${email}>`;
};

export const EMAIL_TEMPLATES = {
  WORKSPACE_INVITE: {
    subject: (workspaceName: string) => `Join ${workspaceName} on utm.one`,
    fromName: 'utm.one Team',
  },
  PASSWORD_RESET: {
    subject: 'Secure your account',
    fromName: 'utm.one Security',
  },
  MAGIC_LINK: {
    subject: 'Your sign-in link',
    fromName: 'utm.one',
  },
  WELCOME: {
    subject: 'Welcome to utm.one',
    fromName: 'utm.one',
  },
} as const;
