import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs = [],
  actions,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${title} | Admin`;
  }, [title]);

  return (
    <div className="mb-6 space-y-4">
      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              to="/admin"
              className="inline-flex items-center text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              <FiHome className="w-4 h-4 mr-2" />
              {t('dashboard')}
            </Link>
          </li>
          {breadcrumbs.map((item, index) => (
            <li key={index}>
              <div className="flex items-center">
                <FiChevronRight className="w-4 h-4 text-[var(--text-muted)] mx-1" />
                {item.href ? (
                  <Link
                    to={item.href}
                    className="ml-1 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="ml-1 text-sm font-medium text-[var(--text-main)]">
                    {item.label}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>

      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">{title}</h2>
          {description && (
            <p className="text-[var(--text-muted)] mt-1">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
