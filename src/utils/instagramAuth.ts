/**
 * Instagram OAuth Authentication Utilities
 */

export const createInstagramAuthUrl = (): string => {
  const clientId = import.meta.env.VITE_INSTAGRAM_CLIENT_ID || '1292743865568326';
  const redirectUri = import.meta.env.VITE_INSTAGRAM_REDIRECT_URL || 'https://fead.app/';
  const scope = 'instagram_business_basic,instagram_business_manage_messages';
  
  return `https://www.instagram.com/oauth/authorize?force_reauth=false&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
};

export const redirectToInstagramAuth = (): void => {
  const authUrl = createInstagramAuthUrl();
  window.location.href = authUrl;
};