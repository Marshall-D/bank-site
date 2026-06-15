import { BRAND_NAME } from '@/lib/brand'

export type SiteImage = {
  src: string
  alt: string
  width: number
  height: number
}

export const HOME_IMAGES = {
  branchExterior: {
    src: '/images/branch-exterior.png',
    alt: `${BRAND_NAME} branch exterior`,
    width: 1024,
    height: 682,
  },
  branchInterior: {
    src: '/images/branch-interior.png',
    alt: `${BRAND_NAME} lobby and teller desk`,
    width: 1536,
    height: 1024,
  },
  skyline: {
    src: '/images/skyline.jpg',
    alt: 'Caribbean coastline skyline at golden hour',
    width: 2000,
    height: 1333,
  },
} as const satisfies Record<string, SiteImage>

export const ABOUT_IMAGES = {
  teamEntrance: {
    src: '/images/about/team-entrance.png',
    alt: `${BRAND_NAME} team welcoming customers at the branch entrance`,
    width: 1536,
    height: 1024,
  },
  branchInterior: {
    src: '/images/branch-interior.png',
    alt: `${BRAND_NAME} lobby and teller desk`,
    width: 1536,
    height: 1024,
  },
  milestone2020: {
    src: '/images/about/milestone-2020.png',
    alt: `${BRAND_NAME} founding ribbon-cutting ceremony in 2020`,
    width: 1536,
    height: 1024,
  },
  headshotCeo: {
    src: '/images/about/headshot-ceo.png',
    alt: 'Sarah Johnson, CEO and Co-founder',
    width: 1536,
    height: 1024,
  },
  headshotCto: {
    src: '/images/about/headshot-cto.png',
    alt: 'Michael Chen, CTO and Co-founder',
    width: 1536,
    height: 1024,
  },
  headshotCpo: {
    src: '/images/about/headshot-cpo.png',
    alt: 'Emily Rodriguez, Chief Product Officer',
    width: 1536,
    height: 1024,
  },
} as const satisfies Record<string, SiteImage>

export const PRODUCT_IMAGES = {
  hero: {
    src: '/images/products/hero-mobile-banking.png',
    alt: 'Customer using mobile banking and contactless card at a café',
    width: 1536,
    height: 1024,
  },
  checking: {
    src: '/images/products/checking-wallet.png',
    alt: 'Premium wallet with debit card for everyday checking',
    width: 1536,
    height: 1024,
  },
  savings: {
    src: '/images/products/savings-jar.png',
    alt: 'Glass savings jar representing growing wealth',
    width: 1536,
    height: 1024,
  },
  business: {
    src: '/images/products/business-owner.png',
    alt: 'Small business owner managing finances in her shop',
    width: 1536,
    height: 1024,
  },
} as const satisfies Record<string, SiteImage>

export const SUPPORT_IMAGES = {
  helpDesk: {
    src: '/images/support/help-desk.png',
    alt: `${BRAND_NAME} customer service team at the help desk`,
    width: 1536,
    height: 1024,
  },
} as const satisfies Record<string, SiteImage>
