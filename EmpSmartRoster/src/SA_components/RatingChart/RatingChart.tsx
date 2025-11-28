import { useState, useEffect } from "react";
import { useAlert } from "../../components/PromptAlert/AlertContext";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReviewRatingController from "../../controller/Review_Rating/ReviewRatingController";
import "./RatingChart.css";
import "../../../public/styles/common.css";

interface Review {
  reviewID: number;
  user_id: number;
  rating: number;
  review: string;
  fullName: string;
  createdOn: string;
}

const { saViewReviewRating } = ReviewRatingController;

const COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#845EC2', '#FF9671'];

const RatingChart = () => {
  const { showAlert } = useAlert();
  const [allReview, setAllReview] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSAReview = async () => {
    try {
      setLoading(true);
      const response = await saViewReviewRating();
      // Ensure we handle both array and object responses
      const reviews = Array.isArray(response?.ReviewAndRatingList) 
        ? response.ReviewAndRatingList 
        : [];
      setAllReview(reviews);
    } catch (error) {
      showAlert(
        'submitReview',
        '',
        error instanceof Error ? error.message : String(error),
        { type: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchSAReview(); 
  }, []);

  // Process data into pie chart format
  const ratingCounts = allReview.reduce((acc: Record<number, number>, curr) => {
    const rating = curr.rating;
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Create chart data array for 0-5 stars
  const ratingData = [0, 1, 2, 3, 4, 5].map(rating => ({
    name: `${rating} Star${rating !== 1 ? 's' : ''}`,
    value: ratingCounts[rating] || 0
  }));

  if (loading) {
    return <div className="loading-message">Loading chart data...</div>;
  }

  return (
    <div className='chartContent' style={{ width: '100%', height: 400, maxWidth: 600, margin: '0 auto' }}>
      <h1>Rating Distribution (Total: {allReview.length})</h1>
      {allReview.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={ratingData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {ratingData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [
                `${value} reviews`,
                name
              ]}
            />
            <Legend 
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value) => (
                <span style={{ color: '#333' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="no-data-message">No reviews available</div>
      )}
    </div>
  );
};

export default RatingChart;