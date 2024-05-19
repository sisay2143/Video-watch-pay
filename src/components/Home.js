import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, getStorage, storage, ref, listAll, getDownloadURL } from "../firebase";
import "./home.css";
import UserHeader from "./userHeader";
import { getMetadata } from "firebase/storage";

const Home = () => {
  const [videoData, setVideoData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, "videos");
        const videosSnapshot = await listAll(storageRef);

        const videoData = await Promise.all(
          videosSnapshot.items.map(async (item) => {
            const metadata = await getMetadata(item);
            const videoUrl = await getDownloadURL(item);
            return {
              id: item.name.split(".")[0],
              title: metadata.customMetadata.title || "Untitled",
              description: metadata.customMetadata.description || "",
              url: videoUrl,
              thumbnailUrl: `${videoUrl}_thumbnail.jpg`, // Add thumbnail URL
            };
          })
        );

        setVideoData(videoData);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching videos:", error.message);
      }
    });
    return unsubscribe;
  }, []);

  const handleVideoClick = (videoId) => {
    if (!currentUser) {
      navigate("/login");
    } else {
      
      navigate(`/video/${videoId}`);
    }
  };

  return (
    <div className="home-container">
      <div className="video-thumbnails-container">
        {videoData.map((video, index) => (
          <div
            key={index}
            className="video-thumbnail"
            onClick={() => handleVideoClick(video.id)}
          >
            <div className="play-icon"></div>
            <Link to={`/video/${video.id}`}>
              <video src={video.url} alt={`Video ${index + 1}`} />
            </Link>
            <div className="video-info">
              <h3>{video.title}</h3>
              <p>{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;






// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./home.css";
// import Footer from "./footer";
// import { auth } from "../firebase";
// import axios from "axios";

// const Home = () => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const navigate = useNavigate();
//   const [activeVideoId, setActiveVideoId] = useState(null);
//   const [unlistedVideos, setUnlistedVideos] = useState([]);

//   // Replace this with your own YouTube API key
//   const apiKey = "AIzaSyB2tADfpscGkBq5ZM6ZJ_3wWY2iDtHFUQ8";

//   // Replace this with your own YouTube channel ID
//   const yourChannelId = "UClX43ZTbqUXldnrGX6VYLhA";

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setCurrentUser(user);
//     });

//     return unsubscribe;
//   }, []);

//   useEffect(() => {
//     const fetchUnlistedVideos = async () => {
//       try {
//         const response = await axios.get(
//           "https://www.googleapis.com/youtube/v3/search",
//           {
//             params: {
//               key: apiKey,
//               part: "snippet",
//               channelId: yourChannelId,
//               maxResults: 50, // Adjust the number of videos to fetch as needed
//               type: "video",
//               videoStatus: "public",
//             },
//           }
//         );
//         console.log(response);
//         setUnlistedVideos(response.data.items);
//       } catch (error) {
//         console.error(
//           "Error fetching unlisted videos:",
//           error.response.data.error
//         );
//       }
//     };

//     fetchUnlistedVideos();
//   }, [apiKey, yourChannelId]);

//   const handleVideoClick = (videoId) => {
//     console.log("Clicked video ID:", videoId);
//     console.log("Current user:", currentUser);

//     if (!currentUser) {
//       console.log("Redirecting to login page...");
//       navigate("/login");
//     } else {
//       console.log("Navigating to video details page...");
//       setActiveVideoId(videoId);
//       navigate(`/video/${videoId}`);
//     }
//   };

//   return (
//     <>
//       <div className="home-container">
//         <div className="video-thumbnails-container">
//           {unlistedVideos.map((video, index) => (
//             <div
//               key={index}
//               className={`video-thumbnail ${
//                 activeVideoId === video.id.videoId ? "active" : ""
//               }`}
//               onClick={() => handleVideoClick(video.id.videoId)}
//             >
//               <img className="video-thumbnail-img"
//                 src={video.snippet.thumbnails.default.url}
//                 alt={`Video ${index + 1}`}
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = "placeholder.jpg";
//                 }}
//               />
//               <div className="video-info">
//                 <h3 className="video-title">{video.snippet.title}</h3>
//                 <p className="video-description">{video.snippet.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Home;
