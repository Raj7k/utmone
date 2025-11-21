const SESSION_KEY = 'utm_one_ab_session';
const VARIANT_KEY = 'utm_one_ab_variant';

export interface SessionData {
  sessionId: string;
  variant: number;
}

export const getOrCreateSession = (): SessionData => {
  const existingSessionId = localStorage.getItem(SESSION_KEY);
  const existingVariant = localStorage.getItem(VARIANT_KEY);

  if (existingSessionId && existingVariant !== null) {
    return {
      sessionId: existingSessionId,
      variant: parseInt(existingVariant, 10),
    };
  }

  // Create new session
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const variant = Math.floor(Math.random() * 4); // 0-3 for 4 variants

  localStorage.setItem(SESSION_KEY, sessionId);
  localStorage.setItem(VARIANT_KEY, variant.toString());

  return { sessionId, variant };
};

export const getSessionData = (): SessionData | null => {
  const sessionId = localStorage.getItem(SESSION_KEY);
  const variant = localStorage.getItem(VARIANT_KEY);

  if (!sessionId || variant === null) {
    return null;
  }

  return {
    sessionId,
    variant: parseInt(variant, 10),
  };
};
