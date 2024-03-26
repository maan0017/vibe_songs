import os

folder_path = "vibeSongs"

# List all files in the folder
files = os.listdir(folder_path)

# Print the full paths of the files
for file_name in files:
    print(file_name)
