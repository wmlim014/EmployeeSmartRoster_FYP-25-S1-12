import React, { useEffect, useState } from "react";
import "./Video.css";
import LandingPageController from "../../controller/LandingPageController";

type VideoItem = {
  videoUrl: string;
  title: string;
  createdOn: string;
};

const Video: React.FC = () => {
  const [video, setVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const vids = await LandingPageController.getVideo();
        // pick first shown video
        if (vids.length > 0) setVideo(vids[0]);
      } catch {
        // nothing – controller already falls back
      }
    })();
  }, []);

  if (!video) return <p>Loading video…</p>;

  return (
    <div className="video-section">
      {/* <h2>{video.title}</h2> */}
      <video
        className="video-player"
        src={video.videoUrl}
        controls
        width="100%"
      >
        Your browser doesn’t support HTML5 video.
      </video>
      {/* <p className="video-date">
        Uploaded on: {new Date(video.createdOn).toLocaleDateString()}
      </p> */}
    </div>
  );
};

export default Video;
