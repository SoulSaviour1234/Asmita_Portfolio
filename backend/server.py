from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone
import google.generativeai as genai
import time
import requests

# GitHub Cache
github_cache = {
    "data": None,
    "timestamp": 0.0
}
GITHUB_CACHE_DURATION = 86400  # 24 hours in seconds


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ChatMessage(BaseModel):
    message: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.get("/github")
async def get_github_contributions():
    current_time = time.time()
    
    # Check if cache is still valid
    if github_cache["data"] is not None and (current_time - github_cache["timestamp"]) < GITHUB_CACHE_DURATION:
        return github_cache["data"]
        
    pat = os.environ.get("GITHUB_PAT")
    user_name = "mishraasmita885-gif"
    
    if not pat:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="GitHub PAT is missing or invalid in environment variables")

    query = """
    query($userName:String!) {
      user(login: $userName){
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
    """
    
    headers = {
        "Authorization": f"Bearer {pat}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(
            "https://api.github.com/graphql",
            json={"query": query, "variables": {"userName": user_name}},
            headers=headers,
            timeout=10
        )
        
        if response.status_code != 200:
            from fastapi import HTTPException
            raise HTTPException(status_code=response.status_code, detail=f"GitHub API returned status code {response.status_code}")
            
        data = response.json()
        
        if "errors" in data:
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail=data["errors"])
            
        calendar = data.get("data", {}).get("user", {}).get("contributionsCollection", {}).get("contributionCalendar")
        if not calendar:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="No contribution data found for this user")
            
        github_cache["data"] = calendar
        github_cache["timestamp"] = current_time
        
        return calendar
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

@api_router.post("/chat")
async def chat_with_agent(input: ChatMessage):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        return {"response": "Error: Gemini API Key is missing or invalid in the backend. Please add it to your .env file."}
    
    try:
        genai.configure(api_key=api_key)
        system_prompt = (
            "You are Asmita's personalized AI agent, integrated into her Luminous Sakura portfolio website. "
            "You have complete knowledge of Asmita's background and achievements to answer visitor questions. "
            "Here is the context about Asmita Mishra:\n"
            "- Name: Asmita Mishra\n"
            "- Role: Full-Stack Engineer\n"
            "- Bio: Focuses on building high-performance architectures with Next.js and integrating advanced AI models into elegant web experiences.\n"
            "- Location: Kolkata, India (open for collaborations).\n"
            "- Experience Summary: 5+ products shipped, building since 2023 (~3 years).\n"
            "- Education:\n"
            "  * B.Tech in Computer Science & Engineering at Adamas University (Expected graduation: 2024 - 2028).\n"
            "  * CGPA: 8.9 in CSE.\n"
            "  * Coursework: Data Structures & Algorithms, DBMS, OOPs, AI, Machine Learning, Discrete Mathematics, and Software Engineering.\n"
            "  * Higher Secondary Education (Class XII) in 2024 at Uttar Bhagwanpur Nabarun Vidyapith(H.S).\n"
            "  * Secondary Education (Class X) in 2022 at Uttar Bhagwanpur Nabarun Vidyapith(H.S).\n"
            "- Experience:\n"
            "  * Freelance Developer & Digital Creator (Self-Employed, Jun 2026 - Present): Building freelance profiles on platforms like Contra and Upwork while developing portfolio projects in web development, AI, and software engineering. Focuses on client communication, project delivery, and professional branding.\n"
            "  * Hackathon & Technical Event Participant (2025 - Present): Participated in technical competitions, AI challenges, workshops, and innovation events. Collaborated on project ideation, problem-solving, and emerging technology exploration.\n"
            "- Technical Arsenal (Tech Stack):\n"
            "  * Next.js (Full-Stack Architecture)\n"
            "  * Gemini 2.5 (AI Integration)\n"
            "  * React 19 (UI Engineering)\n"
            "  * Tailwind v4 (Styling)\n"
            "  * FastAPI (Async Backends)\n"
            "  * Supabase (Database & Auth)\n"
            "  * PostgreSQL (Relational DB)\n"
            "- Featured Projects:\n"
            "  * Dr. Brinjal (AI & Multimodal): An AI-driven system utilizing a CNN ensemble and multimodal analysis for the robust classification of eggplant leaf diseases. Built with Python, PyTorch, OpenCV, and FastAPI. Live link: https://dr-brinjal.vercel.app/\n"
            "  * Plus, three projects in stealth mode currently in development.\n\n"
            "Instructions:\n"
            "1. Answer questions accurately and concisely based on this context.\n"
            "2. Keep your tone professional, polite, and slightly playful.\n"
            "3. Feel free to use markdown formatting (like **bold** or *italic* text) to make responses readable, as the frontend fully parses it.\n"
            "4. If a question is unrelated to Asmita's profile, career, or projects, politely steer the conversation back to her portfolio."
        )

        models_to_try = [
            'gemini-3.5-flash',
            'gemini-2.5-pro',
            'gemini-3.1-pro-preview',
            'gemini-2.5-flash',
            'gemini-2.0-flash',
            'gemini-pro-latest'
        ]
        
        last_error = None
        for model_name in models_to_try:
            try:
                model = genai.GenerativeModel(
                    model_name,
                    system_instruction=system_prompt
                )
                response = model.generate_content(input.message)
                if response.text:
                    return {"response": response.text}
            except Exception as e:
                logger.warning(f"Model {model_name} failed: {e}")
                last_error = e
                continue
                
        # If all models fail
        logger.error(f"All fallback models failed. Last error: {last_error}")
        return {"response": "Sorry, I'm having trouble connecting to my brain right now. Please try again later."}
        
    except Exception as e:
        logger.error(f"Error calling Gemini: {e}")
        return {"response": "Sorry, I'm having trouble connecting to my brain right now."}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()