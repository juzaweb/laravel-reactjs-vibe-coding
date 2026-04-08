import React from 'react';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { FiUsers, FiDollarSign, FiShoppingCart, FiActivity } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../components/ui/PageHeader';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('dashboard')}
        description={t('welcome_back', { name: 'Tom' })}
        actions={
          <>
            <Button variant="outline">{t('export')}</Button>
            <Button variant="primary">{t('generate_report')}</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('total_revenue')}
          value="$45,231.89"
          icon={<FiDollarSign className="w-6 h-6" />}
          trend={{ value: 20.1, isPositive: true }}
        />
        <StatCard
          title={t('active_users')}
          value="+2,350"
          icon={<FiUsers className="w-6 h-6" />}
          trend={{ value: 10.5, isPositive: true }}
        />
        <StatCard
          title={t('new_orders')}
          value="12,234"
          icon={<FiShoppingCart className="w-6 h-6" />}
          trend={{ value: 4.25, isPositive: false }}
        />
        <StatCard
          title={t('system_health')}
          value="98.4%"
          icon={<FiActivity className="w-6 h-6" />}
          trend={{ value: 1.2, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-sm p-6 min-h-[400px]">
          <h3 className="text-lg font-medium text-[var(--text-main)] mb-4">{t('revenue_overview')}</h3>
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-[var(--border-color)] rounded-lg">
             <span className="text-[var(--text-muted)]">{t('chart_placeholder')}</span>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-[var(--text-main)] mb-4">{t('recent_activity')}</h3>
          <div className="space-y-6">
             {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex gap-4">
                   <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                   <div>
                     <p className="text-sm font-medium text-[var(--text-main)]">{t('new_user_registered')}</p>
                     <p className="text-xs text-[var(--text-muted)] mt-1">{t('hours_ago')}</p>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
