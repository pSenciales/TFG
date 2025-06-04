// middleware.ts (next-intl)
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './routing';

export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  localePrefix: 'always'
});

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|static|[\\w-]+\\.\\w+).*)',
    '/'
  ]
};
