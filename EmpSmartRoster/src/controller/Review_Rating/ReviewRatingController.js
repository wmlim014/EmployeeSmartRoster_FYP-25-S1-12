async function viewReviewRating(user_id) {
    const body = {
        user_id: user_id
    };
    // console.log(body)

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/reviewandrating/view', {
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

async function saViewReviewRating() {
    const body = {
        // user_id: user_id
    };
    // console.log(body)

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/reviewrating/view', {
            method: 'GET',
            // body: JSON.stringify(body),
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

async function submitReviewRating(user_id, rating, review) {
    const body = {
        user_id: user_id,
        rating: rating,
        review: review
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/reviewandrating/add', {
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

function GetRating (){
    const data = [
        {userId:"1", rating:5},
        {userId:"2", rating:5},
        {userId:"3", rating:5},
        {userId:"4", rating:2},
        {userId:"5", rating:3},
        {userId:"6", rating:5},
        {userId:"7", rating:5},
        {userId:"8", rating:5},
        {userId:"9", rating:2},
        {userId:"10", rating:3},
        {userId:"11", rating:3},
        {userId:"12", rating:4},
        {userId:"13", rating:4},
        {userId:"14", rating:4},
        {userId:"55", rating:4},
    ]
    return data;
}

export default {
    viewReviewRating,
    saViewReviewRating,
    submitReviewRating,
    GetRating,
}