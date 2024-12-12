import torch
from torch import nn
import pandas as pd 
from Attention_Model import LSTMv3
from tqdm import tqdm
from torch.utils.data import TensorDataset, DataLoader

data = pd.read_csv("")
print(data.head(10))
