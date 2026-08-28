import os
import zipfile

def zip_project(output_filename="NutriMeasure-AI.zip", root_dir="."):
    ignore_dirs = {
        'node_modules', 'venv', '.git', '__pycache__', 'dist', 'build', '.pytest_cache', '.idea', '.vscode'
    }
    ignore_files = {
        output_filename, 'app.db', '.DS_Store', 'Thumbs.db'
    }

    print(f"Creating ZIP archive: {output_filename}...")
    file_count = 0
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(root_dir):
            # Prune ignored directories
            dirs[:] = [d for d in dirs if d not in ignore_dirs]
            
            for file in files:
                if file in ignore_files or file.endswith('.pyc') or file.endswith('.db'):
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, root_dir)
                zipf.write(file_path, arcname)
                file_count += 1

    print(f"Successfully packaged {file_count} files into {output_filename}")

if __name__ == "__main__":
    zip_project()
