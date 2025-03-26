"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mic, Upload, FileAudio, ExternalLink } from 'lucide-react';
import { AudioVisualizer } from '@/components/audio-visualizer';
import { ParticleEffect } from '@/components/particle-effect';

export default function Home() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'upload' | 'record'>('upload');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  // Add cleanup effect to revoke object URLs
  useEffect(() => {
    return () => {
      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl);
      }
      if (uploadedFileUrl) {
        URL.revokeObjectURL(uploadedFileUrl);
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [recordingUrl, uploadedFileUrl, audioContext]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type.startsWith('audio/')) {
        setFile(selectedFile);
        const fileUrl = URL.createObjectURL(selectedFile);
        setUploadedFileUrl(fileUrl);
      } else {
        alert('Please select an audio file');
      }
    }
  };

  const checkMicrophonePermission = async (): Promise<boolean> => {
    try {
      setRecordingError(null);
      
      if (!navigator.mediaDevices?.getUserMedia) {
        setRecordingError("Your browser doesn't support audio recording. Please try a different browser.");
        return false;
      }
      
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

      // Set up audio visualization
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 2048;
      source.connect(analyserNode);
      setAudioContext(audioCtx);
      setAnalyser(analyserNode);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file && uploadedFileUrl) {
      setIsAnalyzing(true);
      try {
        await router.push(`/results?file=${encodeURIComponent(file.name)}&fileUrl=${encodeURIComponent(uploadedFileUrl)}`);
      } catch (error) {
        console.error("Error submitting file:", error);
        setIsAnalyzing(false);
      }
    }
  };

  const submitFile = async () => {
    if (file) {
      setIsAnalyzing(true);
      try {
        if (recordingUrl) {
          await router.push(`/results?file=${encodeURIComponent(file.name)}&isRecording=true&recordingUrl=${encodeURIComponent(recordingUrl)}`);
        } else {
          await router.push(`/results?file=${encodeURIComponent(file.name)}&isRecording=true`);
        }
      } catch (error) {
        console.error("Error submitting file:", error);
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Similar to Vytal.ai */}
      <header className="sticky top-0 z-50 w-full bg-primary text-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link className="flex items-center space-x-2" href="/">
            <span className="font-bold text-xl">NerVox</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/api" className="text-sm font-medium hover:text-white/80">API</Link>
            <Link href="/solutions" className="text-sm font-medium hover:text-white/80">Solutions</Link>
            <Link href="/test" className="text-sm font-medium hover:text-white/80">Test Demo</Link>
            <Link href="/team" className="text-sm font-medium hover:text-white/80">Our Team</Link>
            <Link href="/news" className="text-sm font-medium hover:text-white/80">News</Link>
            <Link href="/contact" className="text-sm font-medium hover:text-white/80">Contact</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/try-api" className="bg-white text-primary px-4 py-1 rounded-full text-sm font-medium hover:bg-white/90">
              Try API
            </Link>
          </div>
        </div>
        <div className="bg-accent text-white text-center py-1 text-xs">
          <span>NerVox 2.0: Analyze voice data with our new neural models.</span>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section - With particle effect like Vytal */}
        <section className="bg-white py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="mx-auto mb-12 max-w-[300px] h-[300px] relative" data-aos="zoom-in" data-aos-duration="1000">
              <ParticleEffect />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6" data-aos="fade-up" data-aos-delay="200">
              Your Voice is the Gateway<br />to Untapped Knowledge.
            </h1>
            <p className="max-w-[800px] mx-auto text-gray-600 text-lg mb-10" data-aos="fade-up" data-aos-delay="300">
              Creating Scalable, Hardware-Free Voice Analysis Solutions For Research and Industry.
            </p>
            <div className="flex justify-center space-x-4" data-aos="fade-up" data-aos-delay="400">
              <Link href="#analyze" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors hover:scale-105 transition-transform">
                Try Our Voice Analysis
              </Link>
              <Link href="/solutions" className="border border-primary text-primary px-6 py-3 rounded-md hover:bg-secondary transition-colors hover:scale-105 transition-transform">
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-secondary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-6" data-aos="fade-up">ABOUT</h2>
            <p className="max-w-[900px] mx-auto text-gray-700 mb-8" data-aos="fade-up" data-aos-delay="100">
              We&apos;ve developed the first <span className="font-semibold">accurate</span> and <span className="font-semibold">scalable</span> webcam voice-analysis system. It&apos;s now publicly available, and we&apos;ve applied it ourselves to build software for brain health assessment, neuroplasma research, and mental wellness monitoring.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center" data-aos="fade-up">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow" data-aos="fade-up" data-aos-delay="100">
                <div className="text-primary text-3xl mb-4">01</div>
                <h3 className="text-xl font-semibold mb-2">Advanced Neural Models</h3>
                <p className="text-gray-600">
                  Our advanced neural models analyze voice patterns to detect subtle indicators of neurological conditions.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow" data-aos="fade-up" data-aos-delay="200">
                <div className="text-primary text-3xl mb-4">02</div>
                <h3 className="text-xl font-semibold mb-2">Non-Invasive Analysis</h3>
                <p className="text-gray-600">
                  Get valuable insights without invasive procedures. All you need is a voice recording.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow" data-aos="fade-up" data-aos-delay="300">
                <div className="text-primary text-3xl mb-4">03</div>
                <h3 className="text-xl font-semibold mb-2">Seamless Integration</h3>
                <p className="text-gray-600">
                  Easy to integrate into your existing systems with our robust API and SDKs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section id="analyze" className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12" data-aos="fade-up">
                <h2 className="text-3xl font-bold mb-4">Try Voice Analysis Now</h2>
                <p className="text-gray-700">
                  Upload an audio file or record your voice to see our analysis in action.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8" data-aos="fade-up" data-aos-delay="100">
                <div className="mb-6">
                  <div className="flex justify-center space-x-4 mb-6">
                    <Button
                      variant={mode === 'upload' ? 'default' : 'outline'}
                      onClick={() => setMode('upload')}
                      className={`min-w-[120px] ${mode === 'upload' ? 'bg-primary text-white hover:bg-primary/90' : ''} transition-all hover:scale-105`}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                    <Button
                      variant={mode === 'record' ? 'default' : 'outline'}
                      onClick={() => setMode('record')}
                      className={`min-w-[120px] ${mode === 'record' ? 'bg-primary text-white hover:bg-primary/90' : ''} transition-all hover:scale-105`}
                    >
                      <Mic className="mr-2 h-4 w-4" />
                      Record
                    </Button>
                  </div>

                  {mode === 'upload' ? (
                    <div className="space-y-4" data-aos="fade-up" data-aos-delay="200">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="border-2 border-dashed border-primary/20 rounded-xl p-8 text-center hover:border-primary/40 transition-all hover:bg-primary/5">
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                          />
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <FileAudio className="h-12 w-12 text-primary/60 mb-2 transition-transform hover:scale-110" />
                            <span className="text-sm text-gray-500">
                              {file ? file.name : 'Click to upload an audio file'}
                            </span>
                          </label>
                        </div>
                        {file && uploadedFileUrl && (
                          <div className="space-y-4" data-aos="fade-up">
                            <audio controls src={uploadedFileUrl} className="w-full" />
                            <Button type="submit" className="w-full animate-pulse hover:animate-none" disabled={isAnalyzing}>
                              {isAnalyzing ? 'Analyzing...' : 'Analyze Audio'}
                            </Button>
                          </div>
                        )}
                      </form>
                    </div>
                  ) : (
                    <div className="space-y-4" data-aos="fade-up" data-aos-delay="200">
                      <div className="flex justify-center">
                        <Button
                          onClick={isRecording ? stopRecording : startRecording}
                          variant={isRecording ? 'destructive' : 'default'}
                          className={`w-24 h-24 rounded-full transition-all ${isRecording ? 'animate-pulse' : 'hover:scale-105'}`}
                        >
                          {isRecording ? 'Stop' : 'Record'}
                        </Button>
                      </div>
                      {isRecording && analyser && (
                        <AudioVisualizer
                          analyser={analyser}
                          isRecording={isRecording}
                        />
                      )}
                      {recordingError && (
                        <div className="text-destructive text-sm text-center">{recordingError}</div>
                      )}
                      {recordingUrl && (
                        <div className="space-y-4" data-aos="fade-up">
                          <audio controls src={recordingUrl} className="w-full" />
                          <Button onClick={submitFile} className="w-full animate-pulse hover:animate-none" disabled={isAnalyzing}>
                            {isAnalyzing ? 'Analyzing...' : 'Analyze Audio'}
                          </Button>
                          <Button onClick={resetRecording} variant="outline" className="w-full">
                            Record Again
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12" data-aos="fade-up">
              <h2 className="text-3xl font-bold mb-4">Use Cases</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our voice analysis technology can be applied in various fields:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow" data-aos="fade-up" data-aos-delay="100">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Healthcare</h3>
                  <p className="text-gray-600">Early detection of neurological conditions through voice analysis.</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow" data-aos="fade-up" data-aos-delay="200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Research</h3>
                  <p className="text-gray-600">Advanced tools for neuroscience and linguistic research.</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow" data-aos="fade-up" data-aos-delay="300">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Elder Care</h3>
                  <p className="text-gray-600">Monitoring cognitive health in aging populations.</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow" data-aos="fade-up" data-aos-delay="400">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Telemedicine</h3>
                  <p className="text-gray-600">Remote assessment capabilities for healthcare providers.</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-10" data-aos="fade-up" data-aos-delay="500">
              <Link href="/solutions" className="inline-flex items-center text-primary font-medium hover:underline">
                Learn more about our solutions <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Integrate our voice analysis technology into your applications and start gaining valuable insights today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/api" className="bg-white text-primary px-6 py-3 rounded-md hover:bg-white/90 transition-all hover:scale-105">
                Explore API
              </Link>
              <Link href="/contact" className="border border-white text-white px-6 py-3 rounded-md hover:bg-primary/80 transition-all hover:scale-105">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div data-aos="fade-up" data-aos-delay="100">
              <h3 className="font-bold text-xl mb-4">NerVox</h3>
              <p className="text-gray-400">
                Advanced voice analysis platform for healthcare professionals and researchers.
              </p>
            </div>
            <div data-aos="fade-up" data-aos-delay="200">
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2">
                <li><Link href="/api" className="text-gray-400 hover:text-white">API</Link></li>
                <li><Link href="/solutions" className="text-gray-400 hover:text-white">Solutions</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div data-aos="fade-up" data-aos-delay="300">
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-gray-400 hover:text-white">Documentation</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div data-aos="fade-up" data-aos-delay="400">
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 NerVox. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
