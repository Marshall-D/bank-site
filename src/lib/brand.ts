export const BRAND_NAME = "British Royal Caribbean Bank";
export const BRAND_SHORT = "BRCB";
export const BRAND_DOMAIN = "thebrcbank.com";
export const BRAND_WEBSITE = `https://${BRAND_DOMAIN}`;

export const BRAND_EMAILS = {
  support: `support@${BRAND_DOMAIN}`,
  privacy: `privacy@${BRAND_DOMAIN}`,
  legal: `legal@${BRAND_DOMAIN}`,
} as const;

export const LOGO = {
  src: "/images/brcb-logo.png",
  width: 1536,
  height: 1024,
  alt: BRAND_NAME,
} as const;

/** Shield mark — source asset; favicons in `src/app/icon.png` are cropped from this */
export const SHIELD = {
  src: "/images/brcb-shield.png",
  alt: `${BRAND_NAME} shield`,
} as const;

/**
 * Brand palette — keep in sync with CSS variables in `src/app/globals.css`.
 * Theme tokens (primary, secondary, etc.) are defined in globals.css, not here.
 */
export const BRAND_COLORS = {
  /** primary — "British Royal" wordmark navy */
  navy: "#043B78",
  /** primary-light — shield sky / wave accent */
  cyan: "#0FBBD1",
  /** secondary — "Caribbean Bank" wordmark gold */
  gold: "#EBB516",
} as const;
