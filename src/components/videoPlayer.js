// import React, { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { getStorage, listAll, getDownloadURL, ref } from 'firebase/storage';
// import UserHeader from './userHeader'; // Import the UserHeader component
// import './videoplayer.css'

// const VideoPlayer = () => {
//   const { videoName } = useParams();
//   const [videoUrl, setVideoUrl] = useState(null);
//   const [videoRef, setVideoRef] = useState(null);
//   const [videoWidth, setVideoWidth] = useState(800);
//   const [videoHeight, setVideoHeight] = useState(450);
//   const [allVideos, setAllVideos] = useState([]);

//   useEffect(() => {
//     const fetchVideoUrl = async () => {
//       try {
//         const storage = getStorage();
//         const videoRef = ref(storage, 'videos');
//         const listResult = await listAll(videoRef);

//         const videoList = await Promise.all(
//           listResult.items.map(async (item) => ({
//             name: item.name,
//             url: await getDownloadURL(item),
//           }))
//         );

//         setAllVideos(videoList);

//         const matchingVideo = videoList.find((item) =>
//           item.name.includes(videoName)
//         );

//         if (matchingVideo) {
//           setVideoUrl(matchingVideo.url);
//           setVideoRef(videoRef);
//         } else {
//           console.error(`Video with name "${videoName}" not found in storage.`);
//         }
//       } catch (error) {
//         console.error('Error fetching video URL:', error);
//       }
//     };

//     fetchVideoUrl();
//   }, [videoName]);

//   useEffect(() => {
//     if (videoRef) {
//       const video = document.querySelector('video');
//       video.autoplay = true;
//       video.controls = true;

//       // Set the video dimensions
//       video.width = videoWidth;
//       video.height = videoHeight;
//     }
//   }, [videoRef, videoWidth, videoHeight]);

//   return (
//     <div>
      
//     <div className="video-player-container">
     
//       <div className="video-player-wrapper">
//         {videoUrl ? (
//           <video src={videoUrl} type="video/mp4">
//             Your browser does not support the video tag.
//           </video>
//         ) : (
//           <div>Loading...</div>
//         )}
//       </div>

//       <div className="sidebar">
//   <h3>Other Videos</h3>
//   <div className="video-list">
//     {allVideos.map((video) => (
//       <div key={video.name} className="video-thumbnail">
//         <Link to={`/video/${video.name}`}>
//           <video controls>
//             <source src={video.url} type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//           {/* <p>{video.name}</p> */}
//         </Link>
//       </div>
//     ))}
//   </div>
// </div>
//     </div>
//     </div>
//   );
// };

// export default VideoPlayer;


import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { google } from 'googleapis';
import UserHeader from './userHeader';
import './videoplayer.css';

const VideoPlayer = () => {
  const { videoName } = useParams();
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoWidth, setVideoWidth] = useState(800);
  const [videoHeight, setVideoHeight] = useState(450);
  const [allVideos, setAllVideos] = useState([]);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        // Set up the YouTube API client
        const youtube = google.youtube({ version: 'v3', auth: 'AIzaSyB2tADfpscGkBq5ZM6ZJ_3wWY2iDtHFUQ8' });

        // Fetch the user's private videos
        const response = await youtube.videos.list({
          part: 'id,snippet',
          mine: true,
          maxResults: 50, // Adjust the number of videos to fetch
        });

        const videoList = response.data.items.map((item) => ({
          id: item.id,
          title: item.snippet.title,
        }));

        setAllVideos(videoList);

        const matchingVideo = videoList.find((item) =>
          item.title.includes(videoName)
        );

        if (matchingVideo) {
          setVideoUrl(`https://www.youtube.com/watch?v=${matchingVideo.id}`);
        } else {
          console.error(`Video with name "${videoName}" not found.`);
        }
      } catch (error) {
        console.error('Error fetching video URL:', error.message);
      }
    };

    fetchVideoUrl();
  }, [videoName]);

  useEffect(() => {
    if (videoUrl) {
      const video = document.querySelector('video');
      video.autoplay = true;
      video.controls = true;

      // Set the video dimensions
      video.width = videoWidth;
      video.height = videoHeight;
    }
  }, [videoUrl, videoWidth, videoHeight]);

  return (
    <div>
      <div className="video-player-container">
        <div className="video-player-wrapper">
          {videoUrl ? (
            <iframe
              width={videoWidth}
              height={videoHeight}
              src={videoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div>Loading...</div>
          )}
        </div>

        <div className="sidebar">
          <h3>Other Videos</h3>
          <div className="video-list">
            {allVideos.map((video) => (
              <div key={video.id} className="video-thumbnail">
                <Link to={`/video/${video.title}`}>
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/0.jpg`}
                    alt={video.title}
                  />
                  <p>{video.title}</p>
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