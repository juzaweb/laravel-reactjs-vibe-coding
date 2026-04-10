'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState, useRef } from 'react';
import axiosClient from '../../utils/axiosClient';

interface Language {
  code: string;
  name: string;
}

export function Header() {
  const { i18n } = useTranslation();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchLanguages = async () => {
      try {
        const response = await axiosClient.get('/v1/locales');
        if (response.data?.success && response.data?.data) {
          setLanguages(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    fetchLanguages();
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const currentLanguageCode = i18n.language || 'en';
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode) || languages[0];

  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex-shrink-0 flex items-center">
          <span className="text-xl font-bold text-black dark:text-white">App</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <span>{currentLanguage?.name || currentLanguageCode.toUpperCase()}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-zinc-800 ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1" role="menu">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => changeLanguage(language.code)}
                    className={`${
                      currentLanguageCode === language.code
                        ? 'bg-zinc-100 dark:bg-zinc-700 text-black dark:text-white'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                    } block w-full text-left px-4 py-2 text-sm transition-colors`}
                    role="menuitem"
                  >
                    {language.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
