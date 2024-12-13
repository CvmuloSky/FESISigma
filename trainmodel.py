import pandas as pd
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from Attention_Model import *

class SpeechDataset(Dataset):
    def __init__(self, features, labels):
        self.features = features
        self.labels = labels

    def __len__(self):
        return len(self.features)

    def __getitem__(self, idx):
        return torch.tensor(self.features[idx], dtype=torch.float32), torch.tensor(self.labels[idx], dtype=torch.float32)

def load_data(file_path_dysarthria, file_path_control):
    data_dysarthria = pd.read_csv(file_path_dysarthria)
    data_control = pd.read_csv(file_path_control)

    data_dysarthria['Label'] = 1
    data_control['Label'] = 0

    combined_data = pd.concat([data_dysarthria, data_control], ignore_index=True)
    return combined_data

def preprocess_data(data):
    le = LabelEncoder()
    data['Gender'] = le.fit_transform(data['Gender'])


    features = data.drop(columns=['Label']).values
    labels = data['Label'].values


    scaler = StandardScaler()
    features = scaler.fit_transform(features)

    return features, labels

# training loop
def train_model(model, dataloader, criterion, optimizer, device, epochs=10):
    model.to(device)
    for epoch in range(epochs):
        model.train()
        epoch_loss = 0
        for features, labels in dataloader:
            features, labels = features.to(device), labels.to(device)

            optimizer.zero_grad()
            outputs = model(features)
            loss = criterion(outputs.squeeze(), labels)
            loss.backward()
            optimizer.step()

            epoch_loss += loss.item()

        print(f"Epoch {epoch + 1}/{epochs}, Loss: {epoch_loss / len(dataloader):.4f}")

def evaluate_model(model, X_test, y_test, device):
    model.eval()
    with torch.no_grad():
        X_test = torch.tensor(X_test, dtype=torch.float32).to(device)
        y_test = torch.tensor(y_test, dtype=torch.float32).to(device)

        outputs = model(X_test).squeeze()
        predictions = (torch.sigmoid(outputs) > 0.5).float()
        accuracy = (predictions == y_test).float().mean().item()

    print(f"Model Accuracy: {accuracy * 100:.2f}%")

if __name__ == "__main__":
    file_path_dysarthria = "Data\Compiled Data\FESI DATASET - Dysarthria.csv" #special
    file_path_control = "Data\Compiled Data\FESI DATASET - Control.csv" #normal


    data = load_data(file_path_dysarthria, file_path_control)
    features, labels = preprocess_data(data)

    X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)

    train_dataset = SpeechDataset(X_train, y_train)
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)

    input_size = features.shape[1] 
    hidden_size = 128
    num_layers = 2
    output_size = 1

    model = LSTMv3(input_size, hidden_size, num_layers, output_size)
    criterion = torch.nn.BCEWithLogitsLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    train_model(model, train_loader, criterion, optimizer, device, epochs=10)

    torch.save(model.state_dict(), "speechmodelv1.pth")
    print("Model training complete and saved as speechmodelv2.pth.")
    
    evaluate_model(model, X_test, y_test, device)