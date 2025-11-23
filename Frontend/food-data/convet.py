import pandas as pd
import sys
import os

def excel_to_csv(input_file, output_file=None, sheet_name=0):
    # If output file not provided, create one with .csv extension
    if output_file is None:
        output_file = os.path.splitext(input_file)[0] + ".csv"

    try:
        # Read Excel sheet
        df = pd.read_excel(input_file, sheet_name=sheet_name)

        # Save to CSV
        df.to_csv(output_file, index=False)

        print(f"Successfully converted '{input_file}' → '{output_file}'")

    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python excel_to_csv.py <input_excel_file> [output_csv_file] [sheet_name]")
    else:
        input_file = sys.argv[1]
        output_file = sys.argv[2] if len(sys.argv) > 2 else None
        sheet_name = sys.argv[3] if len(sys.argv) > 3 else 0
        excel_to_csv(input_file, output_file, sheet_name)
