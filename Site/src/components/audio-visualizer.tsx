"use client";

import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  analyser: AnalyserNode;
  isRecording: boolean;
}

export function AudioVisualizer({ analyser, isRecording }: AudioVisualizerProps) {
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null);
  const spectrogramCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!isRecording) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const waveformCanvas = waveformCanvasRef.current;
    const spectrogramCanvas = spectrogramCanvasRef.current;
    if (!waveformCanvas || !spectrogramCanvas) return;

    const waveformCtx = waveformCanvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
    const spectrogramCtx = spectrogramCanvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
    if (!waveformCtx || !spectrogramCtx) return;

    // Set up canvas sizes
    waveformCanvas.width = waveformCanvas.offsetWidth;
    waveformCanvas.height = waveformCanvas.offsetHeight;
    spectrogramCanvas.width = spectrogramCanvas.offsetWidth;
    spectrogramCanvas.height = spectrogramCanvas.offsetHeight;

    // Configure analyser
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const timeDataArray = new Uint8Array(analyser.fftSize);

    // Spectrogram settings
    const spectrogramWidth = spectrogramCanvas.width;
    const spectrogramHeight = spectrogramCanvas.height;
    const spectrogramData = new Uint8Array(spectrogramWidth * spectrogramHeight);

    function draw() {
      if (!isRecording) return;

      // Get frequency data
      analyser.getByteFrequencyData(dataArray);
      // Get time domain data
      analyser.getByteTimeDomainData(timeDataArray);

      // Draw waveform
      waveformCtx.fillStyle = 'rgb(17, 24, 39)';
      waveformCtx.fillRect(0, 0, waveformCanvas.width, waveformCanvas.height);
      waveformCtx.lineWidth = 2;
      waveformCtx.strokeStyle = 'rgb(59, 130, 246)';
      waveformCtx.beginPath();

      const sliceWidth = waveformCanvas.width / timeDataArray.length;
      let x = 0;

      for (let i = 0; i < timeDataArray.length; i++) {
        const v = timeDataArray[i] / 128.0;
        const y = v * waveformCanvas.height / 2;

        if (i === 0) {
          waveformCtx.moveTo(x, y);
        } else {
          waveformCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      waveformCtx.lineTo(waveformCanvas.width, waveformCanvas.height / 2);
      waveformCtx.stroke();

      // Draw spectrogram
      // Shift existing spectrogram data
      for (let i = 0; i < spectrogramWidth * (spectrogramHeight - 1); i++) {
        spectrogramData[i] = spectrogramData[i + spectrogramWidth];
      }

      // Add new frequency data
      for (let i = 0; i < spectrogramWidth; i++) {
        const index = Math.floor(i * bufferLength / spectrogramWidth);
        spectrogramData[spectrogramWidth * (spectrogramHeight - 1) + i] = dataArray[index];
      }

      // Draw spectrogram
      const imageData = spectrogramCtx.createImageData(spectrogramWidth, spectrogramHeight);
      for (let i = 0; i < spectrogramData.length; i++) {
        const value = spectrogramData[i];
        const index = i * 4;
        imageData.data[index] = 0; // R
        imageData.data[index + 1] = value; // G
        imageData.data[index + 2] = value; // B
        imageData.data[index + 3] = 255; // A
      }
      spectrogramCtx.putImageData(imageData, 0, 0);

      animationFrameRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, isRecording]);

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg p-4">
        <h3 className="text-sm font-medium mb-2">Waveform</h3>
        <canvas
          ref={waveformCanvasRef}
          className="w-full h-24 rounded-md bg-background"
        />
      </div>
      <div className="bg-card rounded-lg p-4">
        <h3 className="text-sm font-medium mb-2">Spectrogram</h3>
        <canvas
          ref={spectrogramCanvasRef}
          className="w-full h-32 rounded-md bg-background"
        />
      </div>
    </div>
  );
} 