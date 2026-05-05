import React, { useState, useMemo } from 'react';
import { DesktopLayout } from '../components/layout/DesktopLayout';
import { ReviewsHeader } from '../components/reviews/ReviewsHeader';
import { ReviewsTabs } from '../components/reviews/ReviewsTabs';
import { ReviewsFilters } from '../components/reviews/ReviewsFilters';
import { ReviewList } from '../components/reviews/ReviewList';
import { ReviewsRightPanel } from '../components/reviews/ReviewsRightPanel';

const reviewsData = [
  { id: 1, customer: 'Priya Sharma', rating: 5, time: '2 days ago', status: 'Published', date: 'May 22, 2024', product: 'Farm Fresh Tomatoes', weight: '5 kg', text: 'Very fresh and juicy tomatoes! You can really taste the freshness. Packaging was also good.', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&h=100&fit=crop', customerImg: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&h=100&fit=crop' },
  { id: 2, customer: 'Amit Verma', rating: 4, time: '3 days ago', status: 'Published', date: 'May 22, 2024', product: 'Cucumbers', weight: '3 kg', text: 'Cucumbers were fresh and crunchy. Good quality and value for money. Will order again!', img: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=100&h=100&fit=crop', customerImg: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=100&h=100&fit=crop' },
  { id: 3, customer: 'Neha Singh', rating: 5, time: '5 days ago', status: 'Published', date: 'May 21, 2024', product: 'Potatoes', weight: '10 kg', text: 'Potatoes are of excellent quality. Clean and well-packed.', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=100&h=100&fit=crop', customerImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=100&h=100&fit=crop' },
  { id: 4, customer: 'Rahul Mehta', rating: 3, time: '6 days ago', status: 'Pending', date: 'May 21, 2024', product: 'Red Onions', weight: '5 kg', text: 'Onions were fresh but a few were slightly small in size. Overall good experience.', img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=100&h=100&fit=crop', customerImg: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=100&h=100&fit=crop' },
  { id: 5, customer: 'Sunita Joshi', rating: 5, time: '1 week ago', status: 'Published', date: 'May 20, 2024', product: 'Whole Wheat', weight: '5 kg', text: 'Whole wheat is very good. Wheat flour is soft and perfect for daily use.', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&h=100&fit=crop', customerImg: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&h=100&fit=crop' },
];

export const ReviewsView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [productFilter, setProductFilter] = useState('All Products');
  const [ratingFilter, setRatingFilter] = useState('All Ratings');

  const filteredReviews = useMemo(() => {
    return reviewsData.filter(review => {
      const matchesSearch = review.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           review.product.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = activeTab === 'all' || review.status.toLowerCase() === activeTab.toLowerCase();
      
      const matchesProduct = productFilter === 'All Products' || review.product === productFilter;
      
      const matchesRating = ratingFilter === 'All Ratings' || 
                           (ratingFilter === '5 Stars' && review.rating === 5) ||
                           (ratingFilter === '4 Stars' && review.rating === 4) ||
                           (ratingFilter === '3 Stars' && review.rating === 3) ||
                           (ratingFilter === '2 Stars' && review.rating === 2) ||
                           (ratingFilter === '1 Star' && review.rating === 1);

      return matchesSearch && matchesTab && matchesProduct && matchesRating;
    });
  }, [searchQuery, activeTab, productFilter, ratingFilter]);

  return (
    <DesktopLayout>
      <div className="px-4 md:px-8 pb-8 flex flex-col lg:flex-row gap-8 mt-6">
        
        {/* Left Content Column */}
        <div className="flex-1 min-w-0">
          <ReviewsHeader />
          <ReviewsTabs activeTab={activeTab} setActiveTab={setActiveTab} reviews={reviewsData} />
          <ReviewsFilters 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            productFilter={productFilter}
            setProductFilter={setProductFilter}
            ratingFilter={ratingFilter}
            setRatingFilter={setRatingFilter}
          />
          <ReviewList reviews={filteredReviews} />
        </div>

        {/* Right Panel Column */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <ReviewsRightPanel />
        </div>

      </div>
    </DesktopLayout>
  );
};
