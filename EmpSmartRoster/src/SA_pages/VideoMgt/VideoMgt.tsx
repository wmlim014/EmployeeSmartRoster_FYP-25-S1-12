import React, { useState, useEffect } from 'react'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import SA_LandingMgtController from '../../controller/SA_LandingMgtController'
import FileUploadResult from '../../components/FileUploadStatus/FileUploadStatus'
import AllVideos from './components/VideosList'

import { FaUpload } from '../../../public/Icons.js'
import './VideoMgt.css'
import '../../../public/styles/common.css'

const { uploadLandingVideo, getDemoVideo, getAllUploadedVideos,
        setVideoDelete, filterIsShownVideo, setVideoDisplayOnLanding } = SA_LandingMgtController

const VideoMgt: React.FC = () => {
    const { showAlert } = useAlert();
    const [ newVideoTitle, setNewVideoTitle ] = useState<string>('')
    const [ newVideoDescription, setNewVideoDescription ] = useState<string>('')
    const [ uploadedDemoVideo, setUploadedDemoVideo ] = useState<File | null>(null);
    const [ videoPreview, setVideoPreview ] = useState<string>('')
    const [ fileStatus, setFileStatus ] = useState<
        'initial' | 'uploading' | 'success' | 'fail'
    >('initial');
    const [ allVideos, setAllVideos ] = useState<any>([]);
    const [uploading, setUploading] = useState<boolean>(false)


    const fetchVideos = async() => {
        try {
            let response = await getDemoVideo()
            // console.log(response)
            if (response?.videos){
                response = response.videos
                .slice()
                .sort((a: any, b: any) => b.id - a.id); // Sort by descending order of ID

                setAllVideos(response)
                // Get video shown in = 0 landing page as default preview video
                const defaultPreview = filterIsShownVideo(response,0)
                // console.log(defaultPreview.url)
                if (defaultPreview && response.length > 0) {
                    setVideoPreview(defaultPreview[0].url); // Use the existing URL
                }
            }
        } catch(error) {
            showAlert(
                'fetchVideos',
                'Failed to Fetch All Uploaded Video',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }
    useEffect(() => {fetchVideos()}, [allVideos.length])

    // Handle Registration Submission with File Upload:
    // https://uploadcare.com/blog/how-to-upload-file-in-react/#show-upload-result-indicator
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFileStatus('initial');
            setUploadedDemoVideo(e.target.files[0]);
        }
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // UPLOAD NEW VIDEO
    const triggerUploadVideo = async() => {
        if (uploadedDemoVideo) {
            try {
                setUploading(true)
                setFileStatus('uploading')
                await uploadLandingVideo(uploadedDemoVideo, newVideoTitle, newVideoDescription)

                setUploading(false)
                setFileStatus('success');
                setUploadedDemoVideo(null);
                setNewVideoTitle('');
                setNewVideoDescription('');
                setVideoPreview('');
                
                if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

                fetchVideos(); // re-fetch video
            } catch(error) {
                setUploading(false)
                setFileStatus('fail');
                showAlert(
                    'triggerUploadVideo',
                    'Failed to Submit Demo Video',
                    error instanceof Error ? error.message : String(error),
                    { type: 'error' }
                )
            }
        }
    }

    // Trigger selected video
    const triggerSelectVideo = (url: string) => {
        // Find the selected video in the existing list
        const selectedVideo = allVideos.find((video: any) => video.url === url);
        // console.log(url)
        if (selectedVideo) {
            setVideoPreview(selectedVideo.url);
        } else {
            showAlert(
                'triggerSelectVideo',
                'Failed to Change Selected Video',
                'Selected video not found.',
                { type: 'error' }
            );
        }
    }


    // console.log(videoPreview)
    // Trigger selected video
    const triggerChangeVideoDisplayOnLanding = async(id: number, url: string) => {
        try {
            let response = await setVideoDisplayOnLanding(id)
            // console.log("Change Landing: ", response)
            updateDisplayStatus(id)
            if(response.message === 'Succesfully selected video.'){
                triggerSelectVideo(url)
            }
        } catch(error) {
            showAlert(
                'triggerChangeVideoDisplayOnLanding',
                'Failed to Change Selected Video to Display in Landing',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }

    // Update display status locally
    function updateDisplayStatus(id: number) {
        const updatedData = allVideos.map((videos: any) => 
            videos.id === id 
            ? { ...videos, isShown: 1}
            : { ...videos, isShown: 0}
        )
        setAllVideos(updatedData)
    }

    // console.log(uploading)

    // Trigger selected video
    const triggerDeleteVideo = async(id: number) => {
        try {
            let response = await setVideoDelete(id)
            // console.log("Delete Video: ", response)
            // updateDisplayStatus(id)
            if(response.message === 'Successfully deleted Demo Video'){
                deleteVideo(id)
            }
        } catch(error) {
            showAlert(
                'triggerDeleteVideo',
                'Failed to Delete Selected Video',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }
    // Update delete video locally
    function deleteVideo(id: number) {
        const videos = allVideos.filter((video: any) => {
            video.id !== id
        })
        setAllVideos(videos)
    }

    return(
        <div className="App-content">
            <div className="content">
                <h1>
                    Demo Video Management
                </h1>
                {/* BizFile */}
                <div className='upload-new-demo-video-component'>
                    <strong className='upload-demo-video-title'>
                        Upload New Demo Video
                        <button 
                            className={`upload-video-button ${
                                (
                                    !uploadedDemoVideo 
                                    || !newVideoTitle 
                                    || !newVideoDescription
                                    || uploading
                                ) ? 'disabled' : ''
                            }`}
                            disabled={
                                !uploadedDemoVideo 
                                || !newVideoTitle 
                                || !newVideoDescription
                                || uploading
                            }
                            onClick={triggerUploadVideo}
                        >
                            <FaUpload />
                        </button>
                        
                    </strong>
                    <div className="upload-video-content">
                        <input type='text' 
                            className='video-title-input'
                            name='videoTitle'
                            placeholder='Video Name'
                            value={newVideoTitle}
                            onChange={(e) => setNewVideoTitle(e.target.value)}
                            required
                        />
                        <input type='text' 
                            className='video-title-input'
                            name='videoDescription'
                            placeholder='Video Description'
                            value={newVideoDescription}
                            onChange={(e) => setNewVideoDescription(e.target.value)}
                            required
                        />
                        <input type='file' 
                            name='uploadVideo'
                            accept=".mp4"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            required
                        />
                    </div>
                    <FileUploadResult 
                        status={fileStatus}
                        fileType='Video'
                    />
                </div>

                {allVideos.length > 0 ?(
                    <div className="uploaded-video-container">
                        <video 
                            className='default-preview-video' 
                            autoPlay
                            muted
                            playsInline
                            loop
                            key={videoPreview}
                        >
                        {videoPreview ? (
                            <source src={videoPreview} type="video/mp4" />
                        ):(
                            <p>No Preview Available...</p>
                        )}
                        </video>
                        <AllVideos 
                            videos={allVideos}
                            updatePreviewVideo={triggerSelectVideo}
                            updateLandingVideo={triggerChangeVideoDisplayOnLanding}
                            deleteVideo={triggerDeleteVideo}                  
                        /> 
                    </div>
                ):(
                    <p>No Uploaded Video(s)</p>
                )}
            </div>
        </div>
    )
}

export default VideoMgt