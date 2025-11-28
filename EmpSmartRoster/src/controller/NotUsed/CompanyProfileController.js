// CompanyProfileController.js

export async function getCompanyProfile(UID) {
    const apiUrl = "https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/profile";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UID })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Company Profile Data:", data);
      return data; 
    } catch (error) {
      console.error("Error in getCompanyProfile:", error);
      throw error;
    }
  }
  
  export async function updateCompanyProfile({
    newEmail,
    originalEmail,
    originalBizName,
    newBizName,
    originalAddress,
    newAddress
  }) {
    const apiUrl = "https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/profile/update";
    try {
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newEmail,
          originalEmail,
          originalBizName,
          newBizName,
          originalAddress,
          newAddress
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Updated Company Profile Data:", data);
      return data;
    } catch (error) {
      console.error("Error in updateCompanyProfile:", error);
      throw error;
    }
  }
  
  export default {
    getCompanyProfile,
    updateCompanyProfile,
  };
  