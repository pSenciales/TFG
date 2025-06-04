'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.replace(pathname, { locale: e.target.value });
  };

  return (
    <select
      onChange={handleChange}
      value={locale}
      className="bg-transparent text-sm border border-gray-300 rounded px-2 py-1"
    >
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}