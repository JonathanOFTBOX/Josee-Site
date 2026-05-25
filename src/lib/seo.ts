export type SeoRoute = {
  path: string;
  title: string;
  description: string;
  canonical: string;
};

export const SEO_ROUTES = [
  {
    path: '/',
    title: 'Douceur Mains & Pieds Josée | Soins Podologiques à Domicile - Saint-Amable',
    description:
      'Josée offre des soins podologiques et manucure professionnels à domicile à Saint-Amable et environs. Soins des pieds, ongles, callosités et soins diabétiques.',
    canonical: 'https://mainspiedsjosee.ca/',
  },
  {
    path: '/rendez-vous',
    title: 'Rendez-vous | Douceur Mains & Pieds Josée',
    description:
      'Prenez rendez-vous avec Douceur Mains & Pieds Josée pour des soins podologiques et manucure à domicile à Saint-Amable et environs.',
    canonical: 'https://mainspiedsjosee.ca/rendez-vous',
  },
] satisfies SeoRoute[];

const defaultSeo = SEO_ROUTES[0];

function normalizePathname(pathname: string) {
  const withoutTrailingSlash = pathname.replace(/\/+$/, '');
  return withoutTrailingSlash === '' ? '/' : withoutTrailingSlash;
}

export function getSeoForPathname(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);
  return SEO_ROUTES.find((route) => route.path === normalizedPathname) ?? defaultSeo;
}
