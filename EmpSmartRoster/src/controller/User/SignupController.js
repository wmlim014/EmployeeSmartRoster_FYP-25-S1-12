import { encodeFileContent } from '../Variables.js'

async function createRegisRequest (bizFile, email, UEN, bizName, password){
    // console.log("BizFile: ", bizFile)
    try{
        // console.log(formattedEmail)
        const fileName = bizFile.name;
        const fileType = bizFile.type || 'application/pdf';
        const convertFileToBase64 = await encodeFileContent(bizFile);

        const body = {
            fileName,
            fileType,
            fileData: convertFileToBase64,
            email,
            UEN,
            bizName, 
            password
        };

        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/s3/guest/register', {
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
        throw new Error(`Registration Failed: ${error.message}`);
    }
}

export default {
    createRegisRequest,
}