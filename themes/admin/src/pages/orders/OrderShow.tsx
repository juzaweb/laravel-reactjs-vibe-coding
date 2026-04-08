import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from './hooks';
import { PageHeader } from '../../components/ui/PageHeader';
import { FiClock, FiCreditCard, FiMapPin, FiHash, FiPackage } from 'react-icons/fi';

export const OrderShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useOrder(id);

  const order = data?.data;

  if (isLoading) {
    return <div className="p-8 text-center text-[var(--text-muted)]">{t('loading', 'Loading...')}</div>;
  }

  if (isError || !order) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{t('order_not_found', 'Order not found.')}</p>
        <button
          onClick={() => navigate('/admin/orders')}
          className="text-blue-500 hover:underline"
        >
          {t('back_to_orders', 'Back to orders')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={`${t('order', 'Order')} #${order.code}`}
        breadcrumbs={[
          { label: t('orders', 'Orders'), href: '/admin/orders' },
          { label: t('view', 'View') }
        ]}
      />

      <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center text-sm text-[var(--text-muted)]">
            <FiClock className="w-4 h-4 mr-2" />
            {new Date(order.created_at).toLocaleString()}
          </div>

          <div className="flex items-center gap-3">
             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                order.payment_status === 'completed'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : order.payment_status === 'pending' || order.payment_status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {t('payment', 'Payment')}: {t(`status_${order.payment_status}`, order.payment_status)}
              </span>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                order.delivery_status === 'delivered'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : order.delivery_status === 'pending' || order.delivery_status === 'processing' || order.delivery_status === 'delivering' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                 {t('delivery', 'Delivery')}: {t(`status_${order.delivery_status}`, order.delivery_status)}
              </span>
          </div>
        </div>

        <div className="p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-[var(--text-muted)] flex items-center gap-2">
                 <FiHash className="w-4 h-4" />
                 {t('order_code', 'Order Code')}
              </dt>
              <dd className="mt-1 text-sm text-[var(--text-main)] font-semibold">{order.code}</dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-[var(--text-muted)] flex items-center gap-2">
                 <FiCreditCard className="w-4 h-4" />
                 {t('payment_method', 'Payment Method')}
              </dt>
              <dd className="mt-1 text-sm text-[var(--text-main)]">{order.payment_method_name}</dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-[var(--text-muted)] flex items-center gap-2">
                 <FiPackage className="w-4 h-4" />
                 {t('quantity', 'Quantity')}
              </dt>
              <dd className="mt-1 text-sm text-[var(--text-main)]">{order.quantity}</dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-[var(--text-muted)]">
                 {t('total_price', 'Total Price')}
              </dt>
              <dd className="mt-1 text-lg font-bold text-[var(--text-main)]">{order.total_price}</dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-[var(--text-muted)] flex items-center gap-2">
                 <FiMapPin className="w-4 h-4" />
                 {t('shipping_address', 'Shipping Address')}
              </dt>
              <dd className="mt-1 text-sm text-[var(--text-main)]">
                {order.address ? (
                  <>
                    {order.address} <br/>
                    {order.country_code && <span className="text-[var(--text-muted)]">{order.country_code}</span>}
                  </>
                ) : (
                  <span className="text-[var(--text-muted)] italic">{t('no_address_provided', 'No address provided')}</span>
                )}
              </dd>
            </div>

            {order.note && (
              <div className="sm:col-span-2 border-t border-[var(--border-color)] pt-6 mt-2">
                <dt className="text-sm font-medium text-[var(--text-muted)] mb-2">
                   {t('customer_note', 'Customer Note')}
                </dt>
                <dd className="text-sm text-[var(--text-main)] bg-slate-50 dark:bg-slate-900/50 p-4 rounded-md border border-[var(--border-color)]">
                   {order.note}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};
