import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'es'] as const;
export const defaultLocale = 'en' as const;

// Replace createSharedPathnamesConfig with defineRouting
export const routing = defineRouting({
  locales,
  defaultLocale,
});

// Export navigation APIs
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);