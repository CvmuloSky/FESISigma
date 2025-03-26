"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mic, FileAudio, ArrowLeft, ExternalLink, Info } from 'lucide-react';
import { AudioVisualizer } from '@/components/audio-visualizer';

// TypeScript interface for analysis results
interface AnalysisResults {
  status: string;
  file_name: string;
  analysis_time: string;
  confidence: number;
  predictions: Record<string, number>;
  features: {
    pitch: {
      mean: number;
      variation: number;
    };
    intensity: {
      mean: number;
      variation: number;
    };
    rhythm: {
      rate: number;
      regularity: number;
    };
  };
  recommendations: string[];
}

export default function TestPage() {
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
  const [results, setResults] = useState<AnalysisResults | null>(null);

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
    setResults(null);
  };

  const analyzeAudio = async () => {
    setIsAnalyzing(true);
    
    try {
      if (!file) {
        throw new Error("No audio file selected");
      }
      
      // Navigate to results page with file information instead of showing mock results
      router.push(`/results?file=${encodeURIComponent(file.name)}&fileUrl=${encodeURIComponent(uploadedFileUrl || '')}&isRecording=${isRecording}&recordingUrl=${encodeURIComponent(recordingUrl || '')}`);
    } catch (error) {
      console.error("Error analyzing audio:", error);
      setRecordingError("Failed to analyze audio. Please try again.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-primary text-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link className="flex items-center space-x-2" href="/">
            <span className="font-bold text-xl">NerVox</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm font-medium hover:text-white/80 flex items-center">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
        <div className="bg-accent text-white text-center py-1 text-xs">
          <span>Testing Environment: For demonstration purposes only</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10" data-aos="fade-up">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Voice Analysis Testing</h1>
            <p className="text-gray-600">
              Upload an audio file or record your voice to test our voice analysis model. This demo uses pre-defined results from test-results.json for demonstration purposes.
            </p>
            <div className="flex items-center mt-2 text-sm text-blue-600">
              <Info className="h-4 w-4 mr-1" />
              <span>Results come from test-results.json based on filename matching or default values</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6" data-aos="fade-right" data-aos-delay="100">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Input</h2>
              
              <div className="mb-6">
                <div className="flex justify-center space-x-4 mb-6">
                  <Button
                    variant={mode === 'record' ? 'default' : 'outline'}
                    onClick={() => setMode('record')}
                    className={`min-w-[120px] ${mode === 'record' ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Record Audio
                  </Button>
                  <Button
                    variant={mode === 'upload' ? 'default' : 'outline'}
                    onClick={() => setMode('upload')}
                    className={`min-w-[120px] ${mode === 'upload' ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
                  >
                    <FileAudio className="mr-2 h-4 w-4" />
                    Upload Audio
                  </Button>
                </div>

                {mode === 'upload' ? (
                  <div className="space-y-4" data-aos="fade-up" data-aos-delay="200">
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
                        <Button onClick={analyzeAudio} className="w-full animate-pulse hover:animate-none" disabled={isAnalyzing}>
                          {isAnalyzing ? 'Analyzing...' : 'Analyze Audio'}
                        </Button>
                      </div>
                    )}
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
                        <Button onClick={analyzeAudio} className="w-full animate-pulse hover:animate-none" disabled={isAnalyzing}>
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

            {/* Results Panel */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6" data-aos="fade-left" data-aos-delay="100">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Results</h2>
              
              {!results && !isAnalyzing && (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                  <Info className="h-12 w-12 mb-4 text-gray-300" />
                  <p className="text-center">Upload or record audio to see analysis results</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="h-64 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Analyzing your audio...</p>
                </div>
              )}

              {results && !isAnalyzing && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between" data-aos="fade-up" data-aos-delay="150">
                    <span className="text-gray-600">Confidence Score</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${results.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">{Math.round(results.confidence * 100)}%</span>
                    </div>
                  </div>

                  <div data-aos="fade-up" data-aos-delay="200">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Predictions</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {Object.entries(results.predictions).map(([key, value]: [string, number], index) => (
                        <div key={key} className="flex justify-between mb-1" data-aos="fade-left" data-aos-delay={250 + index * 50}>
                          <span className="capitalize">{key}</span>
                          <span className="font-medium">{Math.round(Number(value) * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div data-aos="fade-up" data-aos-delay="300">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Voice Features</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="transition-all hover:bg-white hover:shadow-sm p-2 rounded" data-aos="zoom-in" data-aos-delay="350">
                          <div className="text-xs text-gray-500">Pitch</div>
                          <div className="font-medium">{results.features.pitch.mean.toFixed(1)} Hz</div>
                        </div>
                        <div className="transition-all hover:bg-white hover:shadow-sm p-2 rounded" data-aos="zoom-in" data-aos-delay="400">
                          <div className="text-xs text-gray-500">Intensity</div>
                          <div className="font-medium">{results.features.intensity.mean.toFixed(1)} dB</div>
                        </div>
                        <div className="transition-all hover:bg-white hover:shadow-sm p-2 rounded" data-aos="zoom-in" data-aos-delay="450">
                          <div className="text-xs text-gray-500">Rhythm</div>
                          <div className="font-medium">{results.features.rhythm.rate.toFixed(1)} syl/s</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div data-aos="fade-up" data-aos-delay="500">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Recommendations</h3>
                    <ul className="bg-gray-50 p-4 rounded-lg space-y-2">
                      {results.recommendations.map((recommendation: string, index: number) => (
                        <li key={index} className="text-sm" data-aos="fade-left" data-aos-delay={550 + index * 50}>{recommendation}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between pt-4" data-aos="fade-up" data-aos-delay="600">
                    <Button variant="outline" size="sm" onClick={resetRecording} className="hover:scale-105 transition-transform">
                      Test Another
                    </Button>
                    <Button size="sm" className="hover:scale-105 transition-transform">
                      Export Results
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-100" data-aos="fade-up" data-aos-delay="200">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">About Voice Analysis</h2>
            <p className="text-gray-600 mb-4">
              Our voice analysis model uses advanced machine learning techniques to analyze voice patterns and provide insights about vocal health and characteristics.
            </p>
            <div className="flex justify-end">
              <Link href="/docs" className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors hover:underline">
                Learn More About Our Technology <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2024 NerVox. All rights reserved. This is a demonstration environment.</p>
        </div>
      </footer>
    </div>
  );
} 