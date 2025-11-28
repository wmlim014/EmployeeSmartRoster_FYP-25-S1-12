
const ViewRatingController = async () => {
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

    // If real data is empty, use dummy data
    if (realData.length === 1) {
      console.warn("API returned empty list, using dummy data.");
      return getDummyData();
    }

    return realData;
  } catch (error) {
    console.error("Failed to fetch review and rating list:", error);
    return getDummyData(); // fallback if fetch fails
  }
};

// Dummy data generator
const getDummyData = () => {
  return [
    {
      reviewID: 1,
      user_id: 1001,
      rating: 5,
      review: "Excellent service!",
      createdOn: "2025-03-31T16:08:09.000Z",
    },
    {
      reviewID: 2,
      user_id: 1002,
      rating: 3,
      review: "It was okay.",
      createdOn: "2025-04-01T09:15:22.000Z",
    },
    {
      reviewID: 3,
      user_id: 1003,
      rating: 4,
      review: "Good experience.",
      createdOn: "2025-04-02T13:47:10.000Z",
    },
    {
      reviewID: 4,
      user_id: 1004,
      rating: 2,
      review: "Not great, not terrible.",
      createdOn: "2025-04-03T11:00:00.000Z",
    },
    {
      reviewID: 5,
      user_id: 1005,
      rating: 1,
      review: "Very bad experience.",
      createdOn: "2025-04-04T08:00:00.000Z",
    },
    {
      reviewID: 6,
      user_id: 1006,
      rating: 5,
      review: "Amazing support team!",
      createdOn: "2025-04-05T14:20:00.000Z",
    },
    {
      reviewID: 7,
      user_id: 1007,
      rating: 3,
      review: "Just average.",
      createdOn: "2025-04-06T12:30:00.000Z",
    },
    {
      reviewID: 8,
      user_id: 1008,
      rating: 4,
      review: "I liked it.",
      createdOn: "2025-04-07T17:45:00.000Z",
    },
    {
      reviewID: 9,
      user_id: 1009,
      rating: 2,
      review: "Could be improved.",
      createdOn: "2025-04-08T10:10:00.000Z",
    },
    {
      reviewID: 10,
      user_id: 1010,
      rating: 1,
      review: "Terrible UI and bugs.",
      createdOn: "2025-04-09T08:05:00.000Z",
    },
  ];
};

export default ViewRatingController;
