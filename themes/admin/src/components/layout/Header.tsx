import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSidebar, toggleTheme } from '../../store/uiSlice';
import { logOut } from '../../store/authSlice';
import { FiMenu, FiSun, FiMoon, FiBell, FiGlobe } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const { t, i18n } = useTranslation();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/auth/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-[var(--border-color)] bg-[var(--bg-card)]/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 transition-colors duration-300">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        onClick={() => dispatch(toggleSidebar())}
      >
        <span className="sr-only">{t('toggle_sidebar')}</span>
        <FiMenu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end items-center">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              className="-m-2.5 p-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            >
              <span className="sr-only">{t('change_language')}</span>
              <FiGlobe className="h-5 w-5" aria-hidden="true" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-[var(--bg-card)] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-[var(--border-color)]">
                <div className="py-1" role="none">
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm text-[var(--text-main)] hover:bg-slate-100 dark:hover:bg-slate-800 ${i18n.language === 'en' ? 'font-bold' : ''}`}
                    role="menuitem"
                    onClick={() => { i18n.changeLanguage('en'); setIsLangMenuOpen(false); }}
                  >
                    {t('english')}
                  </button>
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm text-[var(--text-main)] hover:bg-slate-100 dark:hover:bg-slate-800 ${i18n.language === 'es' ? 'font-bold' : ''}`}
                    role="menuitem"
                    onClick={() => { i18n.changeLanguage('es'); setIsLangMenuOpen(false); }}
                  >
                    {t('spanish')}
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="-m-2.5 p-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            onClick={() => dispatch(toggleTheme())}
          >
            <span className="sr-only">{t('toggle_theme')}</span>
            {theme === 'dark' ? (
              <FiSun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <FiMoon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            className="-m-2.5 p-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            <span className="sr-only">{t('view_notifications')}</span>
            <FiBell className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-[var(--border-color)]" aria-hidden="true" />

          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              className="-m-1.5 flex items-center p-1.5 focus:outline-none"
              id="user-menu-button"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <span className="sr-only">{t('open_user_menu')}</span>
              <img
                className="h-8 w-8 rounded-full bg-slate-50 border border-[var(--border-color)]"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-[var(--text-main)]" aria-hidden="true">
                  {user?.name || 'User'}
                </span>
                <svg className="ml-2 h-5 w-5 text-[var(--text-muted)]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-[var(--bg-card)] py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-[var(--border-color)]">
                <Link
                  to="/admin/profile"
                  className="block px-4 py-2 text-sm text-[var(--text-main)] hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  {t('profile')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-[var(--text-main)] hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t('sign_out', 'Sign out')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
