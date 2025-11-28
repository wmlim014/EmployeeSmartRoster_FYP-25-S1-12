import { encodeFileContent } from "./Variables";

async function empGetAllLeave(user_id) {
    const body = {
        employee_user_id: user_id,
    };
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/leaverequest/view', {
            method: 'POST',
            body: JSON.stringify(body),
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
        // console.error(`Failed to re-allocate employee to task ${taskName}: \n`, error);
        throw new Error(`Failed to fetch all submitted leave management: ${error.message}`);
    }
}

async function empSubmitLeave(empUID, boUID, values) {
    // console.log(empUID, boUID)
    const body = {
        employee_user_id: empUID,
        type: values.type,
        description: values.description,
        leaveStart: values.leaveStart,
        leaveEnd: values.leaveEnd,
        business_owner_id: boUID
    };
    // console.log(body)
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/leaverequest/add', {
            method: 'POST',
            body: JSON.stringify(body),
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
        // console.error(`Failed to re-allocate employee to task ${taskName}: \n`, error);
        throw new Error(`Failed to submit new leave management: ${error.message}`);
    }
}

async function empCancelLeaveRequest (leaveID) {
    const body = {
        leaveID: leaveID,
    };
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/leaverequest/update', {
            method: 'PATCH',
            body: JSON.stringify(body),
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
        // console.error(`Failed to re-allocate employee to task ${taskName}: \n`, error);
        throw new Error(`Failed to submit new leave management: ${error.message}`);
    }
}

async function empSubmitMC (mcFile, empUID, boUID, values){
    // console.log("mcFile: ", bizFile)
    try{
        // console.log(formattedEmail)
        const type = values.type;
        const description = values.description;
        const leaveStart = values.leaveStart
        const leaveEnd = values.leaveEnd
        const employee_user_id = empUID;
        const business_owner_id = boUID;  
        const fileName = mcFile.name;
        const fileType = mcFile.type || 'application/pdf';
        const convertFileToBase64 = await encodeFileContent(mcFile);

        const body = {
            fileName,
            fileType,
            fileData: convertFileToBase64,
            type,
            description,
            leaveStart, 
            leaveEnd,
            employee_user_id,
            business_owner_id
        };

        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/s3/employee/upload', {
            method: 'POST',
            body: JSON.stringify(body),
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
        throw new Error(`Upload MC failed: ${error.message}`);
    }
}

async function getMCFile(mcID) {
    const body = {
        mcID: mcID,
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/s3/employee/download', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(response.status !== 200) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        // console.error(`Network error: \n`, error);
        throw new Error(`Failed to fetch MC file: ${error.message}`);
    }
}

// BO leave management controller
async function boGetAllLeave(user_id) {
    // console.log(user_id)
    const body = {
        business_owner_id: user_id,
    };
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/leaveormc/view', {
            method: 'POST',
            body: JSON.stringify(body),
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
        // console.error(`Failed to re-allocate employee to task ${taskName}: \n`, error);
        throw new Error(`Failed to fetch all submitted leave management: ${error.message}`);
    }
}

async function boApproveORejectLeave(leaveID, status, description) {
    // console.log(user_id)
    const body = {
        leaveID: leaveID,
        status: status,
        description: description
    };
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/leaveormc/update', {
            method: 'PATCH',
            body: JSON.stringify(body),
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
        // console.error(`Failed to re-allocate employee to task ${taskName}: \n`, error);
        throw new Error(`Failed to update leave management: ${error.message}`);
    }
}

// Filtering functions
function handleFilterStatus(allLeaves, filterStatus) {
    const filteredData = allLeaves.filter((leave) => {
        return leave.status === filterStatus
    })
    return filteredData
}

function handleFilterType(allLeaves, filterType) {
    // console.log(filterType)
    const filteredData = allLeaves.filter((leave) => {
        return leave.type === filterType
    })
    return filteredData
}

function handleFilterString(allLeaves, filterString) {
  const filteredData = allLeaves.filter((leave) => {
    const search = filterString.trim().toLowerCase();
    if (!search) return true;

    const nameMatch = leave.fullName.toLowerCase().includes(search);

    return nameMatch
  })
  return filteredData
}

export default {
    empGetAllLeave,
    empSubmitLeave,
    empCancelLeaveRequest,
    empSubmitMC,
    getMCFile,
    boGetAllLeave,
    boApproveORejectLeave,
    handleFilterStatus,
    handleFilterType,
    handleFilterString
}