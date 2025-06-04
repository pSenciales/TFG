import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations();
  
  return (
    <footer className="border-t border-silver bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          {/* Texto o logo */}
          <p className="text-sm text-gray-600">
            {t('footer.rights')}
          </p>

          {/* Enlaces */}
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="https://www.freeprivacypolicy.com/live/71ee38ba-fd54-43ff-a3fe-64f616041573" className="text-gray-600 hover:text-gray-900 text-sm">
              {t('footer.privacyPolicy')}
            </a>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 text-sm">
              {t('footer.contact')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}