# list_models.py
"""Utility script to list all Gemini models available to your API key.

Usage:
    1. Ensure `google-generativeai` is installed in your backend venv:
          .\\venv\\Scripts\\pip install -U google-generativeai
    2. Set your API key in `backend/.env` as `GEMINI_API_KEY=YOUR_KEY`.
    3. Run the script from the `backend` directory:
          python list_models.py
"""

import os
from pathlib import Path

# Try to read GEMINI_API_KEY from environment first
api_key = os.getenv("GEMINI_API_KEY")

# If not in environment, parse the local .env file manually to avoid dependency on python-dotenv
if not api_key:
    env_path = Path(__file__).parent / ".env"
    if env_path.exists():
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("GEMINI_API_KEY="):
                    api_key = line.split("=", 1)[1].strip().strip('"').strip("'")
                    break

if not api_key or api_key == "your_api_key_here":
    raise RuntimeError("GEMINI_API_KEY not found or not configured in backend/.env")

# Import the Google Generative AI client
import google.generativeai as genai

# Configure the client with the API key
genai.configure(api_key=api_key)

# Fetch the list of models the key has access to
models = genai.list_models()

print("Available Gemini models for this API key:\n")
for m in models:
    # Model name, version, and description (if any)
    name = m.name
    version = getattr(m, "version", "N/A")
    description = getattr(m, "description", "")
    print(f"- {name} (version: {version})")
    if description:
        print(f"    {description}\n")
