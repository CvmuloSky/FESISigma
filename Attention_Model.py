import torch
from torch import nn

class AttentionLayer(nn.Module):
    def __init__(self, hidden_size):
        super(AttentionLayer, self).__init__()
        self.hidden_size = hidden_size

        self.Wq = nn.Linear(hidden_size, hidden_size)
        self.Wk = nn.Linear(hidden_size, hidden_size)
        self.Wv = nn.Linear(hidden_size, hidden_size)

    def forward(self, hidden_states):
        query = self.Wq(hidden_states)  
        key = self.Wk(hidden_states)    
        value = self.Wv(hidden_states)  

        attention_scores = torch.matmul(query, key.transpose(-2, -1)) / (self.hidden_size ** 0.5)
        attention_weights = torch.nn.functional.softmax(attention_scores, dim=-1)
        output = torch.matmul(attention_weights, value)  

        return output

class LSTMv3(nn.Module):
    def __init__(self, input_size, hidden_size, num_layers, output_size):
        super(LSTMv3, self).__init__()
        self.attention = AttentionLayer(input_size)
        self.lstm1 = nn.LSTM(input_size=input_size, hidden_size=hidden_size, num_layers=num_layers, batch_first=True)
        self.batch_norm1 = nn.BatchNorm1d(hidden_size)
        self.dropout = nn.Dropout(0.5)
        self.lstm2 = nn.LSTM(input_size=hidden_size, hidden_size=hidden_size, num_layers=num_layers, batch_first=True)
        self.batch_norm2 = nn.BatchNorm1d(hidden_size)
        self.output = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        put = self.attention(x)
        put, (h_n, c_n) = self.lstm1(put)
        put = self.batch_norm1(put.transpose(1, 2)).transpose(1, 2)  
        put = self.dropout(put)
        put, (h_n, c_n) = self.lstm2(put)
        put = self.batch_norm2(put.transpose(1, 2)).transpose(1, 2)  
        out = self.output(put)  
        return out
