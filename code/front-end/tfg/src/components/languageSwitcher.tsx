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
    <div className='flex'>
      <svg viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" width={30} height={30}>
        <path d="M5.5 16.5H19.5M5.5 8.5H19.5M4.5 12.5H20.5M12.5 20.5C12.5 20.5 8 18.5 8 12.5C8 6.5 12.5 4.5 12.5 4.5M12.5 4.5C12.5 4.5 17 6.5 17 
      12.5C17 18.5 12.5 20.5 12.5 20.5M12.5 4.5V20.5M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 
      8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z" stroke="#000000" strokeWidth="1.2">

        </path>
      </svg>
      <select
        onChange={handleChange}
        value={locale}
        className="bg-transparent text-sm border border-gray-300 rounded px-2 py-1"
      >
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>
    </div>
  );
}