import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df_dysarthria = pd.read_csv("Data\Compiled Data\FESI DATASET - Dysarthria.csv")
df_healthy = pd.read_csv("Data\Compiled Data\FESI DATASET - Control.csv")

df_dysarthria['Condition'] = 1
df_healthy['Condition'] = 0

df_combined = pd.concat([df_dysarthria, df_healthy], ignore_index=True)

df_numeric = df_combined.drop(columns=["Gender"])

correlation_matrix = df_numeric.corr()

plt.figure(figsize=(12, 8))
sns.heatmap(correlation_matrix, annot=True, cmap="coolwarm", fmt=".2f", cbar=True)
plt.title("Correlation Heatmap of Features with Condition (Healthy vs Dysarthria)")
plt.show()
