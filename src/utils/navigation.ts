const SOCIAL_MEDIA_DOMAINS = [
  "twitter.com",
  "x.com",
  "facebook.com",
  "fb.com",
  "instagram.com",
  "linkedin.com",
  "tiktok.com",
  "youtube.com",
];

const EXTERNAL_SCHEMES = new Set(["mailto:", "tel:", "sms:", "whatsapp:", "intent:"]);
const INTERNAL_SCHEMES = new Set(["http:", "https:"]);

const isHostMatch = (hostname: string, baseHost: string): boolean =>
  hostname === baseHost || hostname.endsWith(`.${baseHost}`);

export const shouldOpenInExternalBrowser = (url: string, appHost: string | null): boolean => {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  const protocol = parsed.protocol.toLowerCase();
  const hostname = parsed.hostname.toLowerCase();

  if (EXTERNAL_SCHEMES.has(protocol)) {
    return true;
  }

  if (!INTERNAL_SCHEMES.has(protocol)) {
    return true;
  }

  const isSocialLink = SOCIAL_MEDIA_DOMAINS.some((domain) => isHostMatch(hostname, domain));
  if (isSocialLink) {
    return true;
  }

  if (!appHost) {
    return true;
  }

  return !isHostMatch(hostname, appHost);
};

