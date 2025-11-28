import { EMAIL_PATTERN, PHONE_PATTERN, NRIC_PATTERN } from "../../controller/Variables";

function validateEmail(email) {
    if(!EMAIL_PATTERN.test(email))
        return "Invalid Email Format Found"
    else
        return ""
}

function validateNRICofFIN(nric) {
    if(!NRIC_PATTERN.test(nric))
        return "Invalid NRIC/FIN Format Found"
    else
        return ""
}

function validatePhoneNo(phone) {
    const cleaned = phone.replace(/\D/g, '').slice(0, 8);
    // console.log("Phone: ", cleaned)
    // console.log("valid format: ", COMPANY_PHONE_PATTERN.test(cleaned))

    if(!PHONE_PATTERN.test(cleaned))
        return "Invalid Phone Format (8 digits and starting with 8 or 9)"
    else
        return ''
}

async function getBOUsers () {
    const body = {

    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/businessowner/list/view', {
            method: 'GET',
            body: JSON.stringify(),
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
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to fetch company data: ${error.message}`);
    }
}

async function handleSuspendUser (uid, reason) {
    const body = {
        UID: uid,
        reasonOfSuspend: reason
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/user/suspend', {
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
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to suspend the user: ${error.message}`);
    }
}

async function handleUsuspendUser (uid, ) {
    const body = {
        UID: uid,
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/user/unsuspend', {
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
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to suspend the user: ${error.message}`);
    }
}

function handleFilterRole (allData, role) {
    const filteredData = allData.filter((data) => {
        const roleMatch = role === "" || 
            data.role === role
        return roleMatch
    });
    return filteredData;
}

function getUserOwnesCompany (users, companyID) {
    // console.log("All Users", users)
    const userOwnes = users.filter((data) => {
        const cIDMatch = companyID === "" ||
            data.ownes === companyID
        return cIDMatch
    })
    // console.log("Company ownes by User", userOwnes)
    return userOwnes
}

function handleUserAccStatusFilter(companies, accStatus) {
    const filteredData = companies.filter((company) => {
        const dataAccStatus = company.owner.isSuspended
        // If accStatus is 'Activated'
        if (accStatus === 'Activated'){
            const IS_SUSPENDED = 0  // The account is not suspended
            return dataAccStatus === IS_SUSPENDED  
        }
        else {
            const IS_SUSPENDED = 1  // The account is suspended
            return dataAccStatus === IS_SUSPENDED  
        }
    })
    return filteredData;
}

// Check if user registered an account before
async function checkIfEmailRegistered(email) {
    const body = {
        email: email,
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/account/change-password/send-email-address', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        return await data;
    } catch(error) {
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to suspend the user: ${error.message}`);
    }
}

async function boGetUserProfile(boUID) {
    const body = {
        business_owner_id: boUID,
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/profile/view', {
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
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to suspend the user: ${error.message}`);
    }
}

async function boUpdateUserProfile(boUID, updatedData) {
    // console.log(updatedData)
    const cleaned = updatedData.hpNo.replace(/\D/g, '').slice(0, 8);

    const body = {
        business_owner_id: boUID,
        email: updatedData.email,
        hpNo: cleaned,
        fullName: updatedData.fullName,
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/profile/update', {
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
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to suspend the user: ${error.message}`);
    }
}

async function empGetUserProfile(empUID) {
    const body = {
        employee_user_id: empUID,
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/profile/view', {
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
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to suspend the user: ${error.message}`);
    }
}

async function empUpdateUserProfile(empUID, updatedData) {
    // console.log(updatedData)
    const cleaned = updatedData.hpNo.replace(/\D/g, '').slice(0, 8);

    const body = {
        employee_user_id: empUID,
        email: updatedData.email,
        hpNo: cleaned,
        fullName: updatedData.fullName,
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/profile/update', {
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
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to suspend the user: ${error.message}`);
    }
}

export default {
    validateEmail,
    validateNRICofFIN,
    validatePhoneNo,
    handleFilterRole,
    getUserOwnesCompany,
    handleUserAccStatusFilter,
    getBOUsers,
    handleSuspendUser,
    handleUsuspendUser,
    checkIfEmailRegistered,
    boGetUserProfile, 
    boUpdateUserProfile, 
    empGetUserProfile,
    empUpdateUserProfile,
}