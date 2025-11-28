import { COMPANY_PHONE_PATTERN } from "./Variables.js";

async function getCompany (uid){
    const body = {
        UID: uid,
    }
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/profile', {
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
    } catch (error) {
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to fetch company data: ${error.message}`);
    }
}

async function updateCompanyProfile (data){
    // console.log(data)
    const cleaned = data.contactNo.replace(/\D/g, '').slice(0, 8);
    // const address = data.address.toUpperCase()

    const body = {
        UEN: data.UEN,
        address: data.address,
        contactNo: cleaned,
    }
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/profile/update', {
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
    } catch (error) {
        throw new Error(`Failed to update company data: ${error.message}`);
    }
}

async function getCompanyBizFile (email){
    const body = {
        email: email,
    }
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/s3/owner/downloadpdf', {

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
    } catch (error) {
        console.error(`Network error for fetch company's BizFile: \n`, error);
        throw new Error(`Failed to fetch company's BizFile: ${error.message}`);
    }
}

async function getCompanyRoles (boID){
    // console.log(boID)
    const body = {
        business_owner_id: boID,
    }
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/role/view', {
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
    } catch (error) {
        // console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to fetch company data: ${error.message}`);
    }
}

async function getCompanySkillsets (boID){
    const body = {
        business_owner_id: boID,
    }
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/skillset/view', {
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
    } catch (error) {
        // console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to fetch company data: ${error.message}`);
    }
}

async function setBOCompleteProfile(boID, cContact, address, nric, hpNo, name) {
    // Remove all non-digit characters
    cContact = cContact.replace(/\D/g, '').slice(0, 8);
    hpNo = hpNo.replace(/\D/g, '').slice(0, 8);

    const body = {
        business_owner_id: boID,
        BusinessContactNo: cContact,
        address: address,
        hpNo: hpNo,
        fullName: name,
        nric: nric
    }
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/firstlogin', {
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
    } catch (error) {
        // console.error(`Network error for UID ${name}: \n`, error);
        throw new Error(`Failed to complete user profile: ${error.message}`);
    }
}

async function createRole (roleName, boUID) {
    const body = {
        business_owner_id: boUID,
        roleName: roleName
    }
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/role/add', {
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
    } catch (error) {
        // console.error(`Network error for UID ${name}: \n`, error);
        throw new Error(`Failed to complete user profile: ${error.message}`);
    }
}

async function createSkillset (skillset, boUID, roleID) {
    const body = {
        business_owner_id: boUID,
        skillSetName: skillset,
        roleID: roleID
    }
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/skillset/add', {
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
    } catch (error) {
        // console.error(`Network error for UID ${name}: \n`, error);
        throw new Error(`Failed to complete user profile: ${error.message}`);
    }
}

async function removeRole (roleName, boUID) {
    const body = {
        business_owner_id: boUID,
        roleName: roleName
    }
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/role/delete', {
            method: 'DELETE',
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
    } catch (error) {
        // console.error(`Network error for UID ${name}: \n`, error);
        throw new Error(`Failed to complete user profile: ${error.message}`);
    }
}

async function removeSkillset (skillset, boUID) {
    const body = {
        business_owner_id: boUID,
        skillSetName: skillset
    }
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/skillset/delete', {
            method: 'DELETE',
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
    } catch (error) {
        // console.error(`Network error for UID ${name}: \n`, error);
        throw new Error(`Failed to complete user profile: ${error.message}`);
    }
}

const handleSelectedDetail = (selectedCompany) => {
    return selectedCompany;
}

function handleFilterUENBizName(companies, filterString){
    const filteredData = companies.filter((company) => {
        const search = filterString.trim().toLowerCase();
        if (!search) return true;

        const uenMatch = company.UEN.toLowerCase().includes(search);
        const bizNameMatch = company.bizName.toLowerCase().includes(search);

        return uenMatch || bizNameMatch;
    })
    return filteredData
}

function validateVirtualPhoneNo(phone) {
    // Remove all non-digit characters first 
    // and prevent user to input more than 8 number
    const cleaned = phone.replace(/\D/g, '').slice(0, 8);
    // console.log("Phone: ", cleaned)
    // console.log("valid format: ", COMPANY_PHONE_PATTERN.test(cleaned))

    if(!COMPANY_PHONE_PATTERN.test(cleaned))
        return "Invalid Virtual Phone Format (8 digits and starting with 6)"
    else
        return ''
}

function checkIfRoleCreated (allRoles, roleName) {
    // console.log("All Roles: ", allRoles)
    // console.log("New Role: ", roleName)
    const role = allRoles.filter((role) => 
        role.roleName.toUpperCase() === roleName.trim().toUpperCase()
    )
    return role
}

function checkIfSkillsetCreated (allSkills, skillName){
    const skill = allSkills.filter((skill) => 
        skill.skillSetName.toUpperCase() === skillName.trim().toUpperCase()
    )
    return skill
}

function getSkillsetsForARole (roleId, allSkills) {
    // console.log(roleId, allSkills)
    const skill = allSkills.filter((skill) => 
        skill.roleID === roleId
    )
    // console.log(roleId, skill)
    return skill
}

export default {
    getCompany,
    updateCompanyProfile,
    getCompanyBizFile,
    getCompanyRoles,
    getCompanySkillsets,
    setBOCompleteProfile,
    handleSelectedDetail,
    handleFilterUENBizName,
    validateVirtualPhoneNo,
    createRole,
    createSkillset,
    removeRole,
    removeSkillset,
    checkIfRoleCreated,
    checkIfSkillsetCreated,
    getSkillsetsForARole,
}