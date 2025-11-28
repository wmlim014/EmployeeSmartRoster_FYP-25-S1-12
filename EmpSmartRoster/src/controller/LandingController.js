async function getAllUploadedVideos() {
    try{
        const body = {
        };

        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/video/view', {
            method: 'GET',
            // body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;

    } catch(error) {
        // console.error(`Failed to register: \n`, error);
        throw new Error(`Failed to get videos: ${error.message}`);
    }
}

async function getAllReviews () {
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
    return data
  }catch (error) {
    console.error("Failed to fetch heading:", error);
  }
};

async function getAllFaqs () {
    // console.log(user_query)
    try{
        const body = {
        };

        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/faq/view', {
            method: 'GET',
            // body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);
        return await data;

    } catch(error) {
        // console.error(`Failed to register: \n`, error);
        throw new Error(`Failed to get FAQs: ${error.message}`);
    }
}

async function getAllsubscriptions () {
  try {
    const response = await fetch(
      "https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/landing-page/subscription-plan/view",
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
    // console.log(data)
    return data
  }catch (error) {
    console.error("Failed to fetch heading:", error);
  }
};

export default {
    getAllUploadedVideos,
    getAllReviews,
    getAllFaqs,
    getAllsubscriptions,
}