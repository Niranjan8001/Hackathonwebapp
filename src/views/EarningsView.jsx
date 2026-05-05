import React from 'react';
import { GlassLayout } from '../components/layout/GlassLayout';
import { EarningsHeader } from '../components/earnings/EarningsHeader';
import { EarningsStatCards } from '../components/earnings/EarningsStatCards';
import { EarningsCharts } from '../components/earnings/EarningsCharts';
import { EarningsTable } from '../components/earnings/EarningsTable';
import { EarningsSummaryPie } from '../components/earnings/EarningsSummaryPie';
import { WithdrawNowCard } from '../components/earnings/WithdrawNowCard';
import { PayoutHistory } from '../components/earnings/PayoutHistory';

export const EarningsView = () => {
  return (
    <GlassLayout>
      <div className="flex flex-col gap-6 lg:gap-8 max-w-7xl mx-auto">
        
        {/* TOP HEADER & STATS */}
        <div className="space-y-6">
          <EarningsHeader />
          <EarningsStatCards />
        </div>

        {/* MIDDLE SECTION: MAIN CHART & PIE CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <EarningsCharts />
          </div>
          <div className="lg:col-span-1">
            <EarningsSummaryPie />
          </div>
        </div>

        {/* BOTTOM SECTION: TRANSACTIONS & PAYOUTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
          <div className="lg:col-span-2">
            <EarningsTable />
          </div>
          <div className="lg:col-span-1 space-y-6 lg:space-y-8">
            <WithdrawNowCard />
            <PayoutHistory />
          </div>
        </div>

      </div>
    </GlassLayout>
  );
};
