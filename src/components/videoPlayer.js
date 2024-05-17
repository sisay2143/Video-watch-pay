import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStorage, listAll, getDownloadURL, ref } from 'firebase/storage';
import UserHeader from './userHeader'; // Import the UserHeader component
import './videoplayer.css'

const VideoPlayer = () => {
  const { videoName } = useParams();
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoRef, setVideoRef] = useState(null);
  const [videoWidth, setVideoWidth] = useState(800);
  const [videoHeight, setVideoHeight] = useState(450);
  const [allVideos, setAllVideos] = useState([]);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const storage = getStorage();
        const videoRef = ref(storage, 'videos');
        const listResult = await listAll(videoRef);

        const videoList = await Promise.all(
          listResult.items.map(async (item) => ({
            name: item.name,
            url: await getDownloadURL(item),
          }))
        );

        setAllVideos(videoList);

        const matchingVideo = videoList.find((item) =>
          item.name.includes(videoName)
        );

        if (matchingVideo) {
          setVideoUrl(matchingVideo.url);
          setVideoRef(videoRef);
        } else {
          console.error(`Video with name "${videoName}" not found in storage.`);
        }
      } catch (error) {
        console.error('Error fetching video URL:', error);
      }
    };

    fetchVideoUrl();
  }, [videoName]);

  useEffect(() => {
    if (videoRef) {
      const video = document.querySelector('video');
      video.autoplay = true;
      video.controls = true;

      // Set the video dimensions
      video.width = videoWidth;
      video.height = videoHeight;
    }
  }, [videoRef, videoWidth, videoHeight]);

  return (
    <div>
      
    <div className="video-player-container">
     
      <div className="video-player-wrapper">
        {videoUrl ? (
          <video src={videoUrl} type="video/mp4">
            Your browser does not support the video tag.
          </video>
        ) : (
          <div>Loading...</div>
        )}
      </div>

      <div className="sidebar">
  <h3>Other Videos</h3>
  <div className="video-list">
    {allVideos.map((video) => (
      <div key={video.name} className="video-thumbnail">
        <Link to={`/video/${video.name}`}>
          <video controls>
            <source src={video.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* <p>{video.name}</p> */}
        </Link>
      </div>
    ))}
  </div>
</div>
    </div>
    </div>
  );
};

export default VideoPlayer;