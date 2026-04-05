import React from 'react';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { FiUsers, FiDollarSign, FiShoppingCart, FiActivity } from 'react-icons/fi';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">Dashboard</h2>
          <p className="text-[var(--text-muted)] mt-1">Welcome back, Tom. Here is what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Export</Button>
          <Button variant="primary">Generate Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$45,231.89"
          icon={<FiDollarSign className="w-6 h-6" />}
          trend={{ value: 20.1, isPositive: true }}
        />
        <StatCard
          title="Active Users"
          value="+2,350"
          icon={<FiUsers className="w-6 h-6" />}
          trend={{ value: 10.5, isPositive: true }}
        />
        <StatCard
          title="New Orders"
          value="12,234"
          icon={<FiShoppingCart className="w-6 h-6" />}
          trend={{ value: 4.25, isPositive: false }}
        />
        <StatCard
          title="System Health"
          value="98.4%"
          icon={<FiActivity className="w-6 h-6" />}
          trend={{ value: 1.2, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-sm p-6 min-h-[400px]">
          <h3 className="text-lg font-medium text-[var(--text-main)] mb-4">Revenue Overview</h3>
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-[var(--border-color)] rounded-lg">
             <span className="text-[var(--text-muted)]">Chart Placeholder</span>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-[var(--text-main)] mb-4">Recent Activity</h3>
          <div className="space-y-6">
             {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex gap-4">
                   <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                   <div>
                     <p className="text-sm font-medium text-[var(--text-main)]">New user registered</p>
                     <p className="text-xs text-[var(--text-muted)] mt-1">2 hours ago</p>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
