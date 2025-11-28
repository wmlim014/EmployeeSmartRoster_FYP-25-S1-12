function generateDefaultPw(name, hpNo, nric) {
    const shortName = name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();

    const last4Hp = hpNo.slice(-4)
    const nricStart = nric.slice(0, 3).toLowerCase();

    return `${shortName}${last4Hp}_${nricStart}`
}

function calWrkingHrs(startTime, endTime) {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const totalStart = startH * 60 + startM
    const totalEnd = endH * 60 + endM
    
    return (totalEnd - totalStart) / 60
}


function getRoleIdForEmp (allRoles, roleName){
    // console.log(allRoles, roleName)
    const role = allRoles.filter((role) => 
        role.roleName === roleName
    )
    // console.log(allRoles, roleName)
    return role
} 

function getSkillIdForEmp (allSkills, skillName){
    const skill = allSkills.filter((skill) => 
        skill.skillSetName === skillName
    )
    return skill
} 

function getRoleNameForEmp (allRoles, roleID){
    // console.log(allRoles, roleID)
    const role = allRoles.filter((role) => 
        role.roleID === roleID
    )
    return role
} 

function getSkillNameForEmp (allSkills, skillID){
    const skill = allSkills.filter((skill) => 
        skill.skillSetID === skillID
    )
    return skill
} 

async function createEmployee(boUID, values, allRoles, allSkills) {
    // console.log(values)
    const defaultPw = generateDefaultPw(values.fullName, values.hpNo, values.nric)
    const standardWrkHrs = calWrkingHrs(values.startWorkTime, values.endWorkTime)
    const role = getRoleIdForEmp(allRoles, values.roleID)
    const skill = getSkillIdForEmp(allSkills, values.skillSetID)
    const cleanedHp = values.hpNo.replace(/\D/g, '').slice(0, 8); // Remove the non-digit character
    
    const body = {
        business_owner_id: boUID,
        email: values.email.toLowerCase(),
        password: defaultPw,
        nric: values.nric,
        hpNo: cleanedHp,
        fullName: values.fullName,
        resStatusPassType: values.resStatusPassType,
        roleID: role[0].roleID,
        standardWrkHrs: standardWrkHrs,
        skillSetID: skill[0].skillSetID,
        noOfLeave: values.noOfLeave,
        noOfLeaveAvailable: values.noOfLeave,
        noOfMC: values.noOfMC,
        noOfMCAvailable: values.noOfMC,
        startWorkTime: values.startWorkTime,
        endWorkTime: values.endWorkTime,
        daysOfWork: values.daysOfWork,
        activeOrInactive: 1,
        dateJoined: values.dateJoined.split(" ")[0]
    };

    // console.log("Sending employee data to API:", body);

    try {
        const response = await fetch(
            'https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/employee/add',
            {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        // console.log("API Response Status:", response);
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return {
            empData: {
                ...values,
                user_id: parseInt(Date.now()), // Generate temper new employee ID
                hpNo: cleanedHp, 
                dateJoined: new Date().toISOString(),
                roleID: role[0].roleID,
                skillSetID: skill[0].skillSetID,
                standardWrkHrs: standardWrkHrs,
                noOfLeaveAvailable: values.noOfLeave,
                noOfMCAvailable: values.noOfMC,
                activeOrInactive: 1
            },
            response: {...data}
        };
    } catch (error) {
        throw new Error(`Failed to create employee: ${error.message}`);
    }
}

function updateLeaveNMCCounts(originalAvailable, originalDays, newDays) {
    // console.log(originalDays, newDays)
    const different = Number(newDays) - Number(originalDays);
    const newAvailable = originalAvailable + different;
    return Math.max(0, newAvailable);
}

async function editEmployee(boUID, originalValues, values, allRoles, allSkills) {
    // console.log(originalValues)
    const standardWrkHrs = calWrkingHrs(values.startWorkTime, values.endWorkTime)
    const role = getRoleIdForEmp(allRoles, values.roleID)
    const skill = getSkillIdForEmp(allSkills, values.skillSetID)
    const cleanedHp = values.hpNo.replace(/\D/g, '').slice(0, 8); // Remove the non-digit character
    // Apply diff to available count
    let newLeaveAvailable = updateLeaveNMCCounts(originalValues.noOfLeaveAvailable, originalValues.noOfLeave, parseInt(values.noOfLeave))
    let newMCAvailable = updateLeaveNMCCounts(originalValues.noOfMCAvailable, originalValues.noOfMC, parseInt(values.noOfMC))

    const body = {
        business_owner_id: boUID,
        user_id: originalValues.user_id,
        email: values.email,
        nric: values.nric,
        hpNo: cleanedHp,
        fullName: values.fullName,
        resStatusPassType: values.resStatusPassType,
        roleID: role[0].roleID,
        standardWrkHrs: standardWrkHrs,
        skillSetID: skill[0].skillSetID,
        noOfLeave: values.noOfLeave,
        noOfLeaveAvailable: newLeaveAvailable,
        noOfMC: values.noOfMC,
        noOfMCAvailable: newMCAvailable,
        startWorkTime: values.startWorkTime,
        endWorkTime: values.endWorkTime,
        daysOfWork: values.daysOfWork,
        activeOrInactive: 1,
    };

    // console.log("Sending employee data to API:", body);
    // console.log("Sending to API", {
    //     noOfLeave: values.noOfLeave,
    //     noOfLeaveAvailable: newLeaveAvailable,
    //     noOfMC: values.noOfMC,
    //     noOfMCAvailable: newMCAvailable
    // });
    try {
        const response = await fetch(
            'https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/employee/update',
            {
                method: 'PATCH',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        // console.log("API Response Status:", response);
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return {
            empData: {
                ...values,
                hpNo: parseInt(cleanedHp, 10), // Convert to number like other records
                roleID: role[0].roleID,
                skillSetID: skill[0].skillSetID,
                standardWrkHrs: standardWrkHrs,
                noOfMCAvailable: newMCAvailable,
                noOfLeaveAvailable: newLeaveAvailable,
                activeOrInactive: 1
            },
            response: {...data} // Spread any additional fields from the API response
        };
    } catch (error) {
        throw new Error(`Failed to create employee: ${error.message}`);
    }
}

async function inactiveOrActiveEmployee(empId, isActivate) {
    const body = {
        user_id: empId,
        activeOrInactive: isActivate
    }

    try {
        const response = await fetch(
            'https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/employee/status/update',
            {
                method: 'PATCH',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        // console.log("API Response Status:", response);
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data // Spread any additional fields from the API response
    } catch (error) {
        throw new Error(`Failed to create employee: ${error.message}`);
    }
}

function validateEndWorkTime (start, end) {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    const startTotalMinutes = startH * 60 + startM;
    const endTotalMinutes = endH * 60 + endM;

    if (startTotalMinutes > endTotalMinutes)
        return 'The end work time must bigger than the start work time'
    else
        ''
}

export default {
    createEmployee,
    editEmployee,
    validateEndWorkTime,
    getRoleIdForEmp,
    getSkillIdForEmp,
    getRoleNameForEmp,
    getSkillNameForEmp,
    inactiveOrActiveEmployee
};
