import librosa
import numpy as np
import pandas as pd
import sys
import os
import warnings

def extract_acoustic_features(wav_file):
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            y, sr = librosa.load(wav_file, sr=None)
        
        features = {
            "Gender": "Male",
            "Duration (s)": librosa.get_duration(y=y, sr=sr),
            "RMS Energy": np.mean(librosa.feature.rms(y=y)),
            "ZCR (Zero Crossing Rate)": np.mean(librosa.feature.zero_crossing_rate(y=y)),
            "Spectral Centroid": np.mean(librosa.feature.spectral_centroid(y=y, sr=sr)),
            "Spectral Bandwidth": np.mean(librosa.feature.spectral_bandwidth(y=y, sr=sr)),
            "Spectral Rolloff": np.mean(librosa.feature.spectral_rolloff(y=y, sr=sr)),
            "MFCC Mean": np.mean(librosa.feature.mfcc(y=y, sr=sr), axis=1).tolist(),
            "Pitch (Fundamental Frequency)": np.mean(librosa.yin(y, fmin=50, fmax=500, sr=sr)),
        }
        

        return features
    except Exception as e:
        print(f"Error processing {wav_file}: {str(e)}")
        return None


def save_to_csv(features_list, output_csv):
    df = pd.DataFrame([f for f in features_list if f is not None])
    
    if "MFCC Mean" in df.columns:
        mfcc_df = pd.DataFrame(df.pop("MFCC Mean").tolist(), columns=[f"MFCC_{i+1}" for i in range(20)])
        df = pd.concat([df, mfcc_df], axis=1)
    
    df.to_csv(output_csv, index=False)
    print(f"Features saved to {output_csv}")


def process_folder(input_folder):
    features_list = []
    for root, _, files in os.walk(input_folder):
        for file in files:
            if file.lower().endswith('.wav'):
                wav_file = os.path.join(root, file)
                print(f"Processing {wav_file}...")
                features = extract_acoustic_features(wav_file)
                if features:
                    features_list.append(features)
    return features_list


def main(input_folder, output_csv):
    print(f"Processing all .wav files in {input_folder} and its subfolders...")
    features_list = process_folder(input_folder)
    save_to_csv(features_list, output_csv)


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python script.py input_folder -o output.csv")
        sys.exit(1)


    input_folder = sys.argv[1]
    output_csv = sys.argv[3]


    main(input_folder, output_csv)