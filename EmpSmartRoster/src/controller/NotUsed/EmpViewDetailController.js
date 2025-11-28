// controller/EmpViewDetailController.js

/**
 * Fetches the current employee's profile by their user ID.
 * 
 * @param {number} employee_user_id - The UID of the logged-in employee.
 * @returns {Promise<Array>} - Resolves to an array containing the employeeProfile object.
 */
const EmpViewDetail = async (employee_user_id) => {
  try {
    const response = await fetch(
      "https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/profile/view",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employee_user_id }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // The API returns { employeeProfile: [...] }
    return data.employeeProfile || [];
  } catch (error) {
    console.error("Failed to fetch employee profile:", error);
    return [];
  }
};

export default EmpViewDetail;
