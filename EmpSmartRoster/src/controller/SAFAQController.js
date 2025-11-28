async function handleSubmitQuesToChatBox (question) {
    // console.log(user_query)
    try{
        const body = {
            user_query: question
        };

        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/chatbot', {
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
        throw new Error(`Failed to get videos: ${error.message}`);
    }
}

async function getAllFaqs () {
    // console.log(user_query)
    try{
        const body = {
            
        };

        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/faq/view', {
            method: 'GET',
            // body: JSON.stringify(body),
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
        throw new Error(`Failed to get FAQs: ${error.message}`);
    }
}

async function createNewFaq (values) {
    // console.log(`${question}\n ${ans}`)
    try{
        const body = {
            question_desc: values.question_desc.trim(),
            answer: values.answer.trim(),
            isShown: values.isShown
        };
        // console.log(body)

        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/faq/add', {
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
        throw new Error(`Failed to create FAQ: ${error.message}`);
    }
}

async function deleteFaq (faqID) {
    // console.log(user_query)
    try{
        const body = {
            faqID: faqID,
        };

        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/faq/delete', {
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

    } catch(error) {
        // console.error(`Failed to register: \n`, error);
        throw new Error(`Failed to delete FAQ: ${error.message}`);
    }
}

async function editFaq (values) {
    // console.log(values)
    try{
        const body = {
            faqID: values.faqID,
            question_desc: values.question_desc.trim(),
            answer: values.answer.trim(),
            isShown: values.isShown
        };

        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/faq/update', {
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
        // console.error(`Failed to register: \n`, error);
        throw new Error(`Failed to update FAQ: ${error.message}`);
    }
}

function handleFilterFAQs (allFAQs, filterString) {
    const filteredData = allFAQs.filter((faq) => {
        const search = filterString.trim().toLowerCase();
        if(!search) return true;

        const questionMatch = faq.question_desc.toLowerCase().includes(search);
        return questionMatch;
    })
    return filteredData;
}

export default {
    handleSubmitQuesToChatBox,
    getAllFaqs,
    createNewFaq,
    deleteFaq,
    editFaq,
    handleFilterFAQs
}