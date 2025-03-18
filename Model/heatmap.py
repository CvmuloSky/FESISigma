import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

# Load datasets
df_dysarthria = pd.read_csv("Model\Data\FESI DATASET - Dysarthria.csv")
df_healthy = pd.read_csv("Model\Data\FESI DATASET - Control.csv")

# Label the conditions
df_dysarthria['Condition'] = 1
df_healthy['Condition'] = 0

# Combine the datasets and drop non-numeric column(s)
df_combined = pd.concat([df_dysarthria, df_healthy], ignore_index=True)
df_numeric = df_combined.drop(columns=["Gender"])

# Compute the correlation matrix
correlation_matrix = df_numeric.corr()

# Create the heatmap
plt.figure(figsize=(12, 8))
ax = sns.heatmap(correlation_matrix, annot=True, cmap="coolwarm", fmt=".2f", cbar=True)
plt.title("Correlation Heatmap of Features with Condition (Healthy vs Dysarthria vs Parkinsons)")
plt.show()
