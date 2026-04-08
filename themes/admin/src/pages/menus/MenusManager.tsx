import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/form/Select';
import { FiPlus, FiChevronDown, FiChevronRight, FiSearch } from 'react-icons/fi';
import { PageHeader } from '../../components/ui/PageHeader';

export const MenusManager: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'latest' | 'search'>('latest');
  const [isPagesOpen, setIsPagesOpen] = useState(true);

  // Mock data for the UI
  const availablePages = [
    'Contact',
    'Referral',
    'About Us',
    'Payout Rates',
    'Home',
    'Privacy Policy',
    'Terms of Service'
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title={t('menus', 'Menus')}
        breadcrumbs={[{ label: t('menus', 'Menus') }]}
      />

      {/* Top Header Section */}
      <div className="flex items-center gap-3 pb-6 border-b border-[var(--border-color)]">
        <span className="text-sm font-medium text-[var(--text-main)]">
          {t('select_menu_to_edit', 'Select menu to edit:')}
        </span>
        <div className="w-64">
          <Select
            options={[
              { value: 'main', label: 'Main' }
            ]}
            value="main"
          />
        </div>
        <span className="text-sm font-medium text-[var(--text-muted)] mx-2">
          {t('or', 'or')}
        </span>
        <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
          <FiPlus className="w-4 h-4 mr-1" />
          {t('create_new_menu', 'Create new menu')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Items */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-bold text-[var(--text-main)] mb-2">
            {t('items', 'Items')}
          </h2>

          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden shadow-sm">
            {/* Accordion Header */}
            <button
              className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-[var(--border-color)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsPagesOpen(!isPagesOpen)}
            >
              <span className="font-semibold text-[var(--text-main)]">{t('pages', 'Pages')}</span>
              {isPagesOpen ? <FiChevronDown className="text-[var(--text-muted)]" /> : <FiChevronRight className="text-[var(--text-muted)]" />}
            </button>

            {/* Accordion Content */}
            {isPagesOpen && (
              <div className="p-4">
                {/* Tabs */}
                <div className="flex border-b border-[var(--border-color)] mb-4">
                  <button
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'latest'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-slate-300'
                    }`}
                    onClick={() => setActiveTab('latest')}
                  >
                    {t('latest', 'Latest')}
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'search'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-blue-600 hover:text-blue-700'
                    }`}
                    onClick={() => setActiveTab('search')}
                  >
                    {t('search', 'Search')}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="space-y-4">
                  {activeTab === 'search' && (
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        placeholder={t('search_pages', 'Search pages...')}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-[var(--border-color)] rounded-md bg-[var(--bg-main)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                    {availablePages.map((page, index) => (
                      <label key={index} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white"
                        />
                        <span className="text-sm text-[var(--text-main)] group-hover:text-blue-600 transition-colors">
                          {page}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white"
                      />
                      <span className="text-sm text-[var(--text-main)]">
                        {t('select_all', 'Select all')}
                      </span>
                    </label>

                    <Button variant="primary" size="sm" className="gap-1">
                      <FiPlus className="w-4 h-4" />
                      {t('add_to_menu', 'Add to menu')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Structure */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-lg font-bold text-[var(--text-main)] mb-2">
            {t('structure', 'Structure')}
          </h2>

          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden shadow-sm flex flex-col">
            {/* Menu Configuration Header */}
            <div className="p-6 border-b border-[var(--border-color)] grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 dark:bg-slate-800/20">
              <div>
                <Input
                  label={t('menu_name', 'Menu name')}
                  value="Main"
                  className="bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <Select
                  label={t('language', 'Language')}
                  options={[
                    { value: 'en', label: 'English' }
                  ]}
                  value="en"
                  className="bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            {/* Menu Items Area */}
            <div className="p-6 flex-grow min-h-[200px] bg-slate-50/30 dark:bg-slate-900/10">
              {/* Draggable Menu Item Placeholder */}
              <div className="bg-white dark:bg-slate-800 border border-[var(--border-color)] rounded-md shadow-sm">
                <div className="flex items-center justify-between p-3 cursor-move">
                  <span className="font-medium text-[var(--text-main)]">Home</span>
                  <FiChevronDown className="text-blue-600" />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-[var(--border-color)] flex items-center justify-between">
              <button className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors">
                {t('delete_menu', 'Delete menu')}
              </button>
              <Button variant="primary" className="gap-2 px-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                {t('save', 'Save')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
