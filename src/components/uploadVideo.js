import React, { useState } from "react";
import { storage } from "../firebase"; // Import Firebase Storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./uploadVideo.css";
import UserHeader from "./userHeader";

const UploadVideo = () => {
  const [video, setVideo] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showVideoError, setShowVideoError] = useState(false);
  const [showTitleError, setShowTitleError] = useState(false);
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [dragDropVisible, setDragDropVisible] = useState(true);

  const handleVideoChange = (event) => {
    const selectedVideo = event.target.files[0];
    setVideo(selectedVideo);
    setShowVideoError(false);
    setVideoPreviewUrl(URL.createObjectURL(selectedVideo)); // Create preview URL
    setDragDropVisible(false); // Hide drag and drop area
  };

  const handleVideoTitleChange = (event) => {
    const title = event.target.value;
    setVideoTitle(title);
    const isTitleValid = title.trim().length > 0;
    setIsTitleValid(isTitleValid);
    setShowTitleError(!isTitleValid);
  };

  const handleVideoDescriptionChange = (event) => {
    setVideoDescription(event.target.value);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setVideo(droppedFiles[0]);
      setVideoPreviewUrl(URL.createObjectURL(droppedFiles[0]));
      setShowVideoError(false);
      setDragDropVisible(false); // Hide drag and drop area
    }
  };

  const handleUpload = async () => {
    try {
      if (!video) {
        setShowVideoError(true);
        return;
      }
      if (videoTitle.trim().length === 0) {
        setIsTitleValid(false);
        setShowTitleError(true);
        return;
      }
      const storageRef = ref(storage, `/videos/${video.name}`);
      const uploadTask = uploadBytesResumable(storageRef, video, {
        customMetadata: {
          title: videoTitle,
          description: videoDescription,
        },
      });
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 1000) / 10;
          console.log(`Upload is ${progress}% done`);
          setUploadProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          console.log(`Upload is complete, fetching URL...`);
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              console.log(`Video is now available at ${url}.`);
              // Here, you can save the video title, description, and URL to your database or perform any other necessary actions
              // Clear the video title and description fields
              setVideoTitle('');
              setVideoDescription('');
              setShowSuccessMessage(true);
              setTimeout(() => {
                setShowSuccessMessage(false);
              }, 4000);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      );
    } catch (error) {
      console.error('Error uploading video:', error.message);
    }
  };

  return (
    <>
      <div
        className="upload-video-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <h2 className="upload-video-title">Upload Video</h2>
        {videoPreviewUrl && (
          <div video-con>
            <video controls className="video-preview" autoPlay>
              <source src={videoPreviewUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p>
              <a
              className="file-select-link"
                href="#"
                onClick={() => {
                  setVideo(null);
                  setVideoPreviewUrl(null);
                  setDragDropVisible(true);
                }}
              >
                clear selected video
              </a>
            </p>
          </div>
        )}
        {dragDropVisible && (
          <div className="drag-drop-area">
            <p>Drag & Drop your video here or</p>
            <label className="upload-video-label">
              Choose File
              <input
                type="file"
                className="upload-video-input-one"
                onChange={handleVideoChange}
              />
            </label>
          </div>
        )}
        {showVideoError && (
          <div className="error-message">
            Please select a video before uploading.
          </div>
        )}
        <input
          type="text"
          className="upload-video-input-title"
          placeholder="Video Title"
          value={videoTitle}
          onChange={handleVideoTitleChange}
        />
        {showTitleError && (
          <div className="error-message">Please enter a video title.</div>
        )}
        <textarea
          className="upload-video-input"
          placeholder="Video Description"
          value={videoDescription}
          onChange={handleVideoDescriptionChange}
        ></textarea>
        <button className="upload-video-button" onClick={handleUpload}>
          Upload Video
        </button>
        {showSuccessMessage && (
          <div className="success-message">Video uploaded successfully!</div>
        )}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="upload-progress">
            <progress value={uploadProgress} max="100">
              {uploadProgress}%
            </progress>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadVideo;
