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
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGradientPosition({ x, y });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const startRecording = async () => {
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const options = { mimeType: 'audio/webm' };
        const recorder = new MediaRecorder(stream, options);
        recordedChunksRef.current = [];
  
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };
  
        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setRecordingUrl(url);
          const fileFromRecording = new File([blob], "recorded_audio.webm", { type: blob.type });
          setFile(fileFromRecording);
        };
  
        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    } else {
      console.error("getUserMedia is not supported on this browser.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const resetRecording = () => {
    setFile(null);
    setRecordingUrl(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      router.push('/results');
    }
  };

  const submitFile = () => {
    if (file) {
      router.push('/results');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-black text-white font-sans">
      {/* Header */}
      <header className="flex items-center justify-between p-6 bg-black bg-opacity-90 fixed top-0 left-0 right-0 z-50">
        <div className="text-2xl font-bold text-[#ff3686]">NerVox</div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="#hero" className="hover:text-[#ff3686]">Home</a>
            </li>
            <li>
              <a href="#about" className="hover:text-[#ff3686]">About</a>
            </li>
            <li>
              <a href="#solutions" className="hover:text-[#ff3686]">Solutions</a>
            </li>
            <li>
              <a href="#case-studies" className="hover:text-[#ff3686]">Case Studies</a>
            </li>
            <li>
              <a href="#contact" className="hover:text-[#ff3686]">Contact</a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        onMouseMove={handleMouseMove}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Interactive Gradient Background */}
        <div
          className="absolute inset-0 -z-10 transition-all duration-300 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, cyan, #ff3686)",
            backgroundPosition: `${gradientPosition.x}% ${gradientPosition.y}%`,
            backgroundSize: "150% 150%",
          }}
        ></div>
        <div className="relative z-10 text-center px-4" data-aos="fade-up">
          <h1 className="text-6xl font-extrabold mb-4 text-[#ff3686]">
            Diagnosing Neurological Diseases with AI
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8 text-gray-300">
            Harnessing advanced speech pattern analysis to detect early signs of Neurological Diseases and improve patient outcomes.
          </p>
          <a
            href="#about"
            className="px-8 py-3 bg-[#ff3686] rounded-lg text-lg hover:bg-[#ff3686] transition"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 px-6 bg-gray-800 scroll-mt-20" data-aos="fade-up">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-[#ff3686]">Our Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-900 rounded-lg" data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-2xl font-semibold mb-4 text-[#ff3686]">Real-Time Speech Analysis</h3>
              <p className="text-gray-300">
                Continuously monitor speech patterns to detect anomalies indicative of Neurological Diseases.
              </p>
            </div>
            <div className="p-6 bg-gray-900 rounded-lg" data-aos="fade-up" data-aos-delay="200">
              <h3 className="text-2xl font-semibold mb-4 text-[#ff3686]">Non-Invasive Diagnostics</h3>
              <p className="text-gray-300">
                Use a standard laptop microphone for hassle-free, on-the-go assessments.
              </p>
            </div>
            <div className="p-6 bg-gray-900 rounded-lg" data-aos="fade-up" data-aos-delay="300">
              <h3 className="text-2xl font-semibold mb-4 text-[#ff3686]">Actionable Reports</h3>
              <p className="text-gray-300">
                Generate detailed insights and metrics to help clinicians tailor treatment plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="py-20 px-6 bg-gray-900" data-aos="fade-up">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-[#ff3686]">Case Studies</h2>
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center" data-aos="fade-up" data-aos-delay="100">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold mb-2 text-[#ff3686]">
                  Early Detection in Clinical Trials
                </h3>
                <p className="text-gray-300">
                  Our solution was implemented in clinical trials, accurately identifying early speech anomalies in patients, leading to timely interventions.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center" data-aos="fade-up" data-aos-delay="200">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold mb-2 text-[#ff3686]">
                  Enhancing Telehealth Diagnostics
                </h3>
                <p className="text-gray-300">
                  Integrated with telehealth platforms, our AI tool enables remote monitoring of speech patterns, ensuring that doctors can diagnose Neurological Diseases without the need for in‑person visits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* File Upload / Record Section */}
      <section id="upload" className="py-20 px-6 bg-gray-800 text-center" data-aos="fade-up">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-[#ff3686]">Submit Your Speech Sample</h2>
          <p className="text-lg mb-4 text-gray-300">
            Choose to record on the spot or upload a file for Neurological Diseases analysis.
          </p>
          {/* Toggle buttons */}
          <div className="mb-4 flex justify-center space-x-4">
            <button
              className={`px-4 py-2 rounded-lg ${mode === 'upload' ? 'bg-[#ff3686]' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => setMode('upload')}
            >
              Upload File
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${mode === 'record' ? 'bg-[#ff3686]' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => setMode('record')}
            >
              Record Audio
            </button>
          </div>

          {mode === 'upload' ? (
            // File upload form
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="mb-4 p-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-300"
              />
              <button type="submit" className="px-6 py-3 bg-[#ff3686] rounded-lg text-lg hover:bg-[#ff3686] transition">
                Submit for Diagnosis
              </button>
            </form>
          ) : (
            // Recording interface
            <div>
              {!isRecording && !recordingUrl && (
                <button
                  onClick={startRecording}
                  className="px-6 py-3 bg-[#ff3686] rounded-lg text-lg hover:bg-[#ff3686] transition"
                >
                  Start Recording
                </button>
              )}
              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="px-6 py-3 bg-red-500 rounded-lg text-lg hover:bg-red-600 transition"
                >
                  Stop Recording
                </button>
              )}
              {recordingUrl && (
                <div className="mt-4">
                  <audio controls src={recordingUrl}></audio>
                  <div className="mt-4 flex justify-center space-x-4">
                    <button
                      onClick={resetRecording}
                      className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                    >
                      Re-record
                    </button>
                    <button
                      onClick={submitFile}
                      className="px-6 py-3 bg-[#ff3686] rounded-lg text-lg hover:bg-[#ff3686] transition"
                    >
                      Submit for Diagnosis
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gray-900" data-aos="fade-up">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-[#ff3686]">Get in Touch</h2>
          <p className="text-lg mb-8 text-gray-300">
            Interested in learning more about our innovative diagnostic solutions? Contact us today to schedule a demo or consult with our experts.
          </p>
          <a
            href="mailto:contact@dysarthriadiagnostics.com"
            className="px-8 py-3 bg-[#ff3686] rounded-lg text-lg hover:bg-[#ff3686] transition"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-black text-center text-sm text-gray-300">
        <div className="flex justify-center space-x-6 mb-2">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff3686]">
            <i className="fab fa-linkedin text-xl"></i>
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff3686]">
            <i className="fab fa-github text-xl"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff3686]">
            <i className="fab fa-instagram text-xl"></i>
          </a>
        </div>
        <p>&copy; 2025 NerVox. All rights reserved.</p>
      </footer>
    </div>
  );
}
