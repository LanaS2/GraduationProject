import React, { useState } from 'react';
import '../styles/disease.css';
import Menu from '../components/Menu';
import { FaTimes } from 'react-icons/fa'; 

function Disease() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setUploadedImage(e.target.result);
      setImageUploaded(true); 
    };

    reader.readAsDataURL(file);
  };

  const handleDetect = () => {
    if (imageUploaded) { 
      setProcessing(true);
      setTimeout(() => {
        const fakeResult = "Healthy"; 
        setResult(fakeResult);
        setProcessing(false);
      }, 2500); 
    }
  };

  const handleCloseResult = () => {
    setResult(null);
  };

  return (
    <div className="App">
      <header>
        <Menu />
      </header>
      <h1>Find out what disease caught your plant!</h1>
      <div className="content">
        <input
          type="file"
          accept="image/*"
          id="image-upload"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        <label htmlFor="image-upload" className="upload-btn">
          Upload Image
        </label>
        <button className="detect-btn" onClick={handleDetect} disabled={!imageUploaded || processing}>
          Detect!
        </button>
      </div>
      {uploadedImage && (
        <div className={`uploaded-image-container ${processing ? 'processing' : ''}`}>
          <img src={uploadedImage} alt="Uploaded" className="uploaded-image" />
          {processing && <div className="processing-overlay"></div>}
        </div>
      )}
      {result && (
        <div className="result-container">
          <div className="result-rectangle">
            <button className="close-btn" onClick={handleCloseResult}>
              <FaTimes />
            </button>
            <h2>Result</h2>
            <p>{result}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Disease;
