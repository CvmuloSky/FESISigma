"use client";

import Link from 'next/link';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export default function ApiPage() {
  const [copyStatus, setCopyStatus] = useState({
    authentication: false,
    analyze: false,
    stream: false,
  });

  const handleCopy = (code: string, key: keyof typeof copyStatus) => {
    navigator.clipboard.writeText(code);
    setCopyStatus(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopyStatus(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-primary text-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link className="flex items-center space-x-2" href="/">
            <span className="font-bold text-xl">NerVox</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/api" className="text-sm font-medium text-white">API</Link>
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
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">Voice Analysis API</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Integrate our advanced neural models into your applications to analyze voice data for healthcare insights.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/try-api" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 font-medium">
                Get API Key
              </Link>
              <Link href="/docs" className="bg-secondary text-gray-800 px-6 py-3 rounded-md hover:bg-secondary/90 font-medium">
                View Documentation
              </Link>
            </div>
          </div>

          {/* API Overview */}
          <section className="mb-20">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">API Overview</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-secondary/30 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Easy Integration</h3>
                    <p className="text-gray-600">
                      Simple REST API that works with any programming language or framework. 
                      Comprehensive SDKs for Python, JavaScript, and more.
                    </p>
                  </div>
                  
                  <div className="bg-secondary/30 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Secure & Compliant</h3>
                    <p className="text-gray-600">
                      HIPAA-compliant infrastructure with end-to-end encryption. 
                      All data is processed according to strict security protocols.
                    </p>
                  </div>
                  
                  <div className="bg-secondary/30 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Flexible Usage</h3>
                    <p className="text-gray-600">
                      Upload audio files or stream in real-time. 
                      Process batches of recordings or analyze individual samples.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Base URL</h3>
                  <div className="bg-gray-900 text-white p-4 rounded-md font-mono text-sm relative">
                    <p>https://api.nervox.ai/v2</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Code Examples */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">Code Examples</h2>
            
            <div className="space-y-8">
              {/* Authentication */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Authentication</h3>
                  <button 
                    onClick={() => handleCopy(`curl -X GET https://api.nervox.ai/v2/auth \
  -H "Authorization: Bearer YOUR_API_KEY"`, 'authentication')}
                    className="text-gray-500 hover:text-primary"
                  >
                    {copyStatus.authentication ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="bg-gray-900 text-white p-4 rounded-md font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap">
{`curl -X GET https://api.nervox.ai/v2/auth \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                  </pre>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Include your API key in the Authorization header for all requests. 
                  You can get your API key from the developer dashboard.
                </p>
              </div>
              
              {/* Analyze Audio */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Analyze Audio File</h3>
                  <button 
                    onClick={() => handleCopy(`curl -X POST https://api.nervox.ai/v2/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F "audio=@sample.wav" \\
  -F "model=neuro-v2" \\
  -F "sensitivity=0.8"`, 'analyze')}
                    className="text-gray-500 hover:text-primary"
                  >
                    {copyStatus.analyze ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="bg-gray-900 text-white p-4 rounded-md font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap">
{`curl -X POST https://api.nervox.ai/v2/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F "audio=@sample.wav" \\
  -F "model=neuro-v2" \\
  -F "sensitivity=0.8"`}
                  </pre>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Upload an audio file for analysis. Supports WAV, MP3, and FLAC formats. 
                  You can specify the model version and sensitivity level.
                </p>
              </div>
              
              {/* Stream Analysis */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Stream Analysis</h3>
                  <button 
                    onClick={() => handleCopy(`const socket = new WebSocket("wss://api.nervox.ai/v2/stream?key=YOUR_API_KEY");

socket.onopen = function(e) {
  console.log("Connection established");
};

// Send audio chunks
socket.send(audioChunk);

socket.onmessage = function(event) {
  const results = JSON.parse(event.data);
  console.log("Analysis results:", results);
};`, 'stream')}
                    className="text-gray-500 hover:text-primary"
                  >
                    {copyStatus.stream ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="bg-gray-900 text-white p-4 rounded-md font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap">
{`const socket = new WebSocket("wss://api.nervox.ai/v2/stream?key=YOUR_API_KEY");

socket.onopen = function(e) {
  console.log("Connection established");
};

// Send audio chunks
socket.send(audioChunk);

socket.onmessage = function(event) {
  const results = JSON.parse(event.data);
  console.log("Analysis results:", results);
};`}
                  </pre>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Stream audio in real-time for continuous analysis. 
                  Ideal for applications requiring immediate feedback or monitoring.
                </p>
              </div>
            </div>
          </section>

          {/* Response Format */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">Response Format</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Sample Response</h3>
              <div className="bg-gray-900 text-white p-4 rounded-md font-mono text-sm overflow-x-auto">
                <pre className="whitespace-pre-wrap">
{`{
  "status": "success",
  "request_id": "req_7a8b9c0d1e2f",
  "timestamp": "2024-05-15T14:22:33Z",
  "processing_time_ms": 245,
  "results": {
    "confidence": 0.92,
    "predictions": [
      {
        "condition": "normal",
        "probability": 0.85,
        "threshold": 0.7,
        "indicators": ["rhythm", "tonality", "cadence"]
      },
      {
        "condition": "mild_anomaly",
        "probability": 0.12,
        "threshold": 0.5,
        "indicators": ["slight_tremor"]
      }
    ],
    "waveform_url": "https://api.nervox.ai/results/req_7a8b9c0d1e2f/waveform.png",
    "spectrogram_url": "https://api.nervox.ai/results/req_7a8b9c0d1e2f/spectrogram.png"
  },
  "metadata": {
    "duration_seconds": 15.2,
    "sample_rate": 44100,
    "channels": 1,
    "format": "wav"
  }
}`}
                </pre>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Results Object</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><span className="font-mono text-primary">confidence</span> - Overall confidence in analysis</li>
                    <li><span className="font-mono text-primary">predictions</span> - Array of detected conditions</li>
                    <li><span className="font-mono text-primary">waveform_url</span> - URL to audio waveform visualization</li>
                    <li><span className="font-mono text-primary">spectrogram_url</span> - URL to frequency analysis visualization</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Prediction Object</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><span className="font-mono text-primary">condition</span> - Identified condition or state</li>
                    <li><span className="font-mono text-primary">probability</span> - Likelihood (0-1) of the condition</li>
                    <li><span className="font-mono text-primary">threshold</span> - Minimum value for reliable detection</li>
                    <li><span className="font-mono text-primary">indicators</span> - Specific vocal features contributing to detection</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section>
            <h2 className="text-2xl font-bold mb-8 text-gray-900">Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Developer</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold text-gray-900">$49</span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Perfect for individual developers and small projects.
                  </p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">1,000 API calls/month</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">Standard models access</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">Community support</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">Basic analytics dashboard</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link 
                      href="/try-api" 
                      className="block w-full bg-primary text-white text-center px-4 py-2 rounded-md hover:bg-primary/90 font-medium"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-primary relative">
                <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium">
                  Popular
                </div>
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Professional</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold text-gray-900">$199</span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    For growing teams and production applications.
                  </p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">10,000 API calls/month</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">Advanced models access</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">Email & chat support</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">Advanced analytics & reporting</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">Webhook integrations</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link 
                      href="/try-api" 
                      className="block w-full bg-primary text-white text-center px-4 py-2 rounded-md hover:bg-primary/90 font-medium"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Enterprise</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold text-gray-900">Custom</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    For organizations with specific requirements.
                  </p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">Unlimited API calls</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">All models including beta access</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">Dedicated account manager</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">24/7 priority support</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">Custom model training</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">On-premise deployment option</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link 
                      href="/contact" 
                      className="block w-full bg-secondary text-gray-900 text-center px-4 py-2 rounded-md hover:bg-secondary/90 font-medium"
                    >
                      Contact Sales
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-center text-gray-600 mt-8">
              All plans come with a 14-day free trial, no credit card required. <Link href="/pricing" className="text-primary hover:underline">View detailed pricing</Link>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">NerVox</h3>
              <p className="text-gray-400">
                Advanced voice analysis platform for healthcare professionals and researchers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2">
                <li><Link href="/api" className="text-gray-400 hover:text-white">API</Link></li>
                <li><Link href="/solutions" className="text-gray-400 hover:text-white">Solutions</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-gray-400 hover:text-white">Documentation</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
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