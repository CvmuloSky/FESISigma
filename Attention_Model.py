import torch
from torch import nn

class MultiHeadAttention(torch.nn.Module):
    def __init__(self, hidden_size, num_heads):
        super(MultiHeadAttention, self).__init__()
        self.num_heads = num_heads
        self.hidden_size = hidden_size
        self.attention_heads = torch.nn.ModuleList([
            AttentionLayer(hidden_size) for _ in range(num_heads)
        ])

    def forward(self, hidden_states):
        outputs = [head(hidden_states) for head in self.attention_heads]
        return torch.cat(outputs, dim=-1)

class AttentionLayer(torch.nn.Module):
    def __init__(self, hidden_size):
        super(AttentionLayer, self).__init__()
        self.hidden_size = hidden_size

        self.Wq = torch.nn.Linear(hidden_size, hidden_size)
        self.Wk = torch.nn.Linear(hidden_size, hidden_size)
        self.Wv = torch.nn.Linear(hidden_size, hidden_size)

    def forward(self, hidden_states):
        query = self.Wq(hidden_states)
        key = self.Wk(hidden_states)
        value = self.Wv(hidden_states)

        attention_scores = torch.matmul(query, key.transpose(-2, -1)) / (self.hidden_size ** 0.5)
        attention_weights = torch.nn.functional.softmax(attention_scores, dim=-1)
        output = torch.matmul(attention_weights, value)

        return output

#lstmV3
class LSTMv3(torch.nn.Module):
    def __init__(self, input_size, hidden_size, num_layers, output_size, num_heads=8, dropout_rate=0.3):
        super(LSTMv3, self).__init__()
        self.attention = MultiHeadAttention(input_size, num_heads)
        self.lstm1 = torch.nn.LSTM(input_size=input_size * num_heads, hidden_size=hidden_size, num_layers=num_layers, batch_first=True, bidirectional=True)
        self.batch_norm1 = torch.nn.BatchNorm1d(hidden_size * 2)
        self.dropout = torch.nn.Dropout(dropout_rate)
        self.lstm2 = torch.nn.LSTM(input_size=hidden_size * 2, hidden_size=hidden_size, num_layers=num_layers, batch_first=True, bidirectional=True)
        self.batch_norm2 = torch.nn.BatchNorm1d(hidden_size * 2)
        self.output = torch.nn.Linear(hidden_size * 2, output_size)

    def forward(self, x):
        x = self.attention(x)
        x, (h_n, c_n) = self.lstm1(x)
        if len(x.shape) == 3:
            x = self.batch_norm1(x.transpose(1, 2)).transpose(1, 2)
        else:
            x = self.batch_norm1(x)
        x = self.dropout(x)
        x, (h_n, c_n) = self.lstm2(x)
        if len(x.shape) == 3:
            x = self.batch_norm2(x.transpose(1, 2)).transpose(1, 2)
        else:
            x = self.batch_norm2(x)
        out = self.output(x)
        return out