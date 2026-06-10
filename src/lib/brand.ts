export const BRAND_NAME = "British Royal Caribbean Bank";
export const BRAND_SHORT = "BRCB";

export const LOGO = {
  src: "/brcb-logo.png",
  width: 1536,
  height: 1024,
  alt: BRAND_NAME,
} as const;

/** Shield mark — source asset; favicons in `src/app/icon.png` are cropped from this */
export const SHIELD = {
  src: "/brcb-shield.png",
  alt: `${BRAND_NAME} shield`,
} as const;
