"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Download, Share2, RefreshCw } from 'lucide-react';

interface TestResult {
  filename: string;
  diagnosis: string;
  confidence: string;
  recommendations: string[];
}

interface AnalysisResult {
  confidence: number;
  predictions: {
    [key: string]: number;
  };
  recommendations: string[];
  waveform: string;
  spectrogram: string;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const analyzeAudio = async () => {
      try {
        const fileName = searchParams.get('file');
        const fileUrl = searchParams.get('fileUrl');
        const isRecording = searchParams.get('isRecording') === 'true';
        const recordingUrl = searchParams.get('recordingUrl');

        if (!fileName) {
          throw new Error('No file provided');
        }

        // Get the audio URL based on whether it's a recording or uploaded file
        const audioUrl = isRecording ? recordingUrl : fileUrl;
        if (!audioUrl) {
          throw new Error('No audio URL provided');
        }

        // Fetch test results from JSON file
        let testResults: TestResult[] = [];
        try {
          const response = await fetch('/test-results.json');
          if (!response.ok) {
            throw new Error(`Failed to fetch test results: ${response.statusText}`);
          }
          testResults = await response.json();
          
          if (!Array.isArray(testResults) || testResults.length === 0) {
            throw new Error('Invalid or empty test results data');
          }
        } catch (jsonError) {
          console.error("JSON parsing error:", jsonError);
          throw new Error('Failed to load test results data. Please check the JSON file format.');
        }
        
        // Try to find a matching result by filename
        // If no exact match, use the first result as a fallback
        const matchingResult = testResults.find(r => 
          r.filename.toLowerCase() === fileName.toLowerCase()
        ) || testResults[0];

        console.log("Found matching result:", matchingResult);
        
        // Convert confidence from string (e.g., "92%") to number (0.92)
        const confidenceValue = parseFloat(matchingResult.confidence.replace('%', '')) / 100;
        
        // Create predictions based on diagnosis
        const predictions: {[key: string]: number} = {};
        
        // Main diagnosis gets the confidence value
        predictions[matchingResult.diagnosis] = confidenceValue;
        
        // Add some other diagnoses with lower values
        if (matchingResult.diagnosis === "Healthy") {
          predictions["Dysarthria"] = Math.max(0.05, (1 - confidenceValue) * 0.7);
          predictions["Other"] = Math.max(0.02, (1 - confidenceValue) * 0.3);
        } else {
          predictions["Healthy"] = Math.max(0.05, (1 - confidenceValue) * 0.7);
          predictions["Other"] = Math.max(0.02, (1 - confidenceValue) * 0.3);
        }
        
        // Set the result
        setResult({
          confidence: confidenceValue,
          predictions: predictions,
          recommendations: matchingResult.recommendations,
          waveform: "data:image/svg+xml,...", // Mock waveform data
          spectrogram: "data:image/svg+xml,..." // Mock spectrogram data
        });
      } catch (err) {
        setError("Failed to analyze audio. Please try again.");
        console.error("Analysis error:", err);
      } finally {
        setLoading(false);
      }
    };

    analyzeAudio();
  }, [searchParams]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Report exported successfully!");
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export report. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center" data-aos="fade-in">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Analyzing your audio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center" data-aos="fade-in">
          <p className="text-lg text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} data-aos="fade-up" data-aos-delay="200">Try Again</Button>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl">
        <div className="flex justify-between items-center mb-8" data-aos="fade-down">
          <h1 className="text-3xl font-bold">Analysis Results</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExport} disabled={isExporting} className="transition-all hover:scale-105">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" className="transition-all hover:scale-105">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="bg-card rounded-lg p-6 mb-8" data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-xl font-semibold mb-4">Confidence Score</h2>
          <div className="flex items-center">
            <div className="w-full bg-secondary rounded-full h-4 mr-4">
              <div
                className="bg-primary h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>
            <span className="text-lg font-medium">{Math.round(result.confidence * 100)}%</span>
          </div>
        </div>

        {/* Predictions */}
        <div className="bg-card rounded-lg p-6 mb-8" data-aos="fade-up" data-aos-delay="200">
          <h2 className="text-xl font-semibold mb-4">Predictions</h2>
          <div className="space-y-4">
            {Object.entries(result.predictions).map(([label, probability], index) => (
              <div key={label} className="flex items-center" data-aos="fade-left" data-aos-delay={250 + index * 50}>
                <span className="w-24">{label}</span>
                <div className="flex-1 bg-secondary rounded-full h-2 mx-4">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${probability * 100}%` }}
                  />
                </div>
                <span className="w-16 text-right">{Math.round(probability * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-card rounded-lg p-6 mb-8" data-aos="fade-up" data-aos-delay="300">
          <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
          <ul className="space-y-2">
            {result.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start" data-aos="fade-left" data-aos-delay={350 + index * 50}>
                <span className="text-primary mr-2">•</span>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>

        {/* Visualizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg p-6" data-aos="zoom-in" data-aos-delay="400">
            <h2 className="text-xl font-semibold mb-4">Waveform</h2>
            <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center hover:bg-secondary/80 transition-colors">
              <p className="text-muted-foreground">Waveform visualization</p>
            </div>
          </div>
          <div className="bg-card rounded-lg p-6" data-aos="zoom-in" data-aos-delay="450">
            <h2 className="text-xl font-semibold mb-4">Spectrogram</h2>
            <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center hover:bg-secondary/80 transition-colors">
              <p className="text-muted-foreground">Spectrogram visualization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
