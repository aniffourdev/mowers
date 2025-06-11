import { Lato, Poppins } from 'next/font/google';
import React from 'react';

const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });
const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

interface RatingDisplayProps {
  rating: number;
  reviewCount: number;
  distribution: {
    excellent: number;
    veryGood: number;
    average: number;
    poor: number;
    terrible: number;
  };
}

const Ratings: React.FC<RatingDisplayProps> = ({ rating, reviewCount, distribution }) => {
  // Function to render stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="halfGradient">
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path fill="url(#halfGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    // Add empty stars to make up to 5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div 
      className=""
      role="region"
      aria-label="Product ratings and reviews"
    >
      <div className="flex items-center">
        <span 
          className={`text-3xl font-black -tracking-[2px] text-gray-800`}
          aria-label={`${rating.toFixed(1)} out of 5 stars`}
        >
          {rating.toFixed(1)}
        </span>
        <div 
          className="flex ml-2"
          role="img"
          aria-label={`${rating.toFixed(1)} out of 5 stars`}
        >
          {renderStars()}
        </div>
      </div>
      
      <p className={`mt-1 text-xs text-gray-600`}>
        {rating.toFixed(1)} out of 5 stars (based on {reviewCount} reviews)
      </p>
      
      <div 
        className="mt-4 space-y-2"
        role="list"
        aria-label="Rating distribution"
      >
        {/* Rating distribution bars */}
        <div 
          className="flex items-center"
          role="listitem"
        >
          <span className={`${lato.className} w-16 text-sm text-gray-950`}>Excellent</span>
          <div 
            className="flex-1 h-3 ml-2 bg-slate-200"
            role="progressbar"
            aria-valuenow={distribution.excellent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${distribution.excellent}% excellent ratings`}
          >
            <div 
              className="h-3 bg-yellow-400" 
              style={{ width: `${distribution.excellent}%` }}
            ></div>
          </div>
          <span className="w-8 ml-2 text-sm text-right font-semibold text-black">{distribution.excellent}%</span>
        </div>
        
        <div 
          className="flex items-center"
          role="listitem"
        >
          <span className={`${lato.className} w-16 text-sm text-gray-950`}>Very good</span>
          <div 
            className="flex-1 h-3 ml-2 bg-slate-200"
            role="progressbar"
            aria-valuenow={distribution.veryGood}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${distribution.veryGood}% very good ratings`}
          >
            <div 
              className="h-3 bg-yellow-400" 
              style={{ width: `${distribution.veryGood}%` }}
            ></div>
          </div>
          <span className="w-8 ml-2 text-sm text-right font-semibold text-black">{distribution.veryGood}%</span>
        </div>
        
        <div 
          className="flex items-center"
          role="listitem"
        >
          <span className={`${lato.className} w-16 text-sm text-gray-950`}>Average</span>
          <div 
            className="flex-1 h-3 ml-2 bg-slate-200"
            role="progressbar"
            aria-valuenow={distribution.average}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${distribution.average}% average ratings`}
          >
            <div 
              className="h-3 bg-yellow-400" 
              style={{ width: `${distribution.average}%` }}
            ></div>
          </div>
          <span className="w-8 ml-2 text-sm text-right font-semibold text-black">{distribution.average}%</span>
        </div>
        
        <div 
          className="flex items-center"
          role="listitem"
        >
          <span className={`${lato.className} w-16 text-sm text-gray-950`}>Poor</span>
          <div 
            className="flex-1 h-3 ml-2 bg-slate-200"
            role="progressbar"
            aria-valuenow={distribution.poor}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${distribution.poor}% poor ratings`}
          >
            <div 
              className="h-3 bg-yellow-400" 
              style={{ width: `${distribution.poor}%` }}
            ></div>
          </div>
          <span className="w-8 ml-2 text-sm text-right font-semibold text-black">{distribution.poor}%</span>
        </div>
        
        <div 
          className="flex items-center"
          role="listitem"
        >
          <span className={`${lato.className} w-16 text-sm text-gray-950`}>Terrible</span>
          <div 
            className="flex-1 h-3 ml-2 bg-slate-200"
            role="progressbar"
            aria-valuenow={distribution.terrible}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${distribution.terrible}% terrible ratings`}
          >
            <div 
              className="h-3 bg-yellow-400" 
              style={{ width: `${distribution.terrible}%` }}
            ></div>
          </div>
          <span className="w-8 ml-2 text-sm text-right font-semibold text-black">{distribution.terrible}%</span>
        </div>
      </div>
    </div>
  );
};

export default Ratings;