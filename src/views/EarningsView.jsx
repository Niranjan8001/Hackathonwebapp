import React from 'react';
import { DesktopLayout } from '../components/layout/DesktopLayout';
import { EarningsHeader } from '../components/earnings/EarningsHeader';
import { EarningsStatCards } from '../components/earnings/EarningsStatCards';
import { EarningsCharts } from '../components/earnings/EarningsCharts';
import { EarningsTable } from '../components/earnings/EarningsTable';
import { EarningsRightPanel } from '../components/earnings/EarningsRightPanel';

export const EarningsView = () => {
  return (
    <DesktopLayout>
      <div className="px-4 md:px-8 pb-8 flex flex-col lg:flex-row gap-8 mt-6">
        
        {/* Left Content Column */}
        <div className="flex-1 min-w-0">
          <EarningsHeader />
          <EarningsStatCards />
          <EarningsCharts />
          <EarningsTable />
        </div>

        {/* Right Panel Column */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <EarningsRightPanel />
        </div>

      </div>
    </DesktopLayout>
  );
};
