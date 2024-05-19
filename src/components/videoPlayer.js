import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getStorage,
  listAll,
  getDownloadURL,
  ref,
  getMetadata,
} from "firebase/storage";
import UserHeader from "./userHeader";
import "./videoplayer.css";
import { FaSearch } from "react-icons/fa";

const VideoPlayer = () => {
  const { videoName } = useParams();
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoRef, setVideoRef] = useState(null);
  const [videoWidth, setVideoWidth] = useState(800);
  const [videoHeight, setVideoHeight] = useState(450);
  const [videoTitle, setVideoTitle] = useState("");
  const [allVideos, setAllVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [videoDescription, setVideoDescription] = useState("");

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const storage = getStorage();
        const videoRef = ref(storage, "videos");
        const listResult = await listAll(videoRef);

        const videoList = await Promise.all(
          listResult.items.map(async (item) => {
            const metadata = await getMetadata(item);
            return {
              name: item.name,
              title: metadata.customMetadata.title || item.name,
              description: metadata.customMetadata.description || "",
              url: await getDownloadURL(item),
            };
          })
        );

        setAllVideos(videoList);

        const matchingVideo = videoList.find((item) =>
          item.name.includes(videoName)
        );

        if (matchingVideo) {
          setVideoUrl(matchingVideo.url);
          setVideoTitle(matchingVideo.title);
          setVideoDescription(matchingVideo.description);
          setVideoRef(videoRef);
        } else {
          console.error(`Video with name "${videoName}" not found in storage.`);
        }

        // Set the filtered videos to be the full list of videos
        setFilteredVideos(videoList);
      } catch (error) {
        console.error("Error fetching video URL:", error);
      }
    };

    fetchVideoUrl();
  }, [videoName]);

  useEffect(() => {
    if (videoRef) {
      const video = document.querySelector("video");
      video.autoplay = true;
      video.controls = true;

      video.width = videoWidth;
      video.height = videoHeight;
    }
  }, [videoRef, videoWidth, videoHeight]);

  const handleSearch = () => {
    const matchingVideos = allVideos.filter((video) => {
      const title = video.title.toLowerCase();
      const query = searchQuery.toLowerCase();
      return (
        title.startsWith(query) ||
        title.endsWith(query) ||
        title.includes(query)
      );
    });

    setFilteredVideos(matchingVideos);
  };

  


  const handleSearchIconClick = () => {
    // Enable the search input field
    const searchInput = document.querySelector(".search-bar input");
    searchInput.disabled = false;
    searchInput.focus();
    setSearchQuery('');
    // Perform the search
    handleSearch();
  };

  return (
    <div>
      <div className="video-player-container">
        <div className="video-player-wrapper">
          {videoUrl ? (
            <>
              <video
                src={videoUrl}
                type="video/mp4"
                controls
                controlsList="nodownload"
              >
                Your browser does not support the video tag.
              </video>
              {videoTitle && <h2>{videoTitle}</h2>}
              {videoDescription && <p>{videoDescription}</p>}
            </>
          ) : (
            <div>Loading...</div>
          )}
        </div>

        <div className="sidebar">
          <h3>Other Videos</h3>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by title"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch();
              }}
              disabled={false}
            />
            <FaSearch
              className="search-icon"
              onClick={handleSearchIconClick}
            />
          </div>
          <div className="video-list">
            {filteredVideos.map((video) => (
              <div key={video.name} className="video-thumbnail">
                <Link to={`/video/${video.name}`}>
                  <video className="video-thumbnail-img">
                    <source src={video.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Link>
                <p>{video.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;