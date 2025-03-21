"use client";
import React, { useEffect, useState, useRef } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useRouter } from 'next/navigation';

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'upload' | 'record'>('upload');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  // Add cleanup effect to revoke object URLs
  useEffect(() => {
    // Cleanup function to revoke object URLs when component unmounts
    return () => {
      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl);
      }
      if (uploadedFileUrl) {
        URL.revokeObjectURL(uploadedFileUrl);
      }
    };
  }, [recordingUrl, uploadedFileUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      
      const fileUrl = URL.createObjectURL(selectedFile);
      setUploadedFileUrl(fileUrl);
    }
  };


  const checkMicrophonePermission = async (): Promise<boolean> => {
    try {
      setRecordingError(null);
      
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices?.getUserMedia) {
        setRecordingError("Your browser doesn't support audio recording. Please try a different browser.");
        return false;
      }
      
      // Request permissions
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (error) {
      console.error("Microphone permission error:", error);
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setRecordingError("Microphone access was denied. Please allow microphone access in your browser settings.");
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          setRecordingError("No microphone found. Please connect a microphone and try again.");
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          setRecordingError("Your microphone is busy or unavailable. Please close other applications that might be using it.");
        } else if (error.name === 'OverconstrainedError') {
          setRecordingError("Microphone constraints cannot be satisfied. Please try a different microphone.");
        } else if (error.name === 'TypeError') {
          setRecordingError("No constraints were specified for the microphone. Please reload the page and try again.");
        } else {
          setRecordingError(`An error occurred: ${error.name}`);
        }
      } else {
        setRecordingError("An unexpected error occurred while accessing the microphone.");
      }
      return false;
    }
  };

  const startRecording = async () => {
    const hasPermission = await checkMicrophonePermission();
    if (!hasPermission) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let options: MediaRecorderOptions = {};
      
      if (MediaRecorder.isTypeSupported('audio/webm')) {
        options = { mimeType: 'audio/webm' };
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        options = { mimeType: 'audio/mp4' };
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        options = { mimeType: 'audio/ogg' };
      }
      
      const recorder = new MediaRecorder(stream, options);
      recordedChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        
        if (recordedChunksRef.current.length === 0) {
          setRecordingError("No audio data was captured. Please try again.");
          return;
        }
        
        const blob = new Blob(recordedChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        const fileFromRecording = new File([blob], "recorded_audio.webm", { type: blob.type });
        setFile(fileFromRecording);
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingError(null);
    } catch (error) {
      console.error("Error starting recording:", error);
      setRecordingError("Failed to start recording. Please check your microphone settings and try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.error("Error stopping recording:", error);
        setRecordingError("Failed to stop recording properly. Please refresh the page.");
      }
      setIsRecording(false);
    }
  };

  const resetRecording = () => {
    setFile(null);
    setRecordingUrl(null);
    setRecordingError(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file && uploadedFileUrl) {
      router.push(`/results?file=${encodeURIComponent(file.name)}&fileUrl=${encodeURIComponent(uploadedFileUrl)}`);
    }
  };

  const submitFile = () => {
    if (file) {
      if (recordingUrl) {
        router.push(`/results?file=${encodeURIComponent(file.name)}&isRecording=true&recordingUrl=${encodeURIComponent(recordingUrl)}`);
      } else {
        router.push(`/results?file=${encodeURIComponent(file.name)}&isRecording=true`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Header with Mobile Support */}
      <header className="flex items-center justify-between py-4 px-4 sm:px-8 bg-white border-b border-gray-100 sticky top-0 left-0 right-0 z-50">
        <div className="text-2xl font-bold text-green-700">NerVox</div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <a href="#hero" className="text-gray-700 hover:text-green-700 font-medium">Home</a>
            </li>
            <li>
              <a href="#solutions" className="text-gray-700 hover:text-green-700 font-medium">Solutions</a>
            </li>
            <li>
              <a href="#case-studies" className="text-gray-700 hover:text-green-700 font-medium">Case Studies</a>
            </li>
            <li>
              <a href="#contact" className="text-gray-700 hover:text-green-700 font-medium">Our Team</a>
            </li>
            <li>
              <a href="#contact" className="text-gray-700 hover:text-green-700 font-medium">Contact</a>
            </li>
          </ul>
        </nav>
        
        {/* Desktop CTA Button */}
        <a 
          href="#upload" 
          className="hidden md:block bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-md font-medium transition-colors"
        >
          Try Neural Network
        </a>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-6 shadow-md fixed z-40 w-full">
          <nav>
            <ul className="flex flex-col space-y-4">
              <li>
                <a 
                  href="#hero" 
                  className="text-gray-700 hover:text-green-700 font-medium block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#solutions" 
                  className="text-gray-700 hover:text-green-700 font-medium block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Solutions
                </a>
              </li>
              <li>
                <a 
                  href="#case-studies" 
                  className="text-gray-700 hover:text-green-700 font-medium block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Case Studies
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="text-gray-700 hover:text-green-700 font-medium block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Our Team
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="text-gray-700 hover:text-green-700 font-medium block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </a>
              </li>
              <li>
                <a 
                  href="#upload"
                  className="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-md font-medium transition-colors block text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Try Neural Network
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Hero Section - updated for mobile */}
      <section
        id="hero"
        className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-white to-green-50"
      >
        <div className="max-w-6xl mx-auto text-center" data-aos="fade-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-800 leading-tight">
            Your Voice is the Gateway<br className="hidden sm:block" />to Untapped Knowledge.
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-gray-600">
            Creating Scalable, Hardware-Free Voice Analysis Using Advanced LSTM Neural Networks For Research and Industry.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="#upload"
              className="px-8 py-3 bg-green-700 text-white rounded-md text-lg hover:bg-green-800 transition-colors"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Try Our Voice Analysis AI
            </a>
            <a
              href="#about"
              className="px-8 py-3 border border-green-700 text-green-700 rounded-md text-lg hover:bg-green-50 transition-colors"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-20 px-4 md:px-6 bg-white" data-aos="fade-up">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">About</h2>
          <p className="text-base md:text-lg text-gray-600">
            We&apos;ve developed the first <span className="font-semibold">accurate</span> and <span className="font-semibold">scalable</span> voice analysis system using multi-head attention LSTM neural networks. It&apos;s now publicly available, and we&apos;ve applied it ourselves to build software for brain health assessment, neurology research, and mental wellness monitoring.
          </p>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-16 md:py-20 px-4 md:px-6 bg-gray-50" data-aos="fade-up">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-gray-800 text-center">Our Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="p-6 md:p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow" data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-xl md:text-2xl font-semibold mb-4 text-green-700">Real-Time Voice Analysis</h3>
              <p className="text-gray-600">
                Our neural network continuously monitors speech patterns to detect anomalies indicative of neurological conditions.
              </p>
            </div>
            <div className="p-6 md:p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow" data-aos="fade-up" data-aos-delay="200">
              <h3 className="text-xl md:text-2xl font-semibold mb-4 text-green-700">Non-Invasive Diagnostics</h3>
              <p className="text-gray-600">
                Use a standard laptop microphone with our AI for hassle-free, on-the-go assessments.
              </p>
            </div>
            <div className="p-6 md:p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow" data-aos="fade-up" data-aos-delay="300">
              <h3 className="text-xl md:text-2xl font-semibold mb-4 text-green-700">Actionable Reports</h3>
              <p className="text-gray-600">
                Our LSTM model generates detailed insights and metrics to help clinicians tailor treatment plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="py-16 md:py-20 px-4 md:px-6 bg-white" data-aos="fade-up">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-gray-800 text-center">Case Studies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-gray-50 p-6 md:p-8 rounded-xl" data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-xl md:text-2xl font-semibold mb-4 text-green-700">
                Early Detection in Clinical Trials
              </h3>
              <p className="text-gray-600">
                Our solution was implemented in clinical trials, accurately identifying early speech anomalies in patients, leading to timely interventions.
              </p>
            </div>
            <div className="bg-gray-50 p-6 md:p-8 rounded-xl" data-aos="fade-up" data-aos-delay="200">
              <h3 className="text-xl md:text-2xl font-semibold mb-4 text-green-700">
                Enhancing Telehealth Diagnostics
              </h3>
              <p className="text-gray-600">
                Integrated with telehealth platforms, our AI tool enables remote monitoring of speech patterns, ensuring that doctors can diagnose conditions without the need for in-person visits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* File Upload / Record Section */}
      <section id="upload" className="py-16 md:py-20 px-4 md:px-6 bg-green-50" data-aos="fade-up">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Submit Your Speech Sample</h2>
          <p className="text-base md:text-lg mb-8 text-gray-600">
            Choose to record on the spot or upload a file for AI-powered neurological analysis.
          </p>
          {/* Toggle buttons */}
          <div className="inline-flex p-1 mb-8 bg-gray-100 rounded-lg">
            <button
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium ${mode === 'upload' ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-gray-200'} transition-colors`}
              onClick={() => setMode('upload')}
            >
              Upload File
            </button>
            <button
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium ${mode === 'record' ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-gray-200'} transition-colors`}
              onClick={() => setMode('record')}
            >
              Record Audio
            </button>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm">
            {mode === 'upload' ? (
              // File upload form
              <form onSubmit={handleSubmit} className="flex flex-col items-center">
                {!uploadedFileUrl ? (
                  // Show file input only when no file is selected
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="mb-6 p-3 border border-gray-200 rounded-lg w-full max-w-md"
                  />
                ) : (
                  // Show audio preview when file is selected
                  <div className="w-full max-w-md mb-6">
                    <p className="text-md text-gray-600 mb-2">Preview your audio:</p>
                    <audio controls src={uploadedFileUrl} className="w-full mb-4"></audio>
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="px-6 sm:px-8 py-3 bg-green-700 text-white rounded-md text-lg hover:bg-green-800 transition-colors w-full sm:w-auto max-w-xs"
                  disabled={!file}
                >
                  Submit for Analysis
                </button>
              </form>
            ) : (
              // Recording interface
              <div className="flex flex-col items-center">
                {recordingError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md w-full max-w-md text-left">
                    <p className="font-medium">Error:</p>
                    <p>{recordingError}</p>
                  </div>
                )}
                
                {!isRecording && !recordingUrl && (
                  <button
                    onClick={startRecording}
                    className="px-6 sm:px-8 py-3 bg-green-700 text-white rounded-md text-lg hover:bg-green-800 transition-colors w-full sm:w-auto max-w-xs"
                  >
                    Start Recording
                  </button>
                )}
                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="px-6 sm:px-8 py-3 bg-red-500 text-white rounded-md text-lg hover:bg-red-600 transition-colors w-full sm:w-auto max-w-xs"
                  >
                    Stop Recording
                  </button>
                )}
                {recordingUrl && (
                  <div className="w-full max-w-md">
                    <audio controls src={recordingUrl} className="w-full mb-6"></audio>
                    <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                      <button
                        onClick={resetRecording}
                        className="px-5 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Record Again
                      </button>
                      <button
                        onClick={submitFile}
                        className="px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors"
                      >
                        Submit for Analysis
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-20 px-4 md:px-6 bg-white" data-aos="fade-up">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Get in Touch</h2>
          <p className="text-base md:text-lg mb-8 text-gray-600">
            Interested in learning more about our innovative diagnostic solutions? Contact us today to schedule a demo or consult with our experts.
          </p>
          <a
            href="mailto:contact@nervox.ai"
            className="inline-block px-6 sm:px-8 py-3 bg-green-700 text-white rounded-md text-lg hover:bg-green-800 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-10 bg-gray-50 text-center px-4">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-700">
            <i className="fab fa-linkedin text-xl"></i>
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-700">
            <i className="fab fa-github text-xl"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-700">
            <i className="fab fa-twitter text-xl"></i>
          </a>
        </div>
        <p className="text-gray-500">&copy; 2025 NerVox. All rights reserved.</p>
      </footer>
    </div>
  );
}
