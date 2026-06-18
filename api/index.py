import sys
import os

# Add the root directory to the python path so it can find the backend module
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from backend.server import app
