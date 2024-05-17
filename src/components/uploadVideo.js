import React, { useState } from 'react';
import { storage } from "../firebase"; // Import Firebase Storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import './uploadVideo.css'
import UserHeader from './userHeader';

const UploadVideo = () => {
  const [video, setVideo] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleVideoChange = (event) => {
    const selectedVideo = event.target.files[0];
    setVideo(selectedVideo);
    setShowErrorMessage(false);
  };

  const handleVideoTitleChange = (event) => {
    setVideoTitle(event.target.value);
  };

  const handleVideoDescriptionChange = (event) => {
    setVideoDescription(event.target.value);
  };

  const handleUpload = async () => {
    try {
      if (!video) {
        setShowErrorMessage(true);
        return;
      }

      const storageRef = ref(storage, `/videos/${video.name}`);
      const uploadTask = uploadBytesResumable(storageRef, video);

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
      
      <div className="upload-video-container">
        <h2 className="upload-video-title">Upload Video</h2>
        <input type="file" className="upload-video-input" onChange={handleVideoChange} />
        <input
          type="text"
          className="upload-video-input"
          placeholder="Video Title"
          value={videoTitle}
          onChange={handleVideoTitleChange}
        />
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
          <div className="success-message">
            Video uploaded successfully!
          </div>
        )}
        {showErrorMessage && (
          <div className="error-message">
            Please select a video before uploading.
          </div>
        )}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="upload-progress">
            <progress value={uploadProgress} max="100">{uploadProgress}%</progress>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadVideo;