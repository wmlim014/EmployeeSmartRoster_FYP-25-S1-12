import React, { useEffect, useState } from "react";
import LandingPageController from '../../controller/LandingPageController';
import { FaStar } from "react-icons/fa";
import "./Review.css";

type Review = {
  reviewID: number;
  reviewText: string;
  rating: number;
  createdOn: string; // current format displayed: "yyyy-mm-dd", not the most common??
};

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const fetchedReviews = await LandingPageController.getReview();
      setReviews(fetchedReviews);
    };

    fetchReviews();
  }, []);

  const currentYear = new Date().getFullYear();

  const filteredReviews = reviews.filter((review) => {
    const reviewYear = new Date(review.createdOn).getFullYear();
    console.log("Review Year:", review.createdOn);
    return review.rating >= 4 && review.createdOn.includes("2025") //to return our current year only (2025)
  });

  const shouldScroll = filteredReviews.length > 3;

  return (
    <div className="reviews-section">
      <h2 className="reviews-title">What Our Users Say</h2>
      <div className={`reviews-container ${shouldScroll ? 'scrolling' : ''}`}>
        {filteredReviews.map((review) => (
          <div key={review.reviewID} className="review-card">
            <p className="review-text">"{review.reviewText}"</p>
            <div className="review-rating">
              {Array.from({ length: 5 }, (_, index) => (
                <FaStar
                  key={index}
                  color={index < review.rating ? "#FFD700" : "#e4e5e9"}
                  size={20}
                />
              ))}
            </div>
            <p className="review-date">Reviewed on: {review.createdOn}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
