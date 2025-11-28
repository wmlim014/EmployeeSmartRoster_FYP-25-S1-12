import { EMAIL_PATTERN, PW_PATTERN } from "../Variables.js"

function ValidateLoginValues (values){
    let error = {}
    
    // Email value validation
    if(values.email === '')
        error.email = "Email should not be empty"

    else if(!EMAIL_PATTERN.test(values.email))
        error.email = "Invalid email format"

    else
        error.email = ""

    // Password value validation
    if(values.password === '')
        error.password = "Password should not be empty"

    else if(!PW_PATTERN.test(values.password))
        error.password = "Invalid password"

    else
        error.password = ""

    return error;
}

export const SubmitLogin = async (values) => {
    try {
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/account/login', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            const data = await response.json();  // Parse JSON response here
            return data;  // Return the parsed data
        } else {
            throw new Error(`Login failed with status ${response.status}`);
        }
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export default {
    ValidateLoginValues,
    SubmitLogin
}