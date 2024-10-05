const SUPPORTED_URL_PROTOCOLS = new Set([
  "http:",
  "https:",
  "mailto:",
  "sms:",
  "tel:",
]);

export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    // eslint-disable-next-line no-script-url
    if (!SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol)) {
      return "about:blank";
    }
  } catch {
    return url;
  }
  return url;
}

const urlRegExp =
  /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}|localhost)(:[0-9]{1,5})?(\/.*)?$/;

export function validateUrl(url: string): boolean {
  return urlRegExp.test(url);
}
