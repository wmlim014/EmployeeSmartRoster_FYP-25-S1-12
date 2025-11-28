import { useState, useEffect } from 'react';
import { formatDateTime } from '../../controller/Variables.js'
import { formatTextForDisplay } from '../../controller/Variables.js'
import './LandingPage.css';
import LandingController from '../../controller/LandingController';
import appLogo from "../../../public/assets/Logo.png";
import {TiTick,BsChevronDown} from "../../../public/Icons.js"

interface Subscription {
  subsPlanID: number,
  subscription_name: string,
  subscription_plan_description: string,
  price:string,
  noOfEmps: number,
  createdAt: string
}

interface Review {
  reviewID: number;
  user_id: number;
  rating: number;
  review: string;
  fullName: string;
  createdOn: string;
}

interface Faq {
  faqID: number;
  question_desc: string;
  answer: string;
  createdOn: string;
}

type VideoItem = {
  video_link: string;
  videoID: number;
  title: string;
  createdOn: string;
  isShown: number;
  video_description: string;
};

const { getAllUploadedVideos, getAllReviews, getAllFaqs, getAllsubscriptions } = LandingController;

const LandingPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [expandedFaqs, setExpandedFaqs] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string>("");
  const [descriptionClass, setDescriptionClass] = useState<string>('visible');

  useEffect(() => {
    fetchVideos();
    fetchReviews();
    fetchFaqs();
    fetchSubscriptions();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await getAllUploadedVideos();
      const vids = response?.VideoList ?? [];
      setVideos(vids);
      setActiveVideo(vids.length > 0 ? vids[0] : null);
    } catch {
      setError("Failed to load videos.");
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await getAllReviews();
      const reviewsList = response?.ReviewAndRatingList ?? [];
      const filteredSortedReviews = reviewsList
        .filter((review: any) => review.rating >= 4)
        .sort((a: any, b: any) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());

      setReviews(filteredSortedReviews);
    } catch {
      setError("Failed to load reviews.");
    }
  };

  const fetchFaqs = async () => {
    try {
      const response = await getAllFaqs();
      const faqsList = response?.FAQList ?? [];
      const filteredSortedfaqsList = faqsList
        .filter((FAQs: any) => FAQs.isShown === 1)
      setFaqs(filteredSortedfaqsList);
    } catch {
      setError("Failed to load FAQs.");
    }
  };

  const features: string[] = [
    "AI ChatBot",
    "Customisation",
    "Export Schedules",
    "Clock in & out",
    "Generate timesheet",
    "Shift swapping request",
    "Auto task assignation",
    "Leave management",
    "Task tracking",
  ];

  const fetchSubscriptions = async () => {
    try {
      const response = await getAllsubscriptions();
      const subscriptionsList = response?.SubscriptionPlan ?? [];
      setSubscriptions(subscriptionsList);
      // console.log(subscriptionsList)
    } catch {
      setError("Failed to load SubscriptionsList.");
    }
  };

  const toggleFaq = (faqID: number) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [faqID]: !prev[faqID]
    }));
  };

  const [videoLoading, setVideoLoading] = useState(false);
  const [transitionClass, setTransitionClass] = useState('');
  const [showTabs, setShowTabs] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Enhanced Video Selection with Smooth Transition
  const handleVideoSelect = async (video: VideoItem, index: number) => {
    setVideoLoading(true);
    setTransitionClass('video-exit');
    setDescriptionClass('hidden'); // Hide description immediately

    await new Promise(resolve => setTimeout(resolve, 200));
    
    setActiveVideo(video);
    setCurrentIndex(index);
    setTransitionClass('video-enter');
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setTransitionClass('');
    setVideoLoading(false);
    setShowTabs(false);

    // Small delay to ensure DOM update
    setTimeout(() => {
      setDescriptionClass('visible');
    }, 50);
  };


  // Auto-play next video on video end
  useEffect(() => {
    const videoElement = document.querySelector(".video-wrapper video");

    if (videoElement) {
      videoElement.addEventListener("ended", handleNextVideo);
      return () => {
        videoElement.removeEventListener("ended", handleNextVideo);
      };
    }
  }, [currentIndex, videos]);

  // Auto-play next video logic
  const handleNextVideo = () => {
    const nextIndex = (currentIndex + 1) % videos.length;
    handleVideoSelect(videos[nextIndex], nextIndex);
  };
  
  

  return (
    <div className="landing-container">
      <section className="landing-words-container" id="top">
        <p className='landing-company-name'>EmpRoster</p>
        <p className='landing-company-description'>EmpRoster simplifies employee scheduling with smart rostering, shift management, and time swapping tools — making workforce coordination effortless and efficient.</p>
      </section>

      <section className="video-selector-section" id="demo">
        <div className="video-container-wrapper">
          <div className="video-container">
            {activeVideo && (
              <div className={`video-wrapper ${transitionClass}`}>
                <video
                  autoPlay
                  muted
                  playsInline
                  onLoadStart={() => setVideoLoading(true)}
                  onLoadedData={() => setVideoLoading(false)}
                  onEnded={() => handleNextVideo()}
                  key={activeVideo.videoID}
                >
                  <source
                    src={`https://emproster.s3.ap-southeast-2.amazonaws.com/video/${activeVideo.video_link}`}
                    type="video/mp4"
                  />
                </video>
                {videoLoading && (
                  <div className="video-loading">
                    <div className="loading-spinner"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="video-tabs-container">
            <button 
              className="dropdown" 
              onClick={() => setShowTabs(!showTabs)}
              aria-expanded={showTabs}
            >
              <span className="active-video-title">
                {activeVideo?.title || "Select Video"}
              </span>
              <BsChevronDown className={`dropdown-icon ${showTabs ? 'rotated' : ''}`} />
            </button>
            
            <div className={`video-tabs ${showTabs ? 'show' : ''}`}>
              {videos.map((video,index) => (
                <button
                  key={video.videoID}
                  className={`video-tab ${activeVideo?.videoID === video.videoID ? 'active' : ''}`}
                  onClick={() => {
                    handleVideoSelect(video,index);
                    setShowTabs(false);
                  }}
                >
                  {video.title}
                </button>
              ))}
            </div>
          </div>

        <div className={`video-description ${descriptionClass}`}>
          {activeVideo && <p>{activeVideo.video_description}</p>}
        </div>
      </section>
            

      <section className="landing-subscription" id="subscription">
        <h2>Our Subscription Plans</h2>
        <div className="subscription-plans-container">
          {subscriptions.map((subscription) => (
            <div className="subscription-plan-card" key={subscription.subsPlanID}>
              <p className="plan">{subscription.subscription_name}</p>
              <p className="price">${subscription.price} / month</p>
              <p className="emp-limit heart-beat">{subscription.subscription_plan_description}</p>
              <ul className="features-list">
                {features.map((feature, index) => (
                  <li key={index}>
                    <TiTick className="feature-tick"/> 
                    <span className="feature-text">{feature}</span>
                  </li>
                ))}
                </ul>
              </div>
            ))}
        </div>
        <p className="subscription-disclaimer">
          *Disclaimer: All users start on the Free Plan by default. To unlock the unlimited employee feature, subscribe for $20/month.
        </p>
      </section>


      <section className="landing-reviews" id="reviews">
        <h2>What Our Users Say</h2>
        {error ? (
          <div className="error">{error}</div>
        ) : reviews.length > 0 ? (
          <div className="landing-reviews-grid scrolling">
            {reviews.map((review) => (
              <div className="landing-review-card" key={review.reviewID}>
                <div className="landing-review-header">
                  <div className="landing-review-rating">{'★'.repeat(review.rating)}</div>
                  <p className="landing-review-name">{review.fullName}</p>
                </div>
                <p className="landing-review-text">"{review.review}"</p>
                <p className="landing-review-createOn">{formatDateTime(review.createdOn)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews available.</p>
        )}
      </section>

      <section className="landing-faq" id="faq">
        <h2>Frequently Asked Questions</h2>
        {error ? (
          <div className="error">{error}</div>
        ) : faqs.length > 0 ? (
          <div className="landing-faq-list">
            {faqs.map((faq) => (
              <div className="landing-faq-item" key={faq.faqID} aria-expanded={expandedFaqs[faq.faqID] || false}>
                <div className="landing-faq-question" onClick={() => toggleFaq(faq.faqID)}>
                  {faq.question_desc}
                  <span>{expandedFaqs[faq.faqID] ? '−' : '+'}</span>
                </div>
                <div className="landing-faq-answer" aria-hidden={!expandedFaqs[faq.faqID]}>
                  {faq.answer ? (
                    <p dangerouslySetInnerHTML={{__html: formatTextForDisplay(faq.answer)}}/>
                  ) : (
                    <p>No answer available.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No FAQs available.</p>
        )}
      </section>


      <footer className="footer">
        <p>© 2025 EmpRoster. All rights reserved.</p>
        <button 
          onClick={() => {
            document.querySelector("#top")?.scrollIntoView({ behavior: "smooth" });
          }} 
          className="landing-nav-logo-btn"
        >
          <img src={appLogo} alt="Dashboard" className="landing-nav-logo" />
        </button>
      </footer>
    </div>
  );
};

export default LandingPage;
