import torch
from torch import nn
from tqdm import tqdm

class LSTMv1(nn.Module):
    def __init__(self, input_size, hidden_size, num_layers, output_size):
        super().__init__()
        self.lstm = nn.LSTM(input_size=input_size, hidden_size=hidden_size, num_layers=num_layers, batch_first = True)
        self.output = nn.Linear(in_features=hidden_size, out_features=output_size)
    def forward(self, x): 
        put, (h_n, c_n) = self.lstm(x)
        out = self.output(put)
        return out
    
