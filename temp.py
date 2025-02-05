import csv

# Input and output CSV file paths
input_file = "Data\Compiled Data\FESI DATASET - Dysarthria.csv"  # Replace with your input CSV file path
output_file = "Data\Compiled Data\Dysarthria.csv"  # Replace with your desired output CSV file path

# Open the input file and read its contents
with open(input_file, mode='r', newline='', encoding='utf-8') as infile:
    reader = csv.DictReader(infile)
    fieldnames = reader.fieldnames + ['Condition']  # Add the new column name
    
    # Open the output file and write the modified contents
    with open(output_file, mode='w', newline='', encoding='utf-8') as outfile:
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        
        # Write the header row
        writer.writeheader()
        
        # Write each row with the new column added
        for row in reader:
            row['Condition'] = 'Dysarthria'
            writer.writerow(row)

print(f"New CSV file with 'Condition' column added: {output_file}")
