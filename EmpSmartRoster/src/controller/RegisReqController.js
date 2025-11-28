async function getRegistrationRequests (){
    const body = {

    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/registrationrequest/view', {
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
        console.error(`Network error: \n`, error);
        throw new Error(`Failed to fetch registration data: ${error.message}`);
    }
}

async function setRegistrationRequest(registrationID, status, reasonOfReject){
    const body = {
        registrationID: registrationID,
        status: status,
        reasonOfReject:reasonOfReject,
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/registrationrequest/changestatus', {
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
        console.error(`Network error: \n`, error);
        throw new Error(`Failed to update registration request: ${error.message}`);
    }
}

async function getBizFile(registrationID) {
    const body = {
        registrationID: registrationID,
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/s3/pdf/download', {
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
        console.error(`Network error: \n`, error);
        throw new Error(`Failed to fetch company data: ${error.message}`);
    }
}

function handleFilterRegsStatus(allRegisReq, filterStatus){
    // console.log(allRegisReq)
    const filteredData = allRegisReq.filter((regisReq) => {
        const DEFAULT_STATUS = 'Pending';
        const status = regisReq.status || DEFAULT_STATUS;
        return status === '' || status === filterStatus;
    });
    return filteredData;
}

function handleFilterRegReqUENBizName(allFilteredRegisReq, filterString){
    const filteredData = allFilteredRegisReq.filter((regisReq) => {
        const search = filterString.trim().toLowerCase();
        if(!search) return true;

        const uenMatch = regisReq.UEN.toLowerCase().includes(search);
        const bizNameMatch = regisReq.bizName.toLowerCase().includes(search);
        return uenMatch || bizNameMatch;
    })
    return filteredData;
}

export default {
    getRegistrationRequests,
    setRegistrationRequest, 
    getBizFile,
    handleFilterRegsStatus,
    handleFilterRegReqUENBizName,
}