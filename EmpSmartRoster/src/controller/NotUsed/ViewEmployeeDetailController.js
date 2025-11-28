// controller/ViewEmployeeList.js

const ViewEmployeeList = async (business_owner_id) => {
    try {
      const response = await fetch("https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/employee/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ business_owner_id }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.employeeList || [];
    } catch (error) {
      console.error("Failed to fetch employee list:", error);
      return [];
    }
  };
  
  export default ViewEmployeeList;
  