import { generateState, generateCodeVerifier, generateCodeChallenge } from '../utils/pkce.util.js';

class DigiLockerService {
  /**
   * Constructs the official DigiLocker OAuth authorization URL
   */
  async getAuthUrl() {
    const clientId = process.env.DIGILOCKER_CLIENT_ID;
    const redirectUri = process.env.DIGILOCKER_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      throw new Error('Missing DigiLocker configuration in environment variables');
    }

    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    const authUrl = new URL('https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize');
    
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('scope', 'openid');
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');
    
    // Optional but recommended
    authUrl.searchParams.append('purpose', 'verification');

    return {
      url: authUrl.toString(),
      state,
      codeVerifier
    };
  }
}

export default new DigiLockerService();
