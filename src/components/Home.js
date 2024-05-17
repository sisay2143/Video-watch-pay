import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, getStorage, storage, ref, listAll } from "../firebase";
import VideoUploader from "./uploadVideo";
import "./home.css";
import UserHeader from "./userHeader";
import Footer from "./footer";

const Home = () => {
  const [videoIds, setVideoIds] = useState([]);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        // Fetch the video IDs from Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, "videos");
        const videosSnapshot = await listAll(storageRef);
        const videoIds = videosSnapshot.items.map(
          (item) => item.name.split(".")[0]
        );
        setVideoIds(videoIds);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching videos:", error.message);
      }
    });
    return unsubscribe;
  }, []);

  const sampleVideoData = [
    {
      id: "sample1",
      title: "Sample Video 1",
      description: "This is a sample video description.",
    },
    {
      id: "sample2",
      title: "Sample Video 2",
      description: "This is another sample video description.",
    },
    {
      id: "sample3",
      title: "Sample Video 3",
      description: "This is another sample video description.",
    },
    {
      id: "sample4",
      title: "Sample Video 4",
      description: "This is another sample video description.",
    },
    {
      id: "sample5",
      title: "Sample Video 5",
      description: "This is another sample video description.",
    },
    {
      id: "sample6",
      title: "Sample Video 6",
      description: "This is another sample video description.",
    },
    // Add more sample video data as needed
  ];

  const handleVideoClick = (videoId) => {
    // Check if the user is logged in
    if (!currentUser) {
      // If the user is not logged in, redirect them to the login page
      navigate("/login");
    } else {
      // If the user is logged in, set the active video ID
      setActiveVideoId(videoId);
      // Navigate to the video player page
      navigate(`/video/${videoId}`);
    }
  };

  return (
    <>
      <div className="home-container">
        <div className="video-thumbnails-container">
          {videoIds.map((videoId, index) => (
            <div
              key={index}
              className="video-thumbnail"
              onClick={() => handleVideoClick(videoId)}
            >
              <div className="play-icon"></div>
              <Link to={`/video/${videoId}`}>
                <video
                  controls
                  src={`https://firebasestorage.googleapis.com/v0/b/${storage.bucket}/o/videos%2F${videoId}.mp4?alt=media`}
                  alt={`Video ${index + 1}`}
                  poster={`https://firebasestorage.googleapis.com/v0/b/${storage.bucket}/o/videos%2F${videoId}_thumbnail.jpg?alt=media`}
                />
              </Link>
              <div className="video-info">
                <h3>{sampleVideoData[index].title}</h3>
                <p>{sampleVideoData[index].description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
