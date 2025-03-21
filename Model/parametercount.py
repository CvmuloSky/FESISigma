from Attention_Model import LSTMv3  

input_size = 28  
hidden_size = 128
num_layers = 2
output_size = 1

model = LSTMv3(input_size, hidden_size, num_layers, output_size)
total_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
print(f"Total number of trainable parameters: {total_params}")