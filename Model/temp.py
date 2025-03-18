import librosa
import librosa.display
import numpy as np
import soundfile as sf
import matplotlib.pyplot as plt
from pydub import AudioSegment
from scipy.signal import butter, lfilter
import random

def plot_waveforms(waveforms, sr, titles):
    plt.figure(figsize=(12, 8))
    for i, (y, title) in enumerate(zip(waveforms, titles), 1):
        plt.subplot(len(waveforms), 1, i)
        librosa.display.waveshow(y, sr=sr)
        plt.title(title)
        plt.xlabel("Time (s)")
        plt.ylabel("Amplitude")
    plt.tight_layout()
    plt.show()

def pitch_shift(y, sr):
    semitones = random.uniform(-5, 5)  # Random shift between -5 and 5 semitones
    return librosa.effects.pitch_shift(y, sr=sr, n_steps=semitones)

def add_background_noise(y):
    noise_level = random.uniform(0.01, 0.1)  # Random noise level between 0.01 and 0.1
    noise = np.random.normal(0, noise_level, y.shape)
    return y + noise

def apply_lowpass_filter(y, sr):
    cutoff = random.randint(1000, 5000)  # Random cutoff between 1000Hz and 5000Hz
    order = random.randint(3, 8)  # Random filter order between 3 and 8
    
    def butter_lowpass(cutoff, sr, order):
        nyquist = 0.5 * sr
        normal_cutoff = cutoff / nyquist
        b, a = butter(order, normal_cutoff, btype='low', analog=False)
        return b, a
    
    def lowpass_filter(data, sr, cutoff, order):
        b, a = butter_lowpass(cutoff, sr, order)
        return lfilter(b, a, data)
    
    return lowpass_filter(y, sr, cutoff, order)

if __name__ == "__main__":
    input_wav = ".wav"  # Replace with your file
    y, sr = librosa.load(input_wav, sr=None)
    
    y_shifted = pitch_shift(y, sr)
    y_noisy = add_background_noise(y_shifted)
    y_filtered = apply_lowpass_filter(y_noisy, sr)
    
    plot_waveforms([y, y_shifted, y_noisy, y_filtered], sr, ["Original", "Pitch Shifted", "Noisy", "Filtered"])
    
    sf.write("pitch_shifted.wav", y_shifted, sr)
    sf.write("noisy.wav", y_noisy, sr)
    sf.write("filtered.wav", y_filtered, sr)
    
    print("Processed files saved: pitch_shifted.wav, noisy.wav, filtered.wav")
