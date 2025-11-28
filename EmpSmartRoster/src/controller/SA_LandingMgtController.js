// import { encodeVideoFileContent } from '../controller/Variables.js'
// import fs from 'fs';

async function uploadLandingVideo(video, videoName, videoDescription) {
    const fileName = video.name
    // console.log(fileName)
    const videoTitle = videoName
    const fileType = video.type || 'video/mp4';

    const body = {
        fileName,
        fileType,
        videoTitle,
        videoDescription
    }

    try {
        const response = await fetch(
            'https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/s3/video/upload',
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
            throw new Error(errorData.message || `Failed to get pre-signed URL: ${data}`);
        }
        const data = await response.json();
        // console.log(data);
        const uploadUrl = data.uploadUrl; //pre-signed URL
        // console.log(fileData)
        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': fileType
            },
            body: video,
        });

        if (!uploadResponse.ok) {
            console.error('Error uploading file:', uploadResponse.statusText);
            return;
        }
    } catch (error) {
        throw new Error(`Failed to upload video: ${error.message}`);
    }
}

// fileName === video_link
async function getDemoVideo(fileName) {
    try{
        const body = {
            fileName
        };
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/s3/video/download', {
            method: 'GET',
            // body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error getting pre-signed URL: ${data}`);
        }
        const data = await response.json();
        // console.log(data)
        // Step 2: Get the pre-signed URL from the response
        // const presignedUrl = data.presignedUrl;
        // // const downloadResponse = await fetch(presignedUrl);
        return data;

    } catch(error) {
        // console.error(`Failed to register: \n`, error);
        throw new Error(`Failed to get videos: ${error.message}`);
    }
}

async function getAllUploadedVideos() {
    try{
        const body = {
        };

        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/video/view', {
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
        throw new Error(`Failed to get videos: ${error.message}`);
    }
}

// 1 is shown, 0 isn't shown
function filterIsShownVideo (allVideos, isShown) {
    const filteredData = allVideos.filter((video) => {
        return video.isShown === isShown
    })
    return filteredData
}


async function setVideoDisplayOnLanding(videoID) {
    try{
        const body = {
            videoID: videoID
        };

        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/video/selectedvideo', {
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
        throw new Error(`Failed to get videos: ${error.message}`);
    }
}

async function setVideoDelete(videoID) {
    try{
        const body = {
            videoID: videoID
        };

        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/s3/video/delete', {
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
        throw new Error(`Failed to delete videos: ${error.message}`);
    }
}

export default { 
    uploadLandingVideo,
    getDemoVideo,
    getAllUploadedVideos,
    filterIsShownVideo,
    setVideoDisplayOnLanding,
    setVideoDelete
}