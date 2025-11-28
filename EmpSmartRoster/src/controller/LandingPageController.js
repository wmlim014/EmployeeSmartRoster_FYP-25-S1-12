// LandingPageController.js

// Fetch heading data
const getHeading = async () => {
  return getDummyHeading();
};

// Dummy heading data
const getDummyHeading = () => {
  return [
    {
      heading: "Streamlined Scheduling for Smarter Teams",
      subheading:
        "EmpRoster streamlines scheduling and timesheets—reducing conflicts and boosting team productivity.",
    },
  ];
};

// LandingPageController.js

// Fetch video data
const getVideo = async () => {
  try {
    const response = await fetch(
      "https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/video/view",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const { VideoList = [] } = await response.json();

    // Filter to only those with isShown === 1
    const shown = VideoList.filter(v => v.isShown === 1);

    if (shown.length === 0) {
      console.warn("No shown videos; falling back to dummy");
      return getDummyVideo();
    }

    // Map to direct S3 URLs
    return shown.map(v => ({
      videoUrl: `https://emproster.s3.ap-southeast-2.amazonaws.com/video/${v.video_link}`,
      title: v.title,
      createdOn: v.createdOn
    }));
  } catch (err) {
    console.error("getVideo error:", err);
    return getDummyVideo();
  }
};

const getDummyVideo = () => [
  {
    videoUrl: "https://emproster.s3.ap-southeast-2.amazonaws.com/video/1746798395556_Demo2.mp4",
    title: "Fallback Demo",
    createdOn: new Date().toISOString()
  }
];



// Fetch review data
const getReview = async () => {
  try {
    const response = await fetch(
      "https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/reviewrating/view",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const realData = data.ReviewAndRatingList || [];
    console.log("Review Data fetched: ", realData)

    if (realData.length === 0) {
      console.warn("API returned empty review list, using dummy reviews.");
      return getDummyReviews();
    }

    return realData.map((review) => ({
      reviewID: review.reviewID,
      userID: review.user_id,
      rating: review.rating,
      reviewText: review.review,
      createdOn: new Date(review.createdOn).toLocaleDateString(),
    }));
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return getDummyReviews();
  }
};

// Dummy review data
const getDummyReviews = () => {
  return [
    {
      reviewID: 1,
      userID: 1001,
      rating: 5,
      reviewText: "Excellent service! Highly recommend to everyone.",
      createdOn: "2025-03-31",
    },
    {
      reviewID: 2,
      userID: 1002,
      rating: 4,
      reviewText: "Great experience overall, will come back again.",
      createdOn: "2025-04-01",
    },
    {
      reviewID: 3,
      userID: 1003,
      rating: 3,
      reviewText: "Average service, room for improvement.",
      createdOn: "2025-04-02",
    },
    {
      reviewID: 4,
      userID: 1004,
      rating: 5,
      reviewText: "Outstanding support and quick response time.",
      createdOn: "2025-04-03",
    },
    {
      reviewID: 5,
      userID: 1005,
      rating: 2,
      reviewText: "Not satisfied with the service provided.",
      createdOn: "2025-04-04",
    },
    {
      reviewID: 6,
      userID: 1006,
      rating: 4,
      reviewText: "Good value for money, will consider again.",
      createdOn: "2025-04-05",
    },
    {
      reviewID: 7,
      userID: 1007,
      rating: 5,
      reviewText: "Exceptional quality and fantastic customer service.",
      createdOn: "2025-04-06",
    },
    {
      reviewID: 8,
      userID: 1008,
      rating: 3,
      reviewText: "Service was okay, but could be better.",
      createdOn: "2025-04-07",
    },
    {
      reviewID: 9,
      userID: 1009,
      rating: 4,
      reviewText: "Very pleased with the prompt assistance.",
      createdOn: "2025-04-08",
    },
    {
      reviewID: 10,
      userID: 1010,
      rating: 1,
      reviewText: "Very disappointed with the experience.",
      createdOn: "2025-04-09",
    },
  ];
};


// Fetch FAQ data
// LandingPageController.js

// Fetch FAQ data
const getFAQ = async () => {
  try {
    const response = await fetch(
      "https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/faq/view",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const realData = data.FAQList || [];
    console.log("FAQ Returned:", realData);

    // first filter by isShown === 1
    const shownFAQs = realData.filter((faq) => faq.isShown === 1);

    // if there are none, or if the API returned nothing at all, use dummy
    if (realData.length === 0 || shownFAQs.length === 0) {
      console.warn(
        "No visible FAQs returned from API—falling back to dummy FAQs."
      );
      return getDummyFAQ();
    }

    // otherwise map the filtered set
    return shownFAQs.map((faq) => ({
      faqID: faq.faqID,
      question: faq.question_desc,
      answer: faq.answer,
      createdOn: new Date(faq.createdOn).toLocaleDateString(),
    }));
  } catch (error) {
    console.error("Failed to fetch FAQs:", error);
    // error also triggers dummy data
    return getDummyFAQ();
  }
};


// Dummy FAQ data
const getDummyFAQ = () => {
  return [
    {
      faqID: 1,
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' at the login screen and follow the instructions.",
      createdOn: "2025-04-01",
    },
    {
      faqID: 2,
      question: "How can I contact support?",
      answer: "You can reach our support team at support@example.com.",
      createdOn: "2025-04-02",
    },
    {
      faqID: 3,
      question: "Where can I find the user manual?",
      answer: "The user manual is available in the 'Help' section of the app.",
      createdOn: "2025-04-03",
    },
  ];
};

// Fetch subscription plan data
const getSubscriptionPlan = async () => {
  try {
    const response = await fetch(
      "https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/subscriptionplan/view",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const realData = data.SubscriptionPlan || [];

    if (realData.length === 0) {
      console.warn("API returned empty subscription plan list, using dummy plans.");
      return getDummySubscriptionPlans();
    }

    return realData.map((plan) => ({
      subsPlanID: plan.subsPlanID,
      subscription_name: plan.subscription_name,
      subscription_plan_description: plan.subscription_plan_description,
      price: plan.price,
      noOfEmps: plan.noOfEmps,
      createdAt: new Date(plan.createdAt).toLocaleDateString(),
    }));
  } catch (error) {
    console.error("Failed to fetch subscription plans:", error);
    return getDummySubscriptionPlans();
  }
};

// Dummy subscription plan data
const getDummySubscriptionPlans = () => {
  return [
    {
      subsPlanID: 1,
      subscription_name: "Plan 1",
      subscription_plan_description: "Cheapest plan",
      price: "200.00",
      noOfEmps: 5,
      createdAt: "2025-04-04",
    },
    {
      subsPlanID: 2,
      subscription_name: "Plan 2",
      subscription_plan_description: "Standard plan",
      price: "400.00",
      noOfEmps: 10,
      createdAt: "2025-04-05",
    },
    {
      subsPlanID: 3,
      subscription_name: "Plan 3",
      subscription_plan_description: "Premium plan",
      price: "600.00",
      noOfEmps: 20,
      createdAt: "2025-04-06",
    },
  ];
};


export default { getHeading, getVideo, getReview, getFAQ, getSubscriptionPlan};