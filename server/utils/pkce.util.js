import crypto from 'crypto';

/**
 * Generates a secure random state string for OAuth 2.0
 */
export const generateState = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generates a high-entropy code_verifier for PKCE
 * The code_verifier must be between 43 and 128 characters long.
 */
export const generateCodeVerifier = () => {
  return crypto.randomBytes(32).toString('base64url');
};

/**
 * Generates a SHA256 code_challenge from the verifier
 */
export const generateCodeChallenge = (verifier) => {
  const hash = crypto.createHash('sha256').update(verifier).digest();
  return hash.toString('base64url');
};
