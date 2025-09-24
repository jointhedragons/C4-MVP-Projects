import os
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()


available_models = [
    "gemini-2.5-flash-lite"
]


def get_llm(model: str):
    if model not in available_models:
        raise ValueError(f"Invalid model. Available models: {available_models.iteams()}")

    if model in ["gemini-2.5-flash-lite"]:
        return ChatGoogleGenerativeAI(model=model, google_api_key=os.getenv("GOOGLE_API_KEY"))


    raise ValueError(f"Model '{model}' is not supported.") 
