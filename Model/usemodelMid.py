import torch
import numpy as np
import pandas as pd
import librosa
import librosa.display
import matplotlib.pyplot as plt
from ExtractParams import extract_acoustic_features
from Attention_Model import LSTMv3

def load_model(model_path, input_size, hidden_size, num_layers, output_size, device):
    model = LSTMv3(input_size, hidden_size, num_layers, output_size)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device)
    model.eval()
    return model

def preprocess_features(features):
    mfcc_features = np.array(features.pop("MFCC Mean"), dtype=np.float32)

    other_features = [value for key, value in features.items() if isinstance(value, (int, float))]

    flat_features = np.concatenate([other_features, mfcc_features])

    if len(flat_features) < 28:
        flat_features = np.pad(flat_features, (0, 28 - len(flat_features)), mode='constant')
    elif len(flat_features) > 28:
        raise ValueError(f"Feature vector length exceeds expected size: got {len(flat_features)}")

    return flat_features



def plot_waveform_and_features(wav_file, features, prediction):
    y, sr = librosa.load(wav_file, sr=None)
    plt.figure(figsize=(12, 8))

    plt.subplot(2, 1, 1)
    librosa.display.waveshow(y, sr=sr, alpha=0.8)
    plt.title("Waveform")
    plt.xlabel("Time (s)")
    plt.ylabel("Amplitude")

    plt.subplot(2, 1, 2)
    feature_text = "\n".join([f"{key}: {value:.2f}" if isinstance(value, (float, int)) else f"{key}: {value}" for key, value in features.items() if key != "MFCC Mean"])
    feature_text += f"\nPrediction: {'Dysarthria' if prediction > 0.5 else 'Control (Healthy)'}"
    plt.text(0.5, 0.5, feature_text, fontsize=12, va='center', ha='center', bbox=dict(boxstyle="round,pad=0.5", edgecolor="black", facecolor="lightblue"))
    plt.axis("off")

    plt.tight_layout()
    plt.show()

def predict(file_path, model, device):
    features = extract_acoustic_features(file_path)
    if features is None:
        print(f"Failed to process {file_path}.")
        return None

    if "Gender" in features:
        del features["Gender"]

    print("Extracted features (without gender):", features)

    processed_features = preprocess_features(features)
    input_tensor = torch.tensor(processed_features, dtype=torch.float32).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(input_tensor).squeeze()
        prediction = torch.sigmoid(output).item()

    return features, prediction


def main():
    wav_file = "Model\TestSamples\TestSample(4).wav"
    model_path = "Model\speechmodelvi.pth"

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


    input_size = 28  
    hidden_size = 128
    num_layers = 2
    output_size = 1


    model = load_model(model_path, input_size, hidden_size, num_layers, output_size, device)

    
    result = predict(wav_file, model, device)
    if result is not None:
        features, prediction = result
        print(f"Prediction for {wav_file}: {prediction * 150:.4f}% Control")
        plot_waveform_and_features(wav_file, features, prediction)

if __name__ == "__main__":
    main()
