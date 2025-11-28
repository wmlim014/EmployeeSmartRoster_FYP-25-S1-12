import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton';
import SA_LandingMgtController from '../../../controller/SA_LandingMgtController'

import { BiSolidShow, IoFlagSharp, MdDeleteForever} from '../../../../public/Icons.js'
import '../VideoMgt.css'
import '../../../../public/styles/common.css'
import { useState } from 'react';
import { any } from 'prop-types';


interface AllVideoProps {
    videos: any;
    updatePreviewVideo: (url: string) => void
    updateLandingVideo: (id: number, url: string) => void
    deleteVideo: (id: number) => void
}

const { filterIsShownVideo } = SA_LandingMgtController

const AllVideos = ({videos, updatePreviewVideo, updateLandingVideo, deleteVideo}: AllVideoProps) => {
    // console.log(videos)
    const location = useLocation()
    const isVideoMgt = location.pathname.includes('video-management');
    const [ selectedVideo, setSelectedVideo ] = useState<number>()


return(
    <div className={`${isVideoMgt ? 'set-visible' : 'App-mobile-responsive-table'}`}>
        {videos.map((video:any) => (
        <div key={video.id}>
            <div 
                className={`App-mobile-responsive-table-card sa-view-video-display-card
                    ${video.id === selectedVideo ? 'onhover' : ''}`}
                    onClick={() => {
                        updatePreviewVideo(video.url)
                        setSelectedVideo(video.id)
                    }}
            >
                <div className="App-mobile-responsive-table-card-data-detail uploaded-demo-video-list-item">
                    <div>
                        <h4>{video.title}</h4>
                        {/* <div className="btns-grp">
                            <IoFlagSharp 
                                onClick={() => updateLandingVideo(video.id, video.url)}
                                style={{ color: video.isShown === 1 ? '#b565ff' : '#a0a0a0' }}
                            />
                        </div> */}
                        <p>{video.videoDescription}</p>
                    </div>

                        <div className="btns-grp" onClick={(e) => e.stopPropagation()}>
                            <MdDeleteForever fontSize={23} color = "#bc1010"
                                onClick={() => deleteVideo(video.id)}
                            />
                        </div>
                </div>
            </div>
        </div>
        ))}
    </div>
)
}

export default AllVideos