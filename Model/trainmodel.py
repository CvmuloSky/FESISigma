import pandas as pd
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
import matplotlib.pyplot as plt
from Attention_Model import LSTMv3  

# Define your dataset class
class SpeechDataset(Dataset):
    def __init__(self, features, labels):
        self.features = features
        self.labels = labels

    def __len__(self):
        return len(self.features)

    def __getitem__(self, idx):
        return (torch.tensor(self.features[idx], dtype=torch.float32),
                torch.tensor(self.labels[idx], dtype=torch.float32))

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

    features = data.select_dtypes(include=[np.number]).drop(columns=['Label']).values
    labels = data['Label'].values

    scaler = StandardScaler()
    features = scaler.fit_transform(features)

    return features, labels

def evaluate_accuracy(model, dataloader, device):
    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for features, labels in dataloader:
            features, labels = features.to(device), labels.to(device)
            outputs = model(features).squeeze()
            predictions = (torch.sigmoid(outputs) > 0.5).float()
            correct += (predictions == labels).sum().item()
            total += labels.size(0)
    return correct / total if total > 0 else 0

def train_model(model, train_loader, val_loader, criterion, optimizer, device, epochs=10):
    model.to(device)
    epoch_losses = []     
    train_accuracies = []  
    val_accuracies = []  
    for epoch in range(epochs):
        model.train()
        epoch_loss = 0
        total = 0
        correct = 0

        for features, labels in train_loader:
            features, labels = features.to(device), labels.to(device)
            optimizer.zero_grad()

            outputs = model(features)
            loss = criterion(outputs.squeeze(), labels)
            loss.backward()
            optimizer.step()

            epoch_loss += loss.item()

            predictions = (torch.sigmoid(outputs.squeeze()) > 0.5).float()
            correct += (predictions == labels).sum().item()
            total += labels.size(0)

        average_loss = epoch_loss / len(train_loader)
        train_accuracy = correct / total

        val_accuracy = evaluate_accuracy(model, val_loader, device)

        epoch_losses.append(average_loss)
        train_accuracies.append(train_accuracy)
        val_accuracies.append(val_accuracy)

        print(f"Epoch {epoch + 1}/{epochs}: Loss = {average_loss:.4f}, "
              f"Train Acc = {train_accuracy * 100:.2f}%, Val Acc = {val_accuracy * 100:.2f}%")

    plt.figure(figsize=(12, 5))
    
    plt.subplot(1, 2, 1)
    plt.plot(range(1, epochs + 1), epoch_losses, marker='o', label='Training Loss')
    plt.xlabel('Epochs')
    plt.ylabel('Loss')
    plt.title('Training Loss Over Epochs')
    plt.legend()
    plt.grid()

    plt.subplot(1, 2, 2)
    plt.plot(range(1, epochs + 1), train_accuracies, marker='o', label='Training Accuracy')
    plt.plot(range(1, epochs + 1), val_accuracies, marker='o', label='Validation Accuracy')
    plt.xlabel('Epochs')
    plt.ylabel('Accuracy')
    plt.title('Training vs Validation Accuracy')
    plt.legend()
    plt.grid()

    plt.tight_layout()
    plt.savefig("training_and_accuracy_graphs.png")
    plt.show()

def evaluate_model(model, X_test, y_test, device):
    model.eval()
    with torch.no_grad():
        X_test_tensor = torch.tensor(X_test, dtype=torch.float32).to(device)
        y_test_tensor = torch.tensor(y_test, dtype=torch.float32).to(device)

        outputs = model(X_test_tensor).squeeze()
        predictions = (torch.sigmoid(outputs) > 0.5).float()
        accuracy = (predictions == y_test_tensor).float().mean().item()

    print(f"Test Set Accuracy: {accuracy * 100:.2f}%")

if __name__ == "__main__":
    file_path_dysarthria = r"Data\Compiled Data\FESI DATASET - Dysarthria.csv"
    file_path_control = r"Data\Compiled Data\FESI DATASET - Control.csv"

    data = load_data(file_path_dysarthria, file_path_control)
    features, labels = preprocess_data(data)

    X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.5, random_state=42)

    train_dataset = SpeechDataset(X_train, y_train)
    val_dataset = SpeechDataset(X_test, y_test)

    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)

    input_size = features.shape[1]
    hidden_size = 128
    num_layers = 2
    output_size = 1

    model = LSTMv3(input_size, hidden_size, num_layers, output_size)
    criterion = torch.nn.BCEWithLogitsLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    train_model(model, train_loader, val_loader, criterion, optimizer, device, epochs=10)

    torch.save(model.state_dict(), "speechmodelv1.pth")
    print("Model training complete and saved as speechmodelv1.pth.")

    evaluate_model(model, X_test, y_test, device)
