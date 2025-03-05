import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import '../index.css';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isDefaultColor, setIsDefaultColor] = useState(true);
  const [isDefaultFont, setIsDefaultFont] = useState(true);
  const [buttonStyle, setButtonStyle] = useState({
    borderColor: '#5902A0',
    backgroundColor: '#FFD43C',
    color: '#5902A0',
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showTextInput, setShowTextInput] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [extractedText, setExtractedText] = useState("");

  const allowedFileTypes = {
    'image/png': [],
    'image/jpeg': [],
    'image/jpg': [],
    'application/pdf': [],
    'application/msword': [],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
    'text/plain': []
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: allowedFileTypes,
    multiple: false,
    onDrop: async (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        setErrorMessage("Unsupported file type. Please upload an image, PDF, Word, or text file.");
        return;
      }
      
      const file = acceptedFiles[0];
      setUploadedFile(file);
      setTextInput(""); // Clear text input if a file is uploaded
      setShowTextInput(false);
      setErrorMessage("");

      // Simulated upload progress
      setUploadProgress(0);
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  });

  const removeFile = () => {
    setUploadedFile(null);
    setErrorMessage("");
    setUploadProgress(0);
  };

  const changeFont = () => {
    if (isDefaultFont) {
      document.body.style.fontFamily = 'OpenDyslexic-Regular';
      document.body.style.letterSpacing = '0em';
      document.body.style.lineHeight = '1.5em';
    } else {
      document.body.style.fontFamily = 'Comic Sans MS';
      document.body.style.wordSpacing = '0.8em';
      document.body.style.letterSpacing= '0.3em';
      document.body.style.lineHeight = '1.5em';
    }
    setIsDefaultFont(!isDefaultFont);
  };

  const changeColour = () => {
    if (isDefaultColor) {
      document.body.style.backgroundColor = '#FFD43C';
      document.body.style.color = '#5902A0';
      setButtonStyle({
        borderColor: '#000065',
        backgroundColor: '#FFF7EF',
        color: '#000065',
      });
    } else {
      document.body.style.backgroundColor = '#FFF7EF';
      document.body.style.color = '#000065';
      setButtonStyle({
        borderColor: '#5902A0',
        backgroundColor: '#FFD43C',
        color: '#5902A0',
      });
    }
    setIsDefaultColor(!isDefaultColor);
  };

  const toggleTextInput = () => {
    setShowTextInput(true);
    setShowFileUpload(false);
    setUploadedFile(null); // Remove file if switching to text input
    setErrorMessage("");
    setUploadProgress(0);
  };

  const toggleFileUpload = () => {
    setShowFileUpload(true);
    setShowTextInput(false);
    setTextInput(""); // Clear text input if switching to file upload
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default navigation behavior
  
    if (!textInput && !uploadedFile) {
      setErrorMessage("Please enter text or upload a file before submitting.");
      return;
    }
  
    let formData = new FormData();
    try {
      if (textInput) {
        formData.append("text", textInput);
        const response = await fetch("http://127.0.0.1:8000/text/", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setExtractedText(data.text);
      } else if (uploadedFile) {
        formData.append("file", uploadedFile);
        const response = await fetch("http://127.0.0.1:8000/upload/", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setExtractedText(data.text);
      }
  
      // Navigate only if a valid input exists
      window.location.href = "/results"; 
  
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className='p-10'>
      <h1 className='text-4xl leading-16'>Adaptive Text Modification For Dyslexic Readers</h1>

      {/* Buttons for changing colors and fonts */}
      <div className='lg:flex lg:justify-self-end lg:space-x-12 lg:items-center lg:mt-10 grid  '>
        <div className='mt-10 mb-10'>
          <h5 className='text-left leading-10 text-xl'>Enter your text, or upload a file and receive a document that's accessible and friendly to read for dyslexic individuals.</h5>
        </div>

        <div className='lg:flex lg:justify-self-end lg:space-x-12 lg:items-center grid grid-cols-2 gap-4'>

          <button className='py-3 px-3 border-2 text-center hover:cursor-grab hover:scale-110 transition duration-300'
            style={buttonStyle} onClick={changeColour}>
            Change Colour
          </button>

          <button className='py-3 px-3 border-2 text-center hover:cursor-grab hover:scale-110 transition duration-300'
            style={buttonStyle} onClick={changeFont}>
            Change Font
          </button>

        </div>

      </div>

      <div className='lg:grid lg:grid-cols-[3fr_1fr] lg:space-x-12 lg:items-center lg:mt-10 mt-10 grid'>

        {/* Textarea for direct text input */}
        {showTextInput && (
          <div>
            <textarea
              className='border-2 border-dashed border-gray-500 p-5 resize-none mt-5 w-full h-40'
              placeholder="Enter text here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            ></textarea>
          </div>
        )}

        {/* Drag & Drop File Upload */}
        {showFileUpload && (
          <div>
            <div {...getRootProps()} className="border-2 border-dashed border-gray-500 mt-5 p-10 text-center hover:cursor-pointer">
              <input {...getInputProps()} />
              {uploadedFile ? (
                <p className="text-[#5902A0]">Uploaded: {uploadedFile.name}</p>
              ) : (
                <p>Drag & drop a file here, or click to select one</p>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}

            {/* Progress Bar */}
            {uploadedFile && (
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#5902A0] h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            {/* Remove File Button */}
            {uploadedFile && (
              <button onClick={removeFile} className="mt-4 py-2 px-4 bg-red-500 hover:cursor-grab hover:scale-110 transition duration-300 text-white">
                Remove File
              </button>
            )}
          </div>
        )}
        
        <div className='lg:flex lg:justify-self-end lg:space-x-12 lg:items-center grid grid-cols-2 gap-4 mt-10'>
          <button className='py-3 px-3 border-2 text-center hover:cursor-grab hover:scale-110 transition duration-300'
            style={buttonStyle} onClick={toggleTextInput}>
            Text
          </button>

          <button className='py-3 px-3 border-2 text-center hover:cursor-grab hover:scale-110 transition duration-300'
            style={buttonStyle} onClick={toggleFileUpload}>
            Upload
          </button>
        </div>

      </div>

      {/* Submit Button */}
      <div className='flex justify-center mt-10'>
        <button 
          className='py-3 px-3 border-2 text-center hover:cursor-grab hover:scale-110 transition duration-300'
          style={buttonStyle} 
          onClick={handleSubmit} 
          disabled={!textInput && !uploadedFile}
        >
          <Link to="/results" style={{ pointerEvents: (!textInput && !uploadedFile) ? "none" : "auto" }}>
            Submit
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Header;