import React from 'react';
import { GlassLayout } from '../components/layout/GlassLayout';
import { ReviewsHeader } from '../components/reviews/ReviewsHeader';
import { ReviewsStats } from '../components/reviews/ReviewsStats';
import { RatingDistribution } from '../components/reviews/RatingDistribution';
import { RecentReviews } from '../components/reviews/RecentReviews';
import { AllReviewsTable } from '../components/reviews/AllReviewsTable';

export const ReviewsView = () => {
  return (
    <GlassLayout>
      <div className="flex flex-col gap-6 lg:gap-8 max-w-[1600px] mx-auto pb-10">
        
        {/* HEADER & STATS */}
        <div className="space-y-8">
          <ReviewsHeader />
          <ReviewsStats />
        </div>

        {/* ANALYTICS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <RatingDistribution />
          </div>
          <div className="lg:col-span-1">
            <RecentReviews />
          </div>
        </div>

        {/* CORE TABLE SECTION */}
        <div className="w-full">
          <AllReviewsTable />
        </div>

      </div>
    </GlassLayout>
  );
};

export default ReviewsView;
