import { PW_PATTERN } from "../Variables.js";


async function handleSendResetPwURL(email){
    // Trigger check user email and send url API here

    // return response code
}

async function handleResetPassword(email, password){
    const body = {
        email: email,
        password: password
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/account/change-password', {
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
        throw new Error(`Failed to fetch company data: ${error.message}`);
    }
}

function validateNewPassword(newPw) {
    // Password value validation
    if(!PW_PATTERN.test(newPw))
        return "Invalid password format"
    else
        return ""
}

function validateConfirmNewPassword(newPw, confirmNewPw) {
    // console.log(`
    //     NEW PASSWORD: ${newPw}\n
    //     CONFIRM NEW PASSWORD: ${confirmNewPw}
    // `)
    // Confirm password value validation
    if(confirmNewPw !== newPw)
        return "Confirm password doesn't match with password"
    else
        return ""
}

export default {
    handleSendResetPwURL,
    handleResetPassword,
    validateNewPassword,
    validateConfirmNewPassword,
}