import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.huarongglobal.com';
  const routes = [
    '',
    '/about',
    '/auto-parts',
    '/car-sales',
    '/contact-us',
    '/global-cooperation',
    '/news',
  ];

  return routes.flatMap((route) => {
    return routing.locales.map((locale) => {
      const isDefault = locale === routing.defaultLocale;
      let urlPath = '';

      if (isDefault) {
        urlPath = route;
      } else {
        urlPath = `/${locale}${route}`;
      }

      // Ensure root path is handled correctly
      if (urlPath === '' && !isDefault) urlPath = `/${locale}`;

      return {
        url: `${baseUrl}${urlPath}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
      };
    });
  });
}
