// https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/employee/add
// "business_owner_id: 2,
//         user_id: 4,
//         email: ""employee2new@example.com"",
//         hpNo: 90002222,
//         resStatusPassType: ""Work Permit"",
//         jobTitle: ""Manager of the beaunite group"",
//         roles: ""Developer"",
//         standardWrkHrs: 5,
//         skillsets: ""Java"",
//         noOfLeave: 5,
//         noOfLeaveAvailable: 5,
//         noOfMC: 4,
//         noOfMCAvailable: 4,
//         startWorkTime: ""10:00:00"",
//         endWorkTime: ""11:00:00"",
//         daysOfWork: 6,
//         activeOrInactive: 1"
// EmployeeController.js


async function createEmployee(values) {
    try {
        const response = await fetch(
            'https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/employee/add',
            {
                method: 'POST',
                body: JSON.stringify(values),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.ok) {
            const data = await response.json();
            return data; // You *can* return this if you want to display a message or refresh data.
        } else {
            throw new Error(`Create employee failed: ${response.status}`);
        }
    } catch (error) {
        console.error("CreateEmployee error:", error);
        throw error;
    }
}

export default {
    createEmployee
};
