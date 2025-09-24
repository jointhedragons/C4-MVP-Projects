# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from ai_travel_guide import AITravelGuide
import uvicorn

app = FastAPI(title="AI Travel Guide", version="1.0.0")

# Initialize AI guide
travel_guide = AITravelGuide(datasource='api', url='http://localhost:4000')

class TravelRequest(BaseModel):
    message: str

@app.get("/")
async def root():
    return {"message": "Welcome to AI Travel Guide! Use /plan to get recommendations"}

@app.post("/plan")
async def create_travel_plan(request: TravelRequest):
    """Create personalized travel plan"""
    try:
        travel_guide.load_data('hotels')
        travel_guide.load_data('activities')
        plan = travel_guide.generate_travel_plan(request.message)
        return {
            "success": True,
            "plan": plan
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/destinations")
async def get_available_destinations():
    """Get list of available destinations"""
    return {
        "destinations": ["Ao Nang", "Krabi", "Phuket", "Bangkok", "Chiang Mai"]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)